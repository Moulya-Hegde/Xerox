import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/orderModel";
import { UTApi } from "uploadthing/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
  await connectDB();

  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.user || !data.files?.length || !data.customerName || !data.email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create order with 7-day auto-expiry
    const newOrder = await Order.create({
      user: data.user,
      customerName: data.customerName,
      email: data.email,
      files: data.files.map(file => ({
        url: file.url,
        key: file.key,
        filename: file.filename,
        pages: file.pages,
        color: file.color,
        copies: file.copies || 1,
        paperSize: file.paperSize || "A4"
      })),
      payment: {
        mode: data.payment?.mode || null,
        amount: data.payment?.amount || 0
      },
      orderStatus: "received"
    });

    return NextResponse.json({
      success: true,
      orderId: newOrder._id,
      expiresAt: newOrder.expiresAt
    });

  } catch (err) {
    console.error("Order creation error:", err);
    
    // Auto-delete uploaded files if order creation failed
    if (data?.files) {
      const utapi = new UTApi();
      await Promise.all(
        data.files.map(file => 
          utapi.deleteFiles(file.key).catch(e => console.error("File cleanup failed:", e))
        )
      );
    }

    return NextResponse.json(
      { 
        error: "Order creation failed",
        details: err.message 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('id');

  if (!orderId) {
    return NextResponse.json(
      { error: "Order ID required" },
      { status: 400 }
    );
  }

  try {
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order deleted"
    });

  } catch (err) {
    console.error("Order deletion error:", err);
    return NextResponse.json(
      { error: "Deletion failed", details: err.message },
      { status: 500 }
    );
  }
}