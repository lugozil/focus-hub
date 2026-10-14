import type { Metadata } from "next";
import { DashboardPreview } from "./DashboardPreview";

export const metadata: Metadata = {
  title: "Dashboard (vista previa) — FOCUS Hub",
  robots: { index: false, follow: false },
};

export default function DashboardPreviewPage() {
  return <DashboardPreview />;
}
