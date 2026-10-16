import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Acceso al dashboard — FOCUS Hub",
  robots: { index: false, follow: false },
};

export default function DashboardLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-silver-50 px-4">
      <LoginForm />
    </main>
  );
}
