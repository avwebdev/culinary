import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
// import { DrizzleAdapter } from "@auth/drizzle-adapter";
// import { db } from "./db";
// import { users } from "./schema";

// Check if Google credentials are available
const hasGoogleCredentials = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;

const providers = [];

// Only add Google provider if credentials are available
if (hasGoogleCredentials) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // adapter: DrizzleAdapter(db), // Temporarily disabled for testing
  providers,
  callbacks: {
    async session({ session, user, token }) {
      if (session.user) {
        session.user.id = user?.id || token?.sub || "temp-user-id";
        
        // Check if user email matches admin email
        const isAdmin = session.user.email === "kethan@vegunta.com" || session.user.email === "aarushtahiliani8@gmail.com";
        session.user.role = isAdmin ? "admin" : (typeof user?.role === 'string' ? user.role : typeof token?.role === 'string' ? token.role : "user");
        session.user.schoolId = typeof user?.schoolId === 'string' ? user.schoolId : typeof token?.schoolId === 'string' ? token.schoolId : null;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // Check if user email matches admin email
        const isAdmin = user.email === "kethan@vegunta.com" || user.email === "aarushtahiliani8@gmail.com";
        token.role = isAdmin ? "admin" : (user.role ?? "user");
        token.schoolId = user.schoolId;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: "jwt",
  },
});
