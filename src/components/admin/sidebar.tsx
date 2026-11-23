import Link from "next/link";

export function AdminSidebar() {
  return <aside className="admin-sidebar">
    <Link href="/admin" className="brand" style={{color:"#fff"}}>★ Ceylon Compass Admin</Link>
    <Link href="/admin/tours">Tour Packages</Link>
    <Link href="/admin/bookings">Bookings</Link>
    <Link href="/admin/customers">Customers</Link>
    <Link href="/admin/media">Media Library</Link>
    <Link href="/admin/settings">Settings</Link>
  </aside>;
}
