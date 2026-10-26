import { redirect } from "next/navigation";

// El dashboard ya no pide contraseña; se conserva la ruta para los enlaces viejos.
export default function DashboardLoginPage() {
  redirect("/dashboard");
}
