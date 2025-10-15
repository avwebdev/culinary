"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Calendar,
  PieChart,
  Activity,
  Building,
} from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data - in real app this would come from the database
const analyticsData = {
  overview: {
    totalRevenue: 12450.75,
    totalOrders: 89,
    totalCustomers: 1247,
    totalReservations: 23,
    revenueGrowth: 12.5,
    orderGrowth: 8.3,
    customerGrowth: 15.2,
    reservationGrowth: -2.1,
  },
  topItems: [
    { name: "Grilled Chicken Salad", orders: 45, revenue: 584.55 },
    { name: "Beef Burger", orders: 38, revenue: 645.62 },
    { name: "Iced Latte", orders: 67, revenue: 334.33 },
    { name: "Vegetarian Pasta", orders: 23, revenue: 344.77 },
    { name: "Caesar Salad", orders: 31, revenue: 371.69 },
  ],
  schoolPerformance: [
    { name: "Amador Valley High", orders: 45, revenue: 584.55, customers: 234 },
    { name: "Foothill High", orders: 38, revenue: 645.62, customers: 198 },
    { name: "Village High", orders: 23, revenue: 344.77, customers: 156 },
  ],
  dailyOrders: [
    { date: "2024-01-10", orders: 12, revenue: 156.78 },
    { date: "2024-01-11", orders: 15, revenue: 198.45 },
    { date: "2024-01-12", orders: 18, revenue: 234.67 },
    { date: "2024-01-13", orders: 14, revenue: 187.23 },
    { date: "2024-01-14", orders: 20, revenue: 267.89 },
    { date: "2024-01-15", orders: 16, revenue: 213.45 },
    { date: "2024-01-16", orders: 22, revenue: 298.76 },
  ],
};

export default function AdminAnalytics() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedSchool, setSelectedSchool] = useState("all");

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user?.role !== "admin") {
      router.push("/auth/signin");
    }
  }, [session, status, router]);

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? "text-green-600" : "text-red-600";
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <TrendingUp className="h-4 w-4" />
    ) : (
      <TrendingDown className="h-4 w-4" />
    );
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

  if (!session || session.user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You don&lsquo;t have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
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
                <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
              </div>
              <p className="text-gray-600 mt-2">
                Business insights and performance metrics
              </p>
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                <SelectTrigger className="w-full md:w-[200px] bg-white">
                  <SelectValue placeholder="Select school" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Schools</SelectItem>
                  <SelectItem value="amador-valley">Amador Valley</SelectItem>
                  <SelectItem value="foothill">Foothill</SelectItem>
                  <SelectItem value="village">Village</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Last 30 Days
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${analyticsData.overview.totalRevenue.toLocaleString()}
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <span
                  className={getGrowthColor(
                    analyticsData.overview.revenueGrowth
                  )}
                >
                  {getGrowthIcon(analyticsData.overview.revenueGrowth)}
                </span>
                <span
                  className={getGrowthColor(
                    analyticsData.overview.revenueGrowth
                  )}
                >
                  {analyticsData.overview.revenueGrowth}%
                </span>
                <span>from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData.overview.totalOrders}
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <span
                  className={getGrowthColor(analyticsData.overview.orderGrowth)}
                >
                  {getGrowthIcon(analyticsData.overview.orderGrowth)}
                </span>
                <span
                  className={getGrowthColor(analyticsData.overview.orderGrowth)}
                >
                  {analyticsData.overview.orderGrowth}%
                </span>
                <span>from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Customers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData.overview.totalCustomers.toLocaleString()}
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <span
                  className={getGrowthColor(
                    analyticsData.overview.customerGrowth
                  )}
                >
                  {getGrowthIcon(analyticsData.overview.customerGrowth)}
                </span>
                <span
                  className={getGrowthColor(
                    analyticsData.overview.customerGrowth
                  )}
                >
                  {analyticsData.overview.customerGrowth}%
                </span>
                <span>from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Reservations
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData.overview.totalReservations}
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <span
                  className={getGrowthColor(
                    analyticsData.overview.reservationGrowth
                  )}
                >
                  {getGrowthIcon(analyticsData.overview.reservationGrowth)}
                </span>
                <span
                  className={getGrowthColor(
                    analyticsData.overview.reservationGrowth
                  )}
                >
                  {analyticsData.overview.reservationGrowth}%
                </span>
                <span>from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Performing Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5" />
                <span>Top Performing Items</span>
              </CardTitle>
              <CardDescription>
                Most ordered menu items by revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topItems.map((item, index) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.orders} orders
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">
                        ${item.revenue.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        ${(item.revenue / item.orders).toFixed(2)} avg
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* School Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>School Performance</span>
              </CardTitle>
              <CardDescription>
                Orders and revenue by school location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.schoolPerformance.map((school, index) => (
                  <div
                    key={school.name}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{school.name}</p>
                        <p className="text-sm text-gray-500">
                          {school.customers} customers
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-600">
                        ${school.revenue.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {school.orders} orders
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Orders Chart */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Daily Orders (Last 7 Days)</span>
            </CardTitle>
            <CardDescription>Order volume and revenue trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.dailyOrders.map((day) => (
                <div
                  key={day.date}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {new Date(day.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-gray-500">{day.orders} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">
                      ${day.revenue.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      ${(day.revenue / day.orders).toFixed(2)} avg per order
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
