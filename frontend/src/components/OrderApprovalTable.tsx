"use client";

import { useState } from "react";
import { Order, approveOrder, rejectOrder } from "@/lib/api/orders";

interface OrderApprovalTableProps {
  orders: Order[];
  onOrdersUpdated: () => void;
}

export default function OrderApprovalTable({
  orders,
  onOrdersUpdated,
}: OrderApprovalTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async (orderId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await approveOrder(orderId);
      onOrdersUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve order");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (orderId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await rejectOrder(orderId, rejectionReason);
      setSelectedOrder(null);
      setRejectionReason("");
      onOrdersUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject order");
    } finally {
      setIsLoading(false);
    }
  };

  if (orders.length === 0) {
    return <div>No pending orders.</div>;
  }

  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Order ID
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Customer Email
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                School
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Items
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Delivery Date
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Submitted
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {String(order.id).slice(0, 8)}...
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {order.userEmail}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {order.school?.name || "-"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {order.lines.length} item(s)
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {order.deliveryDate ? new Date(order.deliveryDate + "T00:00:00").toLocaleDateString() : "-"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleApprove(order.id)}
                      disabled={isLoading}
                      className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setSelectedOrder(order.id)}
                      disabled={isLoading}
                      className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm"
                    >
                      Reject
                    </button>
                  </div>

                  {selectedOrder === order.id && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                      <p className="text-sm mb-2">Rejection reason (optional):</p>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Explain why this order is being rejected..."
                        className="w-full p-2 border border-gray-300 rounded text-sm mb-2"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReject(order.id)}
                          disabled={isLoading}
                          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm"
                        >
                          Confirm Reject
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(null);
                            setRejectionReason("");
                          }}
                          disabled={isLoading}
                          className="bg-gray-300 hover:bg-gray-400 disabled:bg-gray-400 text-black px-3 py-1 rounded text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
