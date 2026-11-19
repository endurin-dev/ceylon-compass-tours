import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD;

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/admin-login" },
  providers: [
    Credentials({
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");

        if (!email || !password) return null;

        if (adminEmail && adminPassword && email === adminEmail && password === adminPassword) {
          return {
            id: "env-admin",
            name: "Superstar Admin",
            email,
            role: "SUPER_ADMIN",
          };
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.active) return null;
        if (user.passwordHash !== password) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const tokenWithRole = token as typeof token & { role?: string };

      if (user) {
        tokenWithRole.role = (user as { role?: string }).role ?? "SUPER_ADMIN";
      }

      return tokenWithRole;
    },
    async session({ session, token }) {
      const sessionUser = session.user as DefaultSession["user"] & { id?: string; role?: string };
      const tokenWithRole = token as typeof token & { role?: string };

      sessionUser.id = token.sub ?? sessionUser.email ?? "admin";
      sessionUser.role = tokenWithRole.role ?? "SUPER_ADMIN";

      return { ...session, user: sessionUser };
    },
  },
});
