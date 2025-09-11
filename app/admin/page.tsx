"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  ShoppingCart, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Settings,
  BarChart3,
  Shield,
  X
} from "lucide-react";
import Link from "next/link";

// Mock data - in real app this would come from the database
const stats = {
  totalUsers: 1247,
  totalOrders: 89,
  totalReservations: 23,
  totalRevenue: 12450.75,
  pendingOrders: 12,
  todayOrders: 15,
  weeklyGrowth: 12.5,
  monthlyGrowth: 8.3,
};

const recentOrders = [
  {
    id: "1",
    customer: "John Smith",
    items: 3,
    total: 45.99,
    status: "pending",
    time: "2 min ago",
  },
  {
    id: "2",
    customer: "Sarah Johnson",
    items: 2,
    total: 28.50,
    status: "preparing",
    time: "15 min ago",
  },
  {
    id: "3",
    customer: "Mike Davis",
    items: 1,
    total: 12.99,
    status: "ready",
    time: "25 min ago",
  },
  {
    id: "4",
    customer: "Emily Wilson",
    items: 4,
    total: 67.25,
    status: "completed",
    time: "1 hour ago",
  },
];

const recentReservations = [
  {
    id: "1",
    customer: "David Brown",
    date: "2024-01-15",
    time: "Lunch",
    partySize: 4,
    school: "Amador Valley High",
    status: "confirmed",
  },
  {
    id: "2",
    customer: "Lisa Garcia",
    date: "2024-01-15",
    time: "Dinner",
    partySize: 2,
    school: "Foothill High",
    status: "pending",
  },
  {
    id: "3",
    customer: "Robert Taylor",
    date: "2024-01-16",
    time: "Breakfast",
    partySize: 6,
    school: "Village High",
    status: "confirmed",
  },
];

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    
    // Check if user has admin role
    if (session.user?.role !== "admin") {
      setAccessDenied(true);
    }
  }, [session, status, router]);

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

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please sign in to access the admin dashboard.</p>
          <Button onClick={() => router.push("/auth/signin")} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (accessDenied || session.user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <X className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don&apos;t have permission to access the admin dashboard.
          </p>
          <div className="bg-gray-100 p-4 rounded-lg mb-4 text-left">
            <p className="text-sm text-gray-700">
              <strong>Current User:</strong> {session.user?.name} ({session.user?.email})
            </p>
            <p className="text-sm text-gray-700">
              <strong>Role:</strong> {session.user?.role || "none"}
            </p>
          </div>
          <div className="space-y-2">
            <Button onClick={() => router.push("/")} variant="outline" className="w-full bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
              Go Home
            </Button>
            <Button onClick={() => router.push("/auth/signin")} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
              Sign In with Different Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "preparing":
        return "text-blue-600 bg-blue-100";
      case "ready":
        return "text-green-600 bg-green-100";
      case "completed":
        return "text-gray-600 bg-gray-100";
      case "confirmed":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                      <p className="text-gray-700">Welcome back, {session.user?.name}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{stats.weeklyGrowth}%</span> from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{stats.todayOrders}</span> today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{stats.monthlyGrowth}%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reservations</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReservations}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-blue-600">{stats.pendingOrders}</span> pending
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/admin/orders">
            <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2">
              <ShoppingCart className="h-6 w-6" />
              <span>Manage Orders</span>
            </Button>
          </Link>
          
          <Link href="/admin/menu">
            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
              <Settings className="h-6 w-6" />
              <span>Menu Management</span>
            </Button>
          </Link>
          
          <Link href="/admin/reservations">
            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
              <Calendar className="h-6 w-6" />
              <span>Reservations</span>
            </Button>
          </Link>
          
          <Link href="/admin/analytics">
            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
              <BarChart3 className="h-6 w-6" />
              <span>Analytics</span>
            </Button>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Orders
                <Link href="/admin/orders">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-sm text-gray-500">
                        {order.items} items • ${order.total}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className="text-xs text-gray-500">{order.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Reservations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Reservations
                <Link href="/admin/reservations">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReservations.map((reservation) => (
                  <div key={reservation.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{reservation.customer}</p>
                      <p className="text-sm text-gray-500">
                        {reservation.date} • {reservation.time} • {reservation.partySize} people
                      </p>
                      <p className="text-xs text-gray-400">{reservation.school}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                        {reservation.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current system health and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Database: Online</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Payment System: Online</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Email Service: Online</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
