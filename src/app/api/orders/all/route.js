import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/orderModel";
import { UTApi } from "uploadthing/server";

export async function POST(request) {
  await connectDB();
  const data = await request.json();

  try {
    // Validate top-level required fields
    if (!data.user || !data.files?.length || !data.customerName || !data.email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new Order using nested schema structure
    const newOrder = await Order.create({
      user: data.user,
      customerName: data.customerName,
      email: data.email,
      files: data.files.map(file => ({
        file: {
          name: file.file?.name,
          size: file.file?.size,
          type: file.file?.type
        },
        uploadData: {
          url: file.uploadData?.url,
          key: file.uploadData?.key,
          filename: file.uploadData?.filename || file.file?.name
        },
        printOptions: {
          colorPages: file.printOptions?.colorPages || "none",
          bwPages: file.printOptions?.bwPages || "none",
          printStyle: file.printOptions?.printStyle || "single",
          copies: file.printOptions?.copies || 1,
          binding: file.printOptions?.binding || "none"
        }
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

    // Cleanup: Attempt to delete uploaded files if creation failed
    if (data?.files?.length) {
      const utapi = new UTApi();
      await Promise.all(
        data.files.map(file => {
          const key = file.uploadData?.key;
          return key ? utapi.deleteFiles(key).catch(e => console.error("Cleanup failed:", e)) : null;
        })
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
  const orderId = searchParams.get("id");

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
      message: "Order deleted",
    });

  } catch (err) {
    console.error("Order deletion error:", err);
    return NextResponse.json(
      { error: "Deletion failed", details: err.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  await connectDB();

  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
