"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  XCircle,
  ArrowLeft,
  Search,
  Filter,
  Calendar,
  MapPin,
  Receipt
} from "lucide-react";
import Link from "next/link";

// Mock data - in real app this would come from the database
const orders = [
  {
    id: "1",
    date: "2024-01-15",
    time: "10:30 AM",
    items: [
      { name: "Grilled Chicken Salad", quantity: 2, price: 12.99 },
      { name: "Iced Tea", quantity: 1, price: 3.50 }
    ],
    total: 29.48,
    status: "completed",
    school: "Amador Valley High",
    pickupTime: "10:45 AM",
    specialRequests: "Extra dressing on the side"
  },
  {
    id: "2",
    date: "2024-01-12",
    time: "12:15 PM",
    items: [
      { name: "Beef Burger", quantity: 1, price: 16.99 },
      { name: "French Fries", quantity: 1, price: 4.99 }
    ],
    total: 21.98,
    status: "completed",
    school: "Amador Valley High",
    pickupTime: "12:30 PM",
    specialRequests: ""
  },
  {
    id: "3",
    date: "2024-01-10",
    time: "11:45 AM",
    items: [
      { name: "Vegetarian Pasta", quantity: 1, price: 14.99 },
      { name: "Garlic Bread", quantity: 2, price: 3.50 }
    ],
    total: 21.99,
    status: "completed",
    school: "Amador Valley High",
    pickupTime: "12:00 PM",
    specialRequests: "No cheese please"
  },
  {
    id: "4",
    date: "2024-01-08",
    time: "1:30 PM",
    items: [
      { name: "Caesar Salad", quantity: 1, price: 11.99 },
      { name: "Soup of the Day", quantity: 1, price: 6.99 },
      { name: "Iced Tea", quantity: 1, price: 3.50 }
    ],
    total: 22.48,
    status: "completed",
    school: "Amador Valley High",
    pickupTime: "1:45 PM",
    specialRequests: ""
  },
  {
    id: "5",
    date: "2024-01-05",
    time: "9:15 AM",
    items: [
      { name: "Fresh Fruit Bowl", quantity: 1, price: 8.50 },
      { name: "Iced Latte", quantity: 1, price: 4.99 }
    ],
    total: 13.49,
    status: "completed",
    school: "Amador Valley High",
    pickupTime: "9:30 AM",
    specialRequests: "Extra honey drizzle"
  }
];

const statusOptions = ["all", "pending", "preparing", "ready", "completed", "cancelled"];

export default function Orders() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/auth/signin");
    }
  }, [session, status, router]);

  useEffect(() => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.includes(searchTerm) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredOrders(filtered);
  }, [statusFilter, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "preparing":
        return <Clock className="h-4 w-4" />;
      case "ready":
        return <CheckCircle className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
          <p className="text-gray-600 mb-4">Please sign in to view your orders.</p>
          <Button onClick={() => router.push("/auth/signin")} className="bg-primary hover:bg-primary/90 text-white">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-4">
                <Link href="/">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
              </div>
              <p className="text-gray-600 mt-2">View your order history and track current orders</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-primary">{filteredOrders.length}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search by order ID or items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  onClick={() => {
                    setStatusFilter("all");
                    setSearchTerm("");
                  }}
                  variant="outline"
                  className="w-full bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Order Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(order.date).toLocaleDateString()} at {order.time}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(order.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(order.status)}
                            <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                          </div>
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{order.school}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">Picked up at {order.pickupTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Items</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.quantity}x {item.name}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    {order.specialRequests && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 font-medium">Special Requests:</p>
                        <p className="text-sm italic">{order.specialRequests}</p>
                      </div>
                    )}
                  </div>

                  {/* Order Total & Actions */}
                  <div className="flex flex-col space-y-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">${order.total.toFixed(2)}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          // In a real app, this would open a detailed view
                          alert(`Order #${order.id} details:\n\nItems: ${order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}\n\nTotal: $${order.total.toFixed(2)}\n\nStatus: ${order.status}\n\nPickup: ${order.school} at ${order.pickupTime}`);
                        }}
                      >
                        <Receipt className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          // In a real app, this would reorder the same items
                          alert("Reordering functionality will be available soon!");
                        }}
                      >
                        Reorder
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters or place your first order!</p>
                <Link href="/menu">
                  <Button className="bg-primary hover:bg-primary/90">
                    Browse Menu
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Order Statistics */}
        {filteredOrders.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Order Statistics</CardTitle>
              <CardDescription>Your ordering activity summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{filteredOrders.length}</p>
                  <p className="text-sm text-gray-500">Total Orders</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    ${filteredOrders.reduce((total, order) => total + order.total, 0).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">Total Spent</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    ${(filteredOrders.reduce((total, order) => total + order.total, 0) / filteredOrders.length).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">Average Order</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {filteredOrders.filter(order => order.status === "completed").length}
                  </p>
                  <p className="text-sm text-gray-500">Completed Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
