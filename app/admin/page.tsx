"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  BarChart3,
  Utensils,
  Building,
  Activity,
  Plus
} from "lucide-react";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const schoolData = {
  all: {
    totalUsers: 1247,
    totalOrders: 89,
    totalRevenue: 12450.75,
    todayOrders: 15,
  },
  "amador-valley": {
    totalUsers: 600,
    totalOrders: 45,
    totalRevenue: 6500.50,
    todayOrders: 8,
  },
  "foothill": {
    totalUsers: 450,
    totalOrders: 30,
    totalRevenue: 4500.25,
    todayOrders: 5,
  },
  "village": {
    totalUsers: 197,
    totalOrders: 14,
    totalRevenue: 1450.00,
    todayOrders: 2,
  }
};

const recentOrders = [
  { id: "1", customer: "John Smith", items: 3, total: 45.99, status: "pending", time: "2 min ago", school: "Amador Valley" },
  { id: "2", customer: "Sarah Johnson", items: 2, total: 28.50, status: "preparing", time: "15 min ago", school: "Foothill" },
  { id: "3", customer: "Mike Davis", items: 1, total: 12.99, status: "ready", time: "25 min ago", school: "Village" },
  { id: "4", customer: "Emily Wilson", items: 4, total: 67.25, status: "completed", time: "1 hour ago", school: "Amador Valley" },
];

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedSchool, setSelectedSchool] = useState("all");
  const [stats, setStats] = useState(schoolData.all);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/auth/signin");
    if (session?.user?.role !== "admin") router.push("/");
  }, [session, status, router]);

  useEffect(() => {
    setStats(schoolData[selectedSchool as keyof typeof schoolData]);
  }, [selectedSchool]);

  if (status === "loading" || !session || session.user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
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
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bubblegum text-slate-900">Admin Dashboard</h1>
            <p className="text-lg text-gray-600">Welcome back, {session.user?.name}. Here&lsquo;s what&lsquo;s happening.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Select value={selectedSchool} onValueChange={setSelectedSchool}>
              <SelectTrigger className="w-full md:w-[280px] bg-white">
                <SelectValue placeholder="Select a school" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Schools</SelectItem>
                <SelectItem value="amador-valley">Amador Valley High School</SelectItem>
                <SelectItem value="foothill">Foothill High School</SelectItem>
                <SelectItem value="village">Village High School</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard icon={DollarSign} title="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} />
          <StatCard icon={ShoppingCart} title="Total Orders" value={stats.totalOrders.toLocaleString()} />
          <StatCard icon={Users} title="Total Users" value={stats.totalUsers.toLocaleString()} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <ActionCard icon={ShoppingCart} title="Manage Orders" href="/admin/orders" />
          <ActionCard icon={Utensils} title="Menu Management" href="/admin/menu" />
          <ActionCard icon={Building} title="Manage Schools" href="/admin/schools" />
          <ActionCard icon={BarChart3} title="View Analytics" href="/admin/analytics" />
        </div>

        <div className="mb-6">
          <Card className="shadow-sm border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col sm:flex-row items-center justify-between p-6">
              <div className="mb-4 sm:mb-0 text-center sm:text-left">
                <h3 className="text-xl font-semibold text-primary mb-2">Need to add a new school?</h3>
                <p className="text-gray-600">Add a new school to the system for menu management and ordering</p>
              </div>
              <Link href="/admin/schools?add=true">
                <Button size="lg" className="gap-2 shadow-sm">
                  <Building className="h-5 w-5" />
                  Add New School
                </Button>
              </Link>
            </CardContent>
          </Card>
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
                      <p className="text-sm text-gray-500">{order.items} items • ${order.total} • {order.school}</p>
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
            <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
               <QuickAction icon={Building} title="Manage Schools" href="/admin/schools" />
               <QuickAction icon={Plus} title="Add New School" href="/admin/schools?add=true" />
               <QuickAction icon={Activity} title="System Health" />
               <QuickAction icon={Utensils} title="Add New Item" href="/admin/menu" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ icon: Icon, title, value }: { icon: React.ElementType, title: string, value: string }) => (
  <Card className="shadow-sm">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const ActionCard = ({ icon: Icon, title, href }: { icon: React.ElementType, title: string, href: string }) => (
  <Link href={href}>
    <Card className="shadow-sm hover:shadow-md transition-shadow h-full">
      <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      </CardContent>
    </Card>
  </Link>
);

const QuickAction = ({ icon: Icon, title, href = "#" }: { icon: React.ElementType, title: string, href?: string }) => (
    <Link href={href}>
        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Icon className="h-5 w-5 text-gray-600" />
            </div>
            <p className="font-medium text-gray-800">{title}</p>
        </div>
    </Link>
)