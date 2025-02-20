import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => token?.role === "user",
    },
  }
);

export const config = {
  matcher: ["/konto/:path*", "/zamowienia/:path*", "/koszyk/checkout"],
};
