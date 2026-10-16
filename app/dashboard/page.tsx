import type { Metadata } from "next";
import { DashboardClient } from "./DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard interno — FOCUS Hub",
  robots: { index: false, follow: false },
};

// Protegida por middleware.ts: sin la cookie de sesión redirige a /dashboard/login.
export default function DashboardPage() {
  return <DashboardClient />;
}
