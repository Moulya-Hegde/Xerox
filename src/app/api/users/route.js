import { NextResponse } from "next/server";
import {connectDB} from "@/lib/db";
import User from "@/models/userModel";


export async function GET() {
  try {
    await connectDB();

    const users = await User.find().sort({ createdAt: -1 }); // latest first

    return NextResponse.json({ success: true, users }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST /api/users
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { uid, name, email, phone } = body;

    if (!uid || !name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let user = await User.findOne({ uid });

    if (!user) {
      user = await User.create({ uid, name, email, phone });
    }

    return NextResponse.json({ success: true, user }, { status: 200 });

  } catch (error) {
    console.error("Error creating/fetching user:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
