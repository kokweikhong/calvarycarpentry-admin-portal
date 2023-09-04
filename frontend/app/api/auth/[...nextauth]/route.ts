import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUserById } from "@/lib/query/users";
import axios from "axios";
import { NextAuthOptions } from "next-auth";
import { UserValues } from "@/types/user";
import { User } from "next-auth";
// import { getUserByEmail } from "@/lib/api/users";

const handler = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {},
      // credentials: {
      //   email: { label: "email", type: "text", placeholder: "jsmith" },
      //   password: { label: "Password", type: "password" }
      // },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const res = await axios.post(process.env.GET_USERS_URL_BY_EMAIL ?? "", {
          email: email,
          password: password,
        });
        // if (!res) return null;
        const user: UserValues = res.data;
        console.log(user);
        return {
          name: user.username,
          email: user.email,
          role: user.role,
          department: user.department,
          profileImage: user.profileImage,
        } as any;
      },
    }),
  ],
  // secret: process.env.NEXTAUTH_SECRET,
  secret: process.env.SECRET,
  pages: {
    signIn: "/users/auth/signin",
    signOut: "/users/auth/signout",
    error: "/users/auth/error", // Error code passed in query string as ?error=
    // verifyRequest: "/auth/verify-request", // (used for check email message)
  },
  // A database is optional, but required to persist accounts in a database
  // database: process.env.DATABASE_URL,
  callbacks: {
    jwt({ token, user }) {
      console.log(user);
      if (user) {
        token.name = user.name;
        token.email = user.email;
        // @ts-ignore
        token.role = user.role;
        // @ts-ignore
        token.profileImage = user.profileImage;
        // @ts-ignore
        token.department = user.department;
      }
      return token;
    },
    session({ session, token, user }) {
      session.user.name = token.name;
      session.user.role = token.role;
      session.user.profileImage = token.profileImage;
      session.user.department = token.department;
      session.user.email = token.email;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
