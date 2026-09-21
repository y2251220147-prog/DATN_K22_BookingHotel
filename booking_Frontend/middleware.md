/_ eslint-disable @typescript-eslint/no-explicit-any _/
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/verifyToken";

export default async function middleware(req: NextRequest) {
const authHeader = req.headers.get("Authorization");
const token = authHeader
? authHeader.split(" ")[1]
: req.cookies.get("token")?.value;

if (
(req.nextUrl.pathname === "/signIn" ||
req.nextUrl.pathname === "/signUp") &&
!token
) {
return NextResponse.next();
}

if (
(req.nextUrl.pathname === "/signIn" ||
req.nextUrl.pathname === "/signUp") &&
token
) {
return NextResponse.redirect(new URL("/", req.url));
}

if (req.nextUrl.pathname.startsWith("/profile") && !token) {
return NextResponse.redirect(new URL("/", req.url));
}

if (req.nextUrl.pathname === "/logOut") {
const response = NextResponse.redirect(new URL("/signIn", req.url));
response.cookies.set("token", "", {
httpOnly: true,
secure: true,
sameSite: "none",
maxAge: -1,
path: "/",
});

    return response;

}

if (!token) return NextResponse.redirect(new URL("/signIn", req.url));
const decoded: any = await decrypt(token);

if (!decoded) return NextResponse.redirect(new URL("/signIn", req.url));

if (req.nextUrl.pathname.startsWith("/admin")) {
if (decoded.userType !== "EMPLOYEE" && decoded.userType !== "ADMIN") {
return NextResponse.redirect(new URL("/", req.url));
} else {
return NextResponse.next();
}
}

return NextResponse.next();
}

export const config = {
matcher: [
"/admin/:path*",
"/signIn",
"/signUp",
"/logOut",
"/profile/:path*",
],
};
