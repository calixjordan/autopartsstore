import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Instant Admin Access Account Intercept
    if (email.toLowerCase() === "admin@autoparts.in") {
      return NextResponse.json({
        id: "admin-user-id",
        email: "admin@autoparts.in",
        name: "Store Administrator",
        role: "admin"
      });
    }

    let user;
    try {
      // Find or create user in DB
      user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name: name || email.split("@")[0],
          },
        });
      }
      // Dynamically attach role to database user
      user = {
        ...user,
        role: "user"
      };
    } catch (dbError) {
      console.warn("[API Auth] DB offline, falling back to mock login:", dbError);
      // Fallback mock login for normal users if DB is offline
      user = {
        id: `mock-user-${Math.random().toString(36).slice(2, 9)}`,
        email,
        name: name || email.split("@")[0],
        role: "user"
      };
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[API Auth] Error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
