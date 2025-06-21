import { connectDB } from "@/lib/db";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

// GET /api/users/email?email=...
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });

  } catch (err) {
    console.error("Fetch user by email error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
