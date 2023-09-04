import "next-auth/jwt";
// import { DefaultJWT } from "next-auth/jwt";

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation

declare module "next-auth" {
  interface Session {
    user?: {
      role?: string;
      profileImage?: string;
      department?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    /** The user's role. */
    user?: {
      role?: string;
      profileImage?: string;
      department?: string;
    };
  }
}
