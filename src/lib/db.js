import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "PrintDB", // you can change this if needed
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log("MongoDB connected:", db.connection.host);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw new Error("MongoDB connection failed");
  }
};
