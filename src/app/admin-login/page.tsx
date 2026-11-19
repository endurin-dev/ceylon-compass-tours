import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

const features = [
  {
    icon: "📅",
    title: "Manage bookings",
    text: "Review, confirm or cancel customer bookings in real time.",
  },
  {
    icon: "🧭",
    title: "Tours & activities",
    text: "Update attractions, pricing and availability in a few clicks.",
  },
  {
    icon: "💬",
    title: "Customer enquiries",
    text: "Respond to messages and keep every guest conversation in one place.",
  },
  {
    icon: "📊",
    title: "Insights at a glance",
    text: "Track revenue, popular tours and upcoming arrivals.",
  },
];

const stats = [
  { value: "24/7", label: "Dashboard access" },
  { value: "100%", label: "Secure sessions" },
  { value: "1 place", label: "For all bookings" },
];

export default async function AdminLoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/admin");
  }

  return (
    <main className="admin-login">
      {/* Left: brand panel */}
      <section className="admin-login__brand">
        <div className="admin-login__brand-inner">
          <span className="admin-login__badge">Admin Portal</span>
          <h1 className="admin-login__headline">
            Welcome back to your <span>booking dashboard</span>
          </h1>
          <p className="admin-login__lead">
            Everything you need to run your tours, manage guests and keep
            your business moving, all in one secure place.
          </p>

          <ul className="admin-login__features">
            {features.map((f) => (
              <li key={f.title}>
                <span className="admin-login__feature-icon">{f.icon}</span>
                <div>
                  <strong>{f.title}</strong>
                  <p>{f.text}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="admin-login__stats">
            {stats.map((s) => (
              <div key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Right: sign-in card */}
      <section className="admin-login__panel">
        <div className="admin-login__card">
          <div className="admin-login__lock" aria-hidden="true">🔒</div>
          <h2>Admin sign in</h2>
          <p className="admin-login__sub">
            Use the admin credentials configured in your environment to
            access the booking dashboard.
          </p>

          <AdminLoginForm />

          <div className="admin-login__divider" />

          <ul className="admin-login__notes">
            <li>🔐 Your session is encrypted and protected.</li>
            <li>🚫 Authorised staff only. Access attempts are monitored.</li>
            <li>❓ Forgot your credentials? Contact the site administrator.</li>
          </ul>

          <Link href="/" className="admin-login__back">
            ← Back to website
          </Link>
        </div>

        <p className="admin-login__footer">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </section>
    </main>
  );
}