"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useOrder } from "@/app/context/OrderContext";

export default function SummaryPage() {
  const { user } = useAuth();
  const { order, clearOrder } = useOrder();
  const files = order?.files || [];

  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [backendOrder, setBackendOrder] = useState(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const fetchUserId = async () => {
      if (!user?.email) return;
      try {
        const res = await fetch(`/api/users/email?email=${user.email}`);
        const data = await res.json();
        if (data?.user?._id) {
          setUserId(data.user._id);
        }
      } catch (err) {
        console.error("Error fetching user ID:", err);
      }
    };
    fetchUserId();
  }, [user]);

  const handleConfirmOrder = async () => {
    if (!userId) return alert("User ID not loaded");
    if (files.length === 0) return alert("No files in order");

    setLoading(true);
    setResponseMsg("");

    try {
      const payload = {
        user: userId,
        customerName: order.customerInfo.name,
        email: order.customerInfo.email,
        files: files.map((entry) => ({
          url: entry.uploadData?.url,
          key: entry.uploadData?.key,
          filename: entry.file?.name,
          pages:
            entry.printOptions?.colorPages !== "none"
              ? entry.printOptions.colorPages
              : entry.printOptions.bwPages,
          color:
            entry.printOptions?.colorPages !== "none" ? "color" : "bw",
          copies: entry.printOptions?.copies || 1,
          paperSize: "A4",
        })),
        payment: {
          mode: order.payment?.mode || null,
          amount: order.payment?.amount || 0,
        },
      };

      const res = await fetch("/api/orders/all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok && result.orderId) {
        setResponseMsg(`✅ Order placed! ID: ${result.orderId}`);
        setOrderId(result.orderId);

        const orderRes = await fetch(`/api/orders/by-id?orderId=${result.orderId}`);
        const orderData = await orderRes.json();
        if (orderData.success) {
          setBackendOrder(orderData.order);
        }

        setTimeout(() => {
          clearOrder();
        }, 3000);
      } else {
        setResponseMsg(`❌ Order failed: ${result.error}`);
      }
    } catch (err) {
      console.error("Submit failed:", err);
      setResponseMsg("❌ Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!hydrated) {
    return (
      <main className="p-6 text-white bg-black min-h-screen">
        <p>Loading summary...</p>
      </main>
    );
  }

  const orderFiles = backendOrder?.files || files;

  return (
    <main className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Order Summary</h1>

      {orderFiles.length === 0 ? (
        <p className="text-gray-400">No files uploaded yet.</p>
      ) : (
        <>
          {orderFiles.map((entry, idx) => (
            <div key={idx} className="mb-4 p-4 rounded bg-gray-800">
              <h2 className="text-lg font-semibold">
                {entry.filename || entry.file?.name || "Untitled"}
              </h2>
              <p>Copies: {entry.copies}</p>
              <p>Pages: {entry.pages}</p>
              <p>Color: {entry.color}</p>
              <p>Paper: {entry.paperSize || "A4"}</p>
              <p className="break-all text-sm text-teal-300">
                URL: {entry.url || entry.uploadData?.url || "Not uploaded"}
              </p>
            </div>
          ))}

          {/* Hide confirm button if order already placed */}
          {!orderId && (
            <button
              onClick={handleConfirmOrder}
              disabled={loading}
              className={`mt-4 w-full py-3 rounded font-semibold text-white ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Placing Order..." : "Confirm Order"}
            </button>
          )}

          {responseMsg && (
            <div className="mt-4 p-3 bg-gray-900 text-sm rounded">
              {responseMsg}
            </div>
          )}

          {orderId && (
            <div className="mt-4 text-green-400 text-sm">
              🕓 Order sent, waiting for confirmation and your bill.
            </div>
          )}
        </>
      )}
    </main>
  );
}
