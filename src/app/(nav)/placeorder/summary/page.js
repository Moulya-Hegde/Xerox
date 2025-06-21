"use client";
import { useEffect, useState } from "react";

export default function SummaryPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("orderSummary");
    if (stored) setOrders(JSON.parse(stored));
  }, []);

  return (
    <main className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Order Summary</h1>
      {orders.map((order, idx) => (
        <div key={idx} className="mb-4 p-4 rounded bg-gray-800">
          <h2 className="text-lg font-semibold">{order.fileName}</h2>
          <p>Size: {(order.fileSize / 1024).toFixed(1)} KB</p>
          <p>Total Pages: {order.pageCount}</p>
          <p>Print Style: {order.printOptions.printStyle}</p>
          <p>Copies: {order.printOptions.copies}</p>
          <p>Color Pages: {order.printOptions.colorPages || order.printOptions.colorMode}</p>
          <p>B&W Pages: {order.printOptions.bwPages || order.printOptions.bwMode}</p>
        </div>
      ))}
    </main>
  );
}
