"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";

export type AuthUser = {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
};

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
};

type Action =
  | { type: "SET"; user: AuthUser; token: string }
  | { type: "CLEAR" }
  | { type: "DONE_LOADING" };

function reducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case "SET":
      return { user: action.user, token: action.token, loading: false };
    case "CLEAR":
      return { user: null, token: null, loading: false };
    case "DONE_LOADING":
      return { ...state, loading: false };
  }
}

const AuthContext = createContext<{
  state: AuthState;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
} | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    user: null,
    token: null,
    loading: true,
  });

  // Rehydrate from localStorage on first render
  useEffect(() => {
    const token = localStorage.getItem("hb_token");
    if (!token) {
      dispatch({ type: "DONE_LOADING" });
      return;
    }
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: { user: AuthUser }) => {
        dispatch({ type: "SET", user: data.user, token });
      })
      .catch(() => {
        localStorage.removeItem("hb_token");
        dispatch({ type: "DONE_LOADING" });
      });
  }, []);

  function login(token: string, user: AuthUser) {
    localStorage.setItem("hb_token", token);
    dispatch({ type: "SET", user, token });
  }

  function logout() {
    localStorage.removeItem("hb_token");
    dispatch({ type: "CLEAR" });
  }

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
