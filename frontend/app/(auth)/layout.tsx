import Link from "next/link";
import { HeartPulse } from "lucide-react";
import { AuthLocaleSelect } from "@/components/AuthLocaleSelect";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-teal-50 via-white to-cyan-50 px-4 py-12 dark:from-slate-900 dark:via-slate-900 dark:to-teal-950/30">
      <AuthLocaleSelect />
      <div className="mb-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600">
            <HeartPulse className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-[var(--foreground)]">HealthBot</span>
        </Link>
      </div>
      {children}
    </div>
  );
}
