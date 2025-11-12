import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getServerSession } from "next-auth";

export const config = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/new-user",
  },
  callbacks: {
    async session({ session, token, user }) {
      if (token) {
        // @ts-expect-error property is added
        session.jwt = token.jwt;
        // @ts-expect-error property is added
        session.id = token.id;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/${account.provider}/callback?access_token=${account.access_token}`
          );
          const data = await response.json();
          token.jwt = data.jwt;
          token.id = data.user.id;
        } catch (error) {
          console.error("Error in JWT callback:", error);
        }
      }
      return token;
    },
  },
} satisfies NextAuthOptions;

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, config);
}
