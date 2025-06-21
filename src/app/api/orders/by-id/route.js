// src/app/api/orders/by-id/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/orderModel";
import mongoose from "mongoose";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");

  if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
    return NextResponse.json(
      { success: false, error: "Invalid or missing order ID" },
      { status: 400 }
    );
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
