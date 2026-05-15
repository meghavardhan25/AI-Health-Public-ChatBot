"use client";

import { useLocale, type AppLocale } from "@/contexts/LocaleContext";

export function AuthLocaleSelect() {
  const { locale, setLocale, supported } = useLocale();
  return (
    <div className="absolute right-4 top-4 z-10">
      <label className="sr-only" htmlFor="auth-locale">
        Language
      </label>
      <select
        id="auth-locale"
        value={locale}
        onChange={(e) => setLocale(e.target.value as AppLocale)}
        className="rounded-lg border border-[var(--border)] bg-white/90 px-2 py-1.5 text-xs font-medium text-[var(--foreground)] shadow-sm backdrop-blur dark:bg-slate-800/90"
      >
        {supported.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
}
