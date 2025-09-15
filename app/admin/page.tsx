"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Settings,
  BarChart3,
  Shield,
  X,
  Utensils,
  CheckCircle,
  Clock
} from "lucide-react";
import Link from "next/link";

const stats = {
  totalUsers: 1247,
  totalOrders: 89,
  totalRevenue: 12450.75,
  weeklyGrowth: 12.5,
  monthlyGrowth: 8.3,
  todayOrders: 15,
};

const recentOrders = [
  { id: "1", customer: "John Smith", items: 3, total: 45.99, status: "pending", time: "2 min ago" },
  { id: "2", customer: "Sarah Johnson", items: 2, total: 28.50, status: "preparing", time: "15 min ago" },
  { id: "3", customer: "Mike Davis", items: 1, total: 12.99, status: "ready", time: "25 min ago" },
  { id: "4", customer: "Emily Wilson", items: 4, total: 67.25, status: "completed", time: "1 hour ago" },
];

const recentActivity = [
    { id: "1", type: "New Order", description: "Order #1234 by John Smith", time: "2 min ago", icon: ShoppingCart, color: "text-blue-500" },
    { id: "2", type: "New User", description: "Sarah Johnson just signed up.", time: "15 min ago", icon: Users, color: "text-green-500" },
    { id: "3", type: "Custom Request", description: "Request for a vegan menu from Mike Davis.", time: "1 hour ago", icon: Settings, color: "text-yellow-500" }
]

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/auth/signin");
    if (session?.user?.role !== "admin") router.push("/");
  }, [session, status, router]);

  if (status === "loading" || !session || session.user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "text-yellow-600 bg-yellow-100";
      case "preparing": return "text-blue-600 bg-blue-100";
      case "ready": return "text-green-600 bg-green-100";
      case "completed": return "text-gray-600 bg-gray-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bubblegum text-slate-900">Admin Dashboard</h1>
          <p className="text-lg text-gray-600">Welcome back, {session.user?.name}. Here's what's happening.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard icon={DollarSign} title="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} change={`+${stats.monthlyGrowth}% this month`} />
          <StatCard icon={ShoppingCart} title="Total Orders" value={stats.totalOrders.toLocaleString()} change={`+${stats.todayOrders} today`} />
          <StatCard icon={Users} title="Total Users" value={stats.totalUsers.toLocaleString()} change={`+${stats.weeklyGrowth}% this week`} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <ActionCard icon={ShoppingCart} title="Manage Orders" href="/admin/orders" />
          <ActionCard icon={Utensils} title="Menu Management" href="/admin/menu" />
          <ActionCard icon={BarChart3} title="View Analytics" href="/admin/analytics" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">Recent Orders <Link href="/admin/orders"><Button variant="ghost" size="sm">View All</Button></Link></CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                    <div>
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-sm text-gray-500">{order.items} items • ${order.total}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>{order.status}</span>
                      <span className="text-xs text-gray-500">{order.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.color} bg-opacity-10`}><activity.icon className="h-4 w-4" /></div>
                    <div>
                      <p className="font-medium text-sm">{activity.type}</p>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                    </div>
                    <span className="text-xs text-gray-500 ml-auto">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ icon: Icon, title, value, change }: { icon: React.ElementType, title: string, value: string, change: string }) => (
  <Card className="shadow-sm">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground text-green-600">{change}</p>
    </CardContent>
  </Card>
);

const ActionCard = ({ icon: Icon, title, href }: { icon: React.ElementType, title: string, href: string }) => (
  <Link href={href}>
    <Card className="shadow-sm hover:shadow-md transition-shadow h-full">
      <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
            <Icon className="h-6 w-6 text-emerald-700" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      </CardContent>
    </Card>
  </Link>
);