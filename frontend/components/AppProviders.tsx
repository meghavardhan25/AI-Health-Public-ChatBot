"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { GoogleOAuthProviderWrapper } from "@/components/GoogleOAuthWrapper";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <GoogleOAuthProviderWrapper>
        <AuthProvider>{children}</AuthProvider>
      </GoogleOAuthProviderWrapper>
    </LocaleProvider>
  );
}
