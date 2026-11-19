import { AdminShell } from "@/components/admin/admin-shell";
import "./tours/tours-admin.css";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AdminShell>{children}</AdminShell>;
}
