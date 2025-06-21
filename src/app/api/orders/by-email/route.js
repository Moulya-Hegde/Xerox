// src/app/api/orders/[email]/route.js
import { NextResponse } from "next/server";
import {connectDB} from "@/lib/db";
import Order from "@/models/orderModel";

export async function GET(req, { params }) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  console.log("Searching orders for email:", email); // 👈 debug log

  try {
    const orders = await Order.find({ email }).sort({ createdAt: -1 });
    console.log("Found orders:", orders.length); // 👈 debug log
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders by email" },
      { status: 500 }
    );
  }
}
