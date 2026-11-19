import { AdminShell } from "@/components/admin/admin-shell";
import { requirePermission } from "@/lib/permissions";
import "./tours/tours-admin.css";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requirePermission("ADMIN_ACCESS");
  return <AdminShell>{children}</AdminShell>;
}
