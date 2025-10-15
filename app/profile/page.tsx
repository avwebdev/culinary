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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  Shield,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";

// Mock data - in real app this would come from the database
const userProfile = {
  name: "John Doe",
  email: "john.doe@email.com",
  phone: "(555) 123-4567",
  school: "Amador Valley High",
  joinDate: "2024-01-01",
  totalOrders: 12,
  totalSpent: 245.67,
  favoriteItems: ["Grilled Chicken Salad", "Iced Latte", "Beef Burger"],
};

const recentOrders = [
  {
    id: "1",
    date: "2024-01-15",
    items: ["Grilled Chicken Salad", "Iced Tea"],
    total: 16.98,
    status: "completed",
  },
  {
    id: "2",
    date: "2024-01-12",
    items: ["Beef Burger", "French Fries"],
    total: 21.98,
    status: "completed",
  },
  {
    id: "3",
    date: "2024-01-10",
    items: ["Vegetarian Pasta", "Garlic Bread"],
    total: 21.99,
    status: "completed",
  },
];

const recentReservations = [
  {
    id: "1",
    date: "2024-01-20",
    time: "6:30 PM",
    partySize: 4,
    school: "Amador Valley High",
    status: "confirmed",
  },
  {
    id: "2",
    date: "2024-01-18",
    time: "12:00 PM",
    partySize: 2,
    school: "Amador Valley High",
    status: "completed",
  },
];

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userProfile.name,
    phone: userProfile.phone,
    school: userProfile.school,
  });

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/signin");
    }
  }, [session, status, router]);

  const handleSave = () => {
    // In a real app, this would update the database
    console.log("Saving profile:", formData);
    alert("Profile updated successfully!");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: userProfile.name,
      phone: userProfile.phone,
      school: userProfile.school,
    });
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
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
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-4">
            Please sign in to view your profile.
          </p>
          <Button
            onClick={() => router.push("/auth/signin")}
            className="bg-primary hover:bg-primary/90 text-white"
          >
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
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Profile Information</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    {isEditing ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <Edit className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    ) : (
                      <div className="flex items-center space-x-2 mt-1">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-900">
                          {userProfile.name}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Email</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-900">{userProfile.email}</span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    ) : (
                      <div className="flex items-center space-x-2 mt-1">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-900">
                          {userProfile.phone}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="school">School</Label>
                    {isEditing ? (
                      <select
                        id="school"
                        value={formData.school}
                        onChange={(e) =>
                          setFormData({ ...formData, school: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      >
                        <option value="Amador Valley High">
                          Amador Valley High
                        </option>
                        <option value="Foothill High">Foothill High</option>
                        <option value="Village High">Village High</option>
                      </select>
                    ) : (
                      <div className="flex items-center space-x-2 mt-1">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-900">
                          {userProfile.school}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Member Since</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-900">
                        {new Date(userProfile.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex space-x-2 pt-4">
                      <Button
                        onClick={handleSave}
                        className="flex-1 bg-primary hover:bg-primary/90 text-white"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="flex-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Account Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Account Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Orders</span>
                    <span className="font-semibold">
                      {userProfile.totalOrders}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Spent</span>
                    <span className="font-semibold">
                      ${userProfile.totalSpent}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Favorite Items</span>
                    <span className="font-semibold">
                      {userProfile.favoriteItems.length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Recent Orders</span>
                </CardTitle>
                <CardDescription>
                  Your latest food orders and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">Order #{order.id}</h4>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {order.items.join(", ")}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${order.total}</p>
                        <Link href={`/orders/${order.id}`}>
                          <Button variant="ghost" size="sm" className="mt-1">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/orders">
                    <Button variant="outline" className="w-full">
                      View All Orders
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Reservations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Recent Reservations</span>
                </CardTitle>
                <CardDescription>
                  Your latest dining reservations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReservations.map((reservation) => (
                    <div
                      key={reservation.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">
                            Reservation #{reservation.id}
                          </h4>
                          <Badge className={getStatusColor(reservation.status)}>
                            {reservation.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(reservation.date).toLocaleDateString()} at{" "}
                          {reservation.time}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {reservation.partySize} people • {reservation.school}
                        </p>
                      </div>
                      <div className="text-right">
                        <Link href={`/reservations/${reservation.id}`}>
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/reservations">
                    <Button variant="outline" className="w-full">
                      View All Reservations
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Favorite Items */}
            <Card>
              <CardHeader>
                <CardTitle>Favorite Items</CardTitle>
                <CardDescription>Your most ordered menu items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userProfile.favoriteItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 border rounded-lg"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="text-primary font-semibold">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{item}</p>
                        <p className="text-sm text-gray-500">
                          Frequently ordered
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
