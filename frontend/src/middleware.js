import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
    const token = request.cookies.get("token")?.value;
    // Removed unused 'url' variable

    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        // verify token using jose
        const secretKey = process.env.SECRET_KEY || "bresh-up-rahul-singh01062000";
        await jwtVerify(token, new TextEncoder().encode(secretKey));
        return NextResponse.next();
    } catch (err) {
        console.error("❌ Invalid token:", err);
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: ["/profile", "/roadmap/:id/edit", "/roadmap/:slug"],
};
