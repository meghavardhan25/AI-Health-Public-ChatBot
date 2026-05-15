"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

export function GoogleOAuthProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
  // If no client ID, render without the provider (Google sign-in won't appear)
  if (!clientId) return <>{children}</>;
  return <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>;
}
