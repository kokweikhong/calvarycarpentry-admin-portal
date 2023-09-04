// More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware
// export { default } from "next-auth/middleware";
import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  // function middleware(req) {
  //   console.log("token: ", req.nextauth.token);

  //   if (req.nextUrl.pathname.startsWith("/inventory"))
  //     return NextResponse.rewrite(
  //       new URL("/users/auth/signin?message=You Are Not Authorized!", req.url)
  //     );
  //   if (
  //     req.nextUrl.pathname.startsWith("/user") &&
  //     req.nextauth.token?.role !== "user"
  //   )
  //     return NextResponse.rewrite(
  //       new URL("/auth/login?message=You Are Not Authorized!", req.url)
  //     );
  // },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const path = req.nextUrl.pathname;

        // Check if the middleware is processing the
        // route which requires a specific role
        // if (req.nextUrl.pathname)
        if (
          path.startsWith("/users/form/update") ||
          path.startsWith("/users/form/delete")
        ) {
          return token?.role === "superadmin";
        }

        // By default return true only if the token is not null
        // (this forces the users to be signed in to access the page)
        return token !== null;
      },
    },
  }
);

export const config = {
  matcher: [
    "/inventory/:path*",
    "/users/form/update/:path*",
    "/users/form/delete/:path*",
    "/users/auth/profile/:path*",
  ],
};
