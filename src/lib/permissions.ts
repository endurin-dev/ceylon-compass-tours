import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function requirePermission(permission: string) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin-login");
  }

  const user = session.user as typeof session.user & { id?: string; role?: string };
  const role = user.role ?? "SUPER_ADMIN";

  if (role !== "SUPER_ADMIN") {
    throw new Error(`Insufficient permissions for ${permission}.`);
  }

  return { id: user.id ?? user.email ?? "admin", email: user.email, role };
}
