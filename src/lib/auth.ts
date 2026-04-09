import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions: AuthOptions = {
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password required");
                }

                let admin = null;
                try {
                    admin = await prisma.admin.findUnique({
                        where: { email: credentials.email },
                    });
                } catch (error) {
                    console.error("Auth DB lookup failed during login:", error);
                    return null;
                }

                if (!admin) {
                    throw new Error("Invalid credentials");
                }

                const isValid = await bcrypt.compare(credentials.password, admin.password);

                if (!isValid) {
                    throw new Error("Invalid credentials");
                }

                return {
                    id: admin.id,
                    email: admin.email,
                    name: admin.name,
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/admin/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
            } else if (token.email) {
                try {
                    // Fetch fresh data from DB on every request to ensure up-to-date name/email
                    const freshUser = await prisma.admin.findUnique({
                        where: { email: token.email as string },
                    });
                    if (freshUser) {
                        token.name = freshUser.name;
                        token.email = freshUser.email;
                    }
                } catch (error) {
                    console.error("Auth DB lookup failed while refreshing JWT:", error);
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
            }
            return session;
        },
    },
};
