"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { getOrdersForApproval, Order } from "@/lib/api/orders";
import OrderApprovalTable from "@/components/OrderApprovalTable";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { formatDate, toISODateString } from "@/lib/date-utils";
import { type Matcher } from "react-day-picker";

export default function OrdersPage() {
  const { data: session } = useSession();
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getOrdersForApproval();
      setAllOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!session) return;
    fetchOrders();
  }, [session]);

  // Group orders by delivery date for calendar display
  const ordersByDate = useMemo(() => {
    const grouped: Record<string, { pending: number; approved: number; rejected: number; total: number }> = {};
    
    for (const order of allOrders) {
      const dateKey = order.deliveryDate || "unknown";
      if (!grouped[dateKey]) {
        grouped[dateKey] = { pending: 0, approved: 0, rejected: 0, total: 0 };
      }
      grouped[dateKey].total++;
      if (order.status === "pending") grouped[dateKey].pending++;
      else if (order.status === "approved") grouped[dateKey].approved++;
      else if (order.status === "rejected") grouped[dateKey].rejected++;
    }
    
    return grouped;
  }, [allOrders]);

  // Filter orders by selected date
  const filteredOrders = useMemo(() => {
    if (!selectedDate) return allOrders;
    
    const dateString = toISODateString(selectedDate);
    return allOrders.filter((order) => order.deliveryDate === dateString);
  }, [allOrders, selectedDate]);

  // Get dates with pending, approved, rejected orders for modifiers
  const datesWithPending = useMemo((): Matcher[] => {
    return Object.entries(ordersByDate)
      .filter(([, stats]) => stats.pending > 0)
      .map(([date]) => new Date(date));
  }, [ordersByDate]);

  const datesWithApproved = useMemo((): Matcher[] => {
    return Object.entries(ordersByDate)
      .filter(([, stats]) => stats.approved > 0)
      .map(([date]) => new Date(date));
  }, [ordersByDate]);

  if (!session) {
    return <div className="p-8">Please log in to access this page.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Order Management</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar View */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Delivery Calendar</h2>
            
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                hasPending: datesWithPending,
                hasApproved: datesWithApproved,
              }}
              modifiersClassNames={{
                hasPending: "bg-yellow-100 border-yellow-400 border",
                hasApproved: "bg-green-100 border-green-400 border",
              }}
            />

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-100 border border-yellow-400 rounded" />
                <span>Has Pending</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-100 border border-green-400 rounded" />
                <span>Has Approved</span>
              </div>
            </div>

            {selectedDate && (
              <button
                onClick={() => setSelectedDate(undefined)}
                className="mt-4 text-sm text-blue-600 hover:underline"
              >
                Clear filter
              </button>
            )}
          </div>

          {/* Summary Stats */}
          <div className="bg-white rounded-lg shadow p-4 mt-4">
            <h3 className="font-semibold mb-3">Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Pending:</span>
                <Badge variant="outline" className="bg-yellow-100">
                  {allOrders.filter((o) => o.status === "pending").length}
                </Badge>
              </div>
              {selectedDate && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>For {formatDate(selectedDate)}:</span>
                  <Badge variant="secondary">{filteredOrders.length}</Badge>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {selectedDate
                  ? `Orders for ${formatDate(selectedDate)}`
                  : "All Pending Orders"}
              </h2>
              {selectedDate && (
                <Badge variant="secondary">{filteredOrders.length} orders</Badge>
              )}
            </div>

            {isLoading ? (
              <div className="text-gray-600">Loading orders...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-gray-600">
                {selectedDate
                  ? "No orders for this date."
                  : "No pending orders at this time."}
              </div>
            ) : (
              <OrderApprovalTable
                orders={filteredOrders}
                onOrdersUpdated={fetchOrders}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
