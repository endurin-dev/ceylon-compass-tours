"use client";

import {
  BarChart3,
  Compass,
  CalendarDays,
  CreditCard,
  FileImage,
  FileText,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  MessageSquareText,
  Mountain,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/app/admin/theme-toggle";

const navigation = [
  {
    label: "WORKSPACE",
    items: [
      { label: "Overview", href: "/admin", icon: LayoutDashboard },
      { label: "Tour packages", href: "/admin/tours", icon: Mountain },
      { label: "Destinations", href: "/admin/destinations", icon: MapPin },
      { label: "Attractions", href: "/admin/attractions", icon: Compass },
      { label: "Activities", href: "/admin/activities", icon: Sparkles },
      { label: "Itineraries", href: "/admin/itineraries", icon: FileText },
      { label: "Departures & pricing", href: "/admin/departures", icon: CalendarDays },
    ],
  },
  {
    label: "TRAVEL OPERATIONS",
    items: [
      { label: "Bookings", href: "/admin/bookings", icon: WalletCards },
      { label: "Customers", href: "/admin/customers", icon: Users },
      { label: "Payments", href: "/admin/payments", icon: CreditCard },
      { label: "Enquiries", href: "/admin/enquiries", icon: MessageSquareText },
      { label: "Reviews", href: "/admin/reviews", icon: Star },
    ],
  },
  {
    label: "MANAGEMENT",
    items: [
      { label: "Media library", href: "/admin/media", icon: FileImage },
      { label: "Team", href: "/admin/team", icon: ShieldCheck },
      { label: "Website content", href: "/admin/website-content", icon: FileText },
      { label: "Reports", href: "/admin/reports", icon: BarChart3 },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export function AdminShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email?: string | null;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  function closeSidebar() {
    setSidebarOpen(false);
  }

  return (
    <div className={`admin-shell${sidebarCollapsed ? " is-sidebar-collapsed" : ""}`}>
      {sidebarOpen ? (
        <button
          className="admin-sidebar-scrim"
          aria-label="Close navigation"
          onClick={closeSidebar}
        />
      ) : null}
      <aside id="admin-navigation" className={`admin-sidebar${sidebarOpen ? " is-open" : ""}`}>
        <div className="admin-brand-row">
          <Link href="/admin" className="admin-brand" onClick={closeSidebar}>
            <span className="admin-brand-mark">S</span>
            <span>
              <strong>Superstar</strong>
              <small>TRAVEL ADMIN</small>
            </span>
          </Link>
          <button
            type="button"
            className="admin-sidebar-collapse"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
          >
            {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
          <button
            type="button"
            className="admin-sidebar-close"
            aria-label="Close navigation"
            onClick={(event) => {
              event.preventDefault();
              closeSidebar();
            }}
          >
            <X size={19} />
          </button>
        </div>

        <nav className="admin-nav" aria-label="Admin navigation">
          {navigation.map((group) => (
            <div className="admin-nav-group" key={group.label}>
              <p className="admin-nav-label">{group.label}</p>
              {group.items.map(({ label, href, icon: Icon }) => {
                const isActive =
                  href === "/admin"
                    ? pathname === href
                    : pathname === href || pathname.startsWith(`${href}/`);

                return (
                  <Link
                    key={href}
                    href={href}
                    className={`admin-nav-link${isActive ? " is-active" : ""}`}
                    title={label}
                    onClick={closeSidebar}
                  >
                    <Icon size={18} strokeWidth={1.8} />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-avatar">{(email?.[0] ?? "A").toUpperCase()}</div>
          <div className="admin-user-copy">
            <strong>Administrator</strong>
            <span title={email ?? undefined}>{email ?? "Admin account"}</span>
          </div>
          <button
            className="admin-user-menu"
            type="button"
            aria-label="Sign out"
            title="Sign out"
            onClick={() => signOut({ callbackUrl: "/admin-login" })}
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      <div className="admin-workspace">
        <header className="admin-topbar">
          <button
            type="button"
            className="admin-menu-toggle"
            aria-label="Open navigation"
            aria-expanded={sidebarOpen}
            aria-controls="admin-navigation"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={21} />
          </button>
          <div className="admin-topbar-context">
            <span>Superstar Travels</span>
            <span className="admin-topbar-divider">/</span>
            <strong>Admin workspace</strong>
          </div>
          <div className="admin-topbar-right">
            <ThemeToggle />
            <span className="admin-status-dot" />
            <span>Workspace active</span>
          </div>
        </header>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
