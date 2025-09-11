import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    schoolId?: string | null;
  }
  
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      schoolId?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    schoolId?: string | null;
  }
}
