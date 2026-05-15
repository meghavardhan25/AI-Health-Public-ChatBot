"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { api } from "@/lib/api";

type AuthResponse = {
  token: string;
  user: { id: string; name?: string | null; email: string; image?: string | null };
};

export default function SignupPage() {
  const { t } = useLocale();
  const { login } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { setError(t("password_too_short")); return; }
    setError(""); setLoading(true);
    try {
      const data = await api.post<AuthResponse>("/api/auth/register", { name, email, password });
      login(data.token, data.user);
      router.push("/chat");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("signup_failed"));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle(credentialResponse: { credential?: string }) {
    if (!credentialResponse.credential) return;
    setGoogleLoading(true); setError("");
    try {
      const data = await api.post<AuthResponse>("/api/auth/google", {
        credential: credentialResponse.credential,
      });
      login(data.token, data.user);
      router.push("/chat");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("google_failed"));
    } finally {
      setGoogleLoading(false);
    }
  }

  const hasGoogle = !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-[var(--border)] bg-white p-8 shadow-xl dark:bg-slate-800">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">{t("create_account")}</h1>
          <p className="mt-1.5 text-sm text-[var(--muted)]">{t("signup_blurb")}</p>
        </div>

        {hasGoogle && (
          <>
            <div className="flex justify-center">
              {googleLoading ? (
                <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                  <Loader2 className="h-4 w-4 animate-spin" /> {t("signing_google")}
                </div>
              ) : (
                <GoogleLogin
                  onSuccess={handleGoogle}
                  onError={() => setError(t("google_failed"))}
                  text="signup_with"
                  shape="rectangular"
                  theme="outline"
                  use_fedcm_for_button={false}
                />
              )}
            </div>
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-[var(--border)]" />
              <span className="text-xs text-[var(--muted)]">{t("or_divider")}</span>
              <div className="h-px flex-1 bg-[var(--border)]" />
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-400">{error}</div>
          )}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">{t("full_name")}</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Alex Johnson"
              className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 dark:bg-slate-700" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">{t("email")}</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 dark:bg-slate-700" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">{t("password")}</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} required minLength={8}
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder={t("password_min")}
                className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 pr-11 text-sm text-[var(--foreground)] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 dark:bg-slate-700" />
              <button type="button" onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)]">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-60">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("create_acct_btn")}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-[var(--muted)]">
          {t("have_account")}{" "}
          <Link href="/login" className="font-medium text-teal-600 hover:underline">{t("sign_in")}</Link>
        </p>
      </div>
    </div>
  );
}
