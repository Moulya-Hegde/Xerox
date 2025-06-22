import mongoose from "mongoose";

// File reference 
const fileSchema = new mongoose.Schema({
  file: {
    name: { type: String, required: true },
    size: { type: Number, required: true }, // in bytes
    type: { type: String, required: true }, // e.g., "application/pdf"
  },
  uploadData: {
    url: { type: String, required: true },     // UploadThing CDN URL
    key: { type: String, required: true },     // UploadThing file key
    filename: { type: String, required: true } // Original filename again (for redundancy)
  },
  printOptions: {
    colorPages: { type: String, required: true }, // e.g., "1,2,3" or "none"
    bwPages: { type: String, required: true },    // e.g., "all" or "none"
    printStyle: {
      type: String,
      enum: ["single", "double"],
      required: true,
    },
    copies: { type: Number, required: true, min: 1 },
    binding: {
      type: String,
      enum: ["none", "spiral", "staple", "clip"], // adjust as needed
      required: true,
    },
  }
}, { _id: false });


// Payment info (simplified)
const paymentSchema = new mongoose.Schema({
  mode: { 
    type: String, 
    enum: ["UPI", "Card", "Cash", "Other", null], 
    default: null 
  },
  transactionId: String,
  amount: { 
    type: Number, 
    required: true, 
    default: 0 
  },
}, { _id: false });

// Admin action (unchanged)
const adminActionSchema = new mongoose.Schema({
  status: { 
    type: String, 
    enum: ["pending", "accepted", "rejected"], 
    default: "pending" 
  },
  reason: String,
  actedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Admin" 
  },
  actedAt: Date,
}, { _id: false });

// Main Order Schema
const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  customerName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  files: { 
    type: [fileSchema], 
    required: true 
  },
  payment: { 
    type: paymentSchema, 
    required: true 
  },
  adminAction: { 
    type: adminActionSchema, 
    default: { status: "pending" } 
  },
  orderStatus: {
    type: String,
    enum: ["received", "processing", "ready"],
    default: "received"
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7-day TTL
    index: { expires: 0 } // Auto-deletes doc when reached
  }
}, { timestamps: true });

// Auto-delete files from Uploadthing when order is removed
orderSchema.post("findOneAndDelete", async (doc) => {
  if (doc?.files?.length) {
    const { UTApi } = await import("uploadthing/server");
    const utapi = new UTApi();
    await Promise.all(
      doc.files.map(file => 
        utapi.deleteFiles(file.key).catch(e => console.error("Failed to delete file:", e))
      )
    );
  }
});

export default mongoose.models.Order || mongoose.model("Order", orderSchema);