import NextAuth, { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import nodemailer from "nodemailer";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & { id: string };
  }
}

const transporter = nodemailer.createTransport({
  jsonTransport: true // dev-friendly: logs emails to console
});

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin"
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user?.password_hash) return null;
        const valid = await bcrypt.compare(credentials.password, user.password_hash);
        if (!valid) return null;
        return { id: user.id, email: user.email, name: user.name };
      }
    }),
    EmailProvider({
      server: transporter as any,
      from: process.env.SMTP_FROM || "noreply@example.com"
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      return session;
    }
  },
  cookies: {
    sessionToken: {
      name: `__Host-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path: "/"
      }
    }
  }
} satisfies NextAuthConfig;

export const { handlers: authHandlers, auth, signIn, signOut } = NextAuth(authConfig);
