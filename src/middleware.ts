export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/overview/:path*",
    "/analytics/:path*",
    "/models/:path*",
    "/users/:path*",
    "/billing/:path*",
    "/settings/:path*",
  ],
};
