"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, ArrowLeft, Search, User, Building } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data
const orders = [
  {
    id: "1",
    customer: "John Smith",
    email: "john.smith@email.com",
    items: [
      { name: "Grilled Chicken Salad", quantity: 2, price: 12.99 },
      { name: "Fresh Fruit Bowl", quantity: 1, price: 8.5 },
    ],
    total: 34.48,
    status: "pending",
    orderDate: "2024-01-15T10:30:00Z",
    school: "Amador Valley High",
    specialRequests: "Extra dressing on the side",
    paymentStatus: "paid",
  },
  {
    id: "2",
    customer: "Sarah Johnson",
    email: "sarah.j@email.com",
    items: [
      { name: "Vegetarian Pasta", quantity: 1, price: 14.99 },
      { name: "Garlic Bread", quantity: 2, price: 3.5 },
    ],
    total: 21.99,
    status: "preparing",
    orderDate: "2024-01-15T11:15:00Z",
    school: "Foothill High",
    specialRequests: "",
    paymentStatus: "paid",
  },
  {
    id: "3",
    customer: "Mike Davis",
    email: "mike.davis@email.com",
    items: [
      { name: "Beef Burger", quantity: 1, price: 16.99 },
      { name: "French Fries", quantity: 1, price: 4.99 },
      { name: "Chocolate Milkshake", quantity: 1, price: 5.99 },
    ],
    total: 27.97,
    status: "ready",
    orderDate: "2024-01-15T12:00:00Z",
    school: "Village High",
    specialRequests: "Well done burger",
    paymentStatus: "paid",
  },
  {
    id: "4",
    customer: "Emily Wilson",
    email: "emily.w@email.com",
    items: [
      { name: "Caesar Salad", quantity: 1, price: 11.99 },
      { name: "Soup of the Day", quantity: 1, price: 6.99 },
      { name: "Iced Tea", quantity: 2, price: 3.5 },
    ],
    total: 25.98,
    status: "completed",
    orderDate: "2024-01-15T09:45:00Z",
    school: "Amador Valley High",
    specialRequests: "No croutons",
    paymentStatus: "paid",
  },
  {
    id: "5",
    customer: "David Brown",
    email: "david.brown@email.com",
    items: [
      { name: "Fish Tacos", quantity: 3, price: 13.99 },
      { name: "Rice and Beans", quantity: 1, price: 7.99 },
    ],
    total: 49.96,
    status: "pending",
    orderDate: "2024-01-15T13:20:00Z",
    school: "Foothill High",
    specialRequests: "Extra spicy",
    paymentStatus: "pending",
  },
];

const statusOptions = [
  "all",
  "pending",
  "preparing",
  "ready",
  "completed",
  "cancelled",
];
const schoolOptions = [
  "all",
  "Amador Valley High",
  "Foothill High",
  "Village High",
];

export default function AdminOrders() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [statusFilter, setStatusFilter] = useState("all");
  const [schoolFilter, setSchoolFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user?.role !== "admin") router.push("/auth/signin");
  }, [session, status, router]);

  useEffect(() => {
    let filtered = orders;
    if (statusFilter !== "all")
      filtered = filtered.filter((order) => order.status === statusFilter);
    if (schoolFilter !== "all")
      filtered = filtered.filter((order) => order.school === schoolFilter);
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id.includes(searchTerm)
      );
    }
    setFilteredOrders(filtered);
  }, [statusFilter, schoolFilter, searchTerm]);

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
    alert(`Order ${orderId} status updated to ${newStatus}`);
  };

  const getStatusColor = (st: string) => {
    const colors: { [key: string]: string } = {
      pending: "bg-yellow-100 text-yellow-800",
      preparing: "bg-blue-100 text-blue-800",
      ready: "bg-green-100 text-green-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[st] || "bg-gray-100 text-gray-800";
  };

  const getPaymentStatusColor = (st: string) => {
    return st === "paid"
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  };

  if (status === "loading" || !session || session.user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-4">
                <Link href="/admin">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">
                  Order Management
                </h1>
              </div>
              <p className="text-gray-600 mt-2">
                Manage and track all customer orders
              </p>
            </div>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <label htmlFor="search" className="sr-only">
                  Search
                </label>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  id="search"
                  type="text"
                  placeholder="Search by customer, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-md w-full"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={schoolFilter} onValueChange={setSchoolFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by school" />
                </SelectTrigger>
                <SelectContent>
                  {schoolOptions.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s === "all" ? "All Schools" : s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-2">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.id}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(order.orderDate).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                        <Badge
                          className={getPaymentStatusColor(order.paymentStatus)}
                        >
                          {order.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">
                          {order.customer}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {order.school}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Items</h4>
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm"
                        >
                          <span>
                            {item.quantity}x {item.name}
                          </span>
                          <span>
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 justify-between">
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-600">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {order.status === "pending" && (
                        <Button
                          onClick={() =>
                            updateOrderStatus(order.id, "preparing")
                          }
                          size="sm"
                          className="w-full"
                        >
                          Start Preparing
                        </Button>
                      )}
                      {order.status === "preparing" && (
                        <Button
                          onClick={() => updateOrderStatus(order.id, "ready")}
                          size="sm"
                          className="w-full"
                        >
                          Mark Ready
                        </Button>
                      )}
                      {order.status === "ready" && (
                        <Button
                          onClick={() =>
                            updateOrderStatus(order.id, "completed")
                          }
                          size="sm"
                          className="w-full"
                        >
                          Mark Completed
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center py-8">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-500">Try adjusting your filters.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
