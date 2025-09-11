"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  ArrowLeft,
  Search,
  Calendar,
  User
} from "lucide-react";
import Link from "next/link";

// Mock data - in real app this would come from the database
const orders = [
  {
    id: "1",
    customer: "John Smith",
    email: "john.smith@email.com",
    items: [
      { name: "Grilled Chicken Salad", quantity: 2, price: 12.99 },
      { name: "Fresh Fruit Bowl", quantity: 1, price: 8.50 }
    ],
    total: 34.48,
    status: "pending",
    orderDate: "2024-01-15T10:30:00Z",
    school: "Amador Valley High",
    specialRequests: "Extra dressing on the side",
    paymentStatus: "paid"
  },
  {
    id: "2",
    customer: "Sarah Johnson",
    email: "sarah.j@email.com",
    items: [
      { name: "Vegetarian Pasta", quantity: 1, price: 14.99 },
      { name: "Garlic Bread", quantity: 2, price: 3.50 }
    ],
    total: 21.99,
    status: "preparing",
    orderDate: "2024-01-15T11:15:00Z",
    school: "Foothill High",
    specialRequests: "",
    paymentStatus: "paid"
  },
  {
    id: "3",
    customer: "Mike Davis",
    email: "mike.davis@email.com",
    items: [
      { name: "Beef Burger", quantity: 1, price: 16.99 },
      { name: "French Fries", quantity: 1, price: 4.99 },
      { name: "Chocolate Milkshake", quantity: 1, price: 5.99 }
    ],
    total: 27.97,
    status: "ready",
    orderDate: "2024-01-15T12:00:00Z",
    school: "Village High",
    specialRequests: "Well done burger",
    paymentStatus: "paid"
  },
  {
    id: "4",
    customer: "Emily Wilson",
    email: "emily.w@email.com",
    items: [
      { name: "Caesar Salad", quantity: 1, price: 11.99 },
      { name: "Soup of the Day", quantity: 1, price: 6.99 },
      { name: "Iced Tea", quantity: 2, price: 3.50 }
    ],
    total: 25.98,
    status: "completed",
    orderDate: "2024-01-15T09:45:00Z",
    school: "Amador Valley High",
    specialRequests: "No croutons",
    paymentStatus: "paid"
  },
  {
    id: "5",
    customer: "David Brown",
    email: "david.brown@email.com",
    items: [
      { name: "Fish Tacos", quantity: 3, price: 13.99 },
      { name: "Rice and Beans", quantity: 1, price: 7.99 }
    ],
    total: 49.96,
    status: "pending",
    orderDate: "2024-01-15T13:20:00Z",
    school: "Foothill High",
    specialRequests: "Extra spicy",
    paymentStatus: "pending"
  }
];

const statusOptions = ["all", "pending", "preparing", "ready", "completed", "cancelled"];
const schoolOptions = ["all", "Amador Valley High", "Foothill High", "Village High"];

export default function AdminOrders() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [statusFilter, setStatusFilter] = useState("all");
  const [schoolFilter, setSchoolFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || session.user?.role !== "admin") {
      router.push("/auth/signin");
    }
  }, [session, status, router]);

  useEffect(() => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filter by school
    if (schoolFilter !== "all") {
      filtered = filtered.filter(order => order.school === schoolFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.includes(searchTerm)
      );
    }

    setFilteredOrders(filtered);
  }, [statusFilter, schoolFilter, searchTerm]);

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    // In a real app, this would update the database
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
    // For now, just show an alert
    alert(`Order ${orderId} status updated to ${newStatus}`);
  };

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

  const getPaymentStatusColor = (status: string) => {
    return status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don&apos;t have permission to access this page.</p>
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
                <Link href="/admin">
                                  <Button variant="ghost" size="sm" className="bg-gray-100 hover:bg-gray-200 text-gray-700">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
              </div>
              <p className="text-gray-600 mt-2">Manage and track all customer orders</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-emerald-600">{filteredOrders.length}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search by customer, email, or order ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">School</label>
                <select
                  value={schoolFilter}
                  onChange={(e) => setSchoolFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {schoolOptions.map(school => (
                    <option key={school} value={school}>
                      {school === "all" ? "All Schools" : school}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  onClick={() => {
                    setStatusFilter("all");
                    setSchoolFilter("all");
                    setSearchTerm("");
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-4">
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
                          {new Date(order.orderDate).toLocaleDateString()} at {new Date(order.orderDate).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                        <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                          {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">{order.customer}</span>
                        <span className="text-sm text-gray-500">({order.email})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{order.school}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Items</h4>
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.quantity}x {item.name}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    {order.specialRequests && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">Special Requests:</p>
                        <p className="text-sm italic">{order.specialRequests}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2">
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-600">${order.total.toFixed(2)}</p>
                    </div>
                    
                    <div className="space-y-2">
                      {order.status === "pending" && (
                        <>
                          <Button 
                            onClick={() => updateOrderStatus(order.id, "preparing")}
                            size="sm"
                            className="w-full"
                          >
                            Start Preparing
                          </Button>
                          <Button 
                            onClick={() => updateOrderStatus(order.id, "cancelled")}
                            variant="outline"
                            size="sm"
                            className="w-full text-red-600 border-red-600 hover:bg-red-50"
                          >
                            Cancel Order
                          </Button>
                        </>
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
                          onClick={() => updateOrderStatus(order.id, "completed")}
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
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
