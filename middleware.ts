import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const { nextUrl } = req;
    const cookie = req.cookies.get("next-auth.session-token");


    if (nextUrl.pathname.startsWith("/api/user") && cookie) {
        const redirectUrl = nextUrl.clone();
        redirectUrl.pathname = "/dashboard";
        return NextResponse.redirect(redirectUrl.toString());
    }

    
    if (nextUrl.pathname === "/" && cookie) {
        const redirectUrl = nextUrl.clone();
        redirectUrl.pathname = "/dashboard";
        return NextResponse.redirect(redirectUrl.toString());
    }

   
    return NextResponse.next();
}
