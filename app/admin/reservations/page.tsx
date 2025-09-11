"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  Users, 
  ArrowLeft,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import Link from "next/link";

// Mock data - in real app this would come from the database
const reservations = [
  {
    id: "1",
    customer: "David Brown",
    email: "david.brown@email.com",
    phone: "(555) 123-4567",
    date: "2024-01-15",
    time: "12:00 PM",
    partySize: 4,
    school: "Amador Valley High",
    status: "confirmed",
    specialRequests: "Window seat if possible",
    createdAt: "2024-01-10T14:30:00Z"
  },
  {
    id: "2",
    customer: "Lisa Garcia",
    email: "lisa.garcia@email.com",
    phone: "(555) 234-5678",
    date: "2024-01-15",
    time: "6:30 PM",
    partySize: 2,
    school: "Foothill High",
    status: "pending",
    specialRequests: "",
    createdAt: "2024-01-11T09:15:00Z"
  },
  {
    id: "3",
    customer: "Robert Taylor",
    email: "robert.taylor@email.com",
    phone: "(555) 345-6789",
    date: "2024-01-16",
    time: "8:00 AM",
    partySize: 6,
    school: "Village High",
    status: "confirmed",
    specialRequests: "High chair needed for toddler",
    createdAt: "2024-01-12T16:45:00Z"
  },
  {
    id: "4",
    customer: "Jennifer Wilson",
    email: "jennifer.w@email.com",
    phone: "(555) 456-7890",
    date: "2024-01-16",
    time: "1:15 PM",
    partySize: 3,
    school: "Amador Valley High",
    status: "cancelled",
    specialRequests: "Vegetarian options",
    createdAt: "2024-01-13T11:20:00Z"
  },
  {
    id: "5",
    customer: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "(555) 567-8901",
    date: "2024-01-17",
    time: "7:00 PM",
    partySize: 8,
    school: "Foothill High",
    status: "pending",
    specialRequests: "Birthday celebration - cake service",
    createdAt: "2024-01-14T13:10:00Z"
  }
];

const statusOptions = ["all", "pending", "confirmed", "cancelled", "completed"];
const schoolOptions = ["all", "Amador Valley High", "Foothill High", "Village High"];
const timeSlots = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"];

export default function AdminReservations() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [filteredReservations, setFilteredReservations] = useState(reservations);
  const [statusFilter, setStatusFilter] = useState("all");
  const [schoolFilter, setSchoolFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || session.user?.role !== "admin") {
      router.push("/auth/signin");
    }
  }, [session, status, router]);

  useEffect(() => {
    let filtered = reservations;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(reservation => reservation.status === statusFilter);
    }

    // Filter by school
    if (schoolFilter !== "all") {
      filtered = filtered.filter(reservation => reservation.school === schoolFilter);
    }

    // Filter by date
    if (dateFilter) {
      filtered = filtered.filter(reservation => reservation.date === dateFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(reservation => 
        reservation.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.phone.includes(searchTerm) ||
        reservation.id.includes(searchTerm)
      );
    }

    setFilteredReservations(filtered);
  }, [statusFilter, schoolFilter, dateFilter, searchTerm]);

  const updateReservationStatus = (reservationId: string, newStatus: string) => {
    // In a real app, this would update the database
    console.log(`Updating reservation ${reservationId} to status: ${newStatus}`);
    alert(`Reservation ${reservationId} status updated to ${newStatus}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPartySizeColor = (size: number) => {
    if (size <= 2) return "bg-blue-100 text-blue-800";
    if (size <= 4) return "bg-green-100 text-green-800";
    if (size <= 6) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
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
          <p className="text-gray-600">You don't have permission to access this page.</p>
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
                <h1 className="text-3xl font-bold text-gray-900">Reservation Management</h1>
              </div>
              <p className="text-gray-600 mt-2">Manage dining reservations and availability</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Reservations</p>
              <p className="text-2xl font-bold text-emerald-600">{filteredReservations.length}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search by customer, email, or phone..."
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              
              <div className="flex items-end">
                <Button 
                  onClick={() => {
                    setStatusFilter("all");
                    setSchoolFilter("all");
                    setDateFilter("");
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

        {/* Reservations List */}
        <div className="space-y-4">
          {filteredReservations.map((reservation) => (
            <Card key={reservation.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Reservation Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Reservation #{reservation.id}</h3>
                        <p className="text-sm text-gray-500">
                          Created on {new Date(reservation.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={getStatusColor(reservation.status)}>
                          {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                        </Badge>
                        <Badge className={getPartySizeColor(reservation.partySize)}>
                          {reservation.partySize} people
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">{reservation.customer}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{reservation.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{reservation.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{reservation.school}</span>
                      </div>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Reservation Details</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{new Date(reservation.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">{reservation.time}</span>
                      </div>
                    </div>
                    
                    {reservation.specialRequests && (
                      <div className="mt-4">
                        <p className="text-xs text-gray-500 font-medium">Special Requests:</p>
                        <p className="text-sm italic mt-1">{reservation.specialRequests}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Party Size</p>
                      <p className="text-lg font-bold text-emerald-600">{reservation.partySize}</p>
                    </div>
                    
                    <div className="space-y-2">
                      {reservation.status === "pending" && (
                        <>
                          <Button 
                            onClick={() => updateReservationStatus(reservation.id, "confirmed")}
                            size="sm"
                            className="w-full"
                          >
                            Confirm
                          </Button>
                          <Button 
                            onClick={() => updateReservationStatus(reservation.id, "cancelled")}
                            variant="outline"
                            size="sm"
                            className="w-full text-red-600 border-red-600 hover:bg-red-50"
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      
                      {reservation.status === "confirmed" && (
                        <>
                          <Button 
                            onClick={() => updateReservationStatus(reservation.id, "completed")}
                            size="sm"
                            className="w-full"
                          >
                            Mark Completed
                          </Button>
                          <Button 
                            onClick={() => updateReservationStatus(reservation.id, "cancelled")}
                            variant="outline"
                            size="sm"
                            className="w-full text-red-600 border-red-600 hover:bg-red-50"
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      
                      {reservation.status === "cancelled" && (
                        <Button 
                          onClick={() => updateReservationStatus(reservation.id, "pending")}
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          Reactivate
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredReservations.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reservations found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Calendar View (Future Enhancement) */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Calendar View</CardTitle>
            <CardDescription>Visual calendar for managing reservations (Coming Soon)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Interactive calendar view will be available in the next update.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
