import { getSessionUser } from "@/lib/auth";
import { AdminLayoutShell } from "@/components/admin-layout-shell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  return <AdminLayoutShell userName={user?.name}>{children}</AdminLayoutShell>;
}
