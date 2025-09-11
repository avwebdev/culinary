"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft,
  CreditCard,
  Clock,
  MapPin,
  User
} from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";

// Mock cart data - in real app this would come from context or database
const cartItems = [
  {
    id: "1",
    name: "Grilled Chicken Salad",
    price: 12.99,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
    description: "Fresh mixed greens with grilled chicken breast",
    category: "Lunch"
  },
  {
    id: "2",
    name: "Iced Latte",
    price: 4.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop",
    description: "Smooth espresso with cold milk and ice",
    category: "Beverages"
  },
  {
    id: "3",
    name: "Beef Burger",
    price: 16.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    description: "Juicy beef patty with lettuce and tomato",
    category: "Lunch"
  }
];

const schools = [
  { id: "1", name: "Amador Valley High", address: "1155 Santa Rita Rd, Pleasanton, CA 94566" },
  { id: "2", name: "Foothill High", address: "4375 Foothill Rd, Pleasanton, CA 94588" },
  { id: "3", name: "Village High", address: "4645 Bernal Ave, Pleasanton, CA 94566" }
];

export default function Cart() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState(cartItems);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/auth/signin");
    }
  }, [session, status, router]);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    setItems(items.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const getSubtotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTax = () => {
    return getSubtotal() * 0.085; // 8.5% tax rate
  };

  const getTotal = () => {
    return getSubtotal() + getTax();
  };

  const handleCheckout = () => {
    if (!selectedSchool) {
      alert("Please select a school for pickup");
      return;
    }
    
    setIsCheckingOut(true);
    
    // Simulate checkout process
    setTimeout(() => {
      alert("Order placed successfully! You will receive a confirmation email shortly.");
      setItems([]);
      setIsCheckingOut(false);
      router.push("/orders");
    }, 2000);
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

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
          <p className="text-gray-600 mb-4">Please sign in to view your cart.</p>
          <Button onClick={() => router.push("/auth/signin")} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
            <Link href="/menu">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Browse Menu
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/menu">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          </div>
          <p className="text-gray-700 mt-2">Review your items and complete your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Cart Items ({items.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-600">{item.description}</p>
                            <Badge className="mt-1">{item.category}</Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                            <p className="text-sm text-gray-500">${item.price} each</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Review your order details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Pickup Location */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Pickup Location
                    </Label>
                    <select
                      value={selectedSchool}
                      onChange={(e) => setSelectedSchool(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="">Select a school</option>
                      {schools.map(school => (
                        <option key={school.id} value={school.id}>
                          {school.name}
                        </option>
                      ))}
                    </select>
                    {selectedSchool && (
                      <p className="text-xs text-gray-500 mt-1">
                        {schools.find(s => s.id === selectedSchool)?.address}
                      </p>
                    )}
                  </div>

                  {/* Special Instructions */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Special Instructions
                    </Label>
                    <textarea
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="Any special requests or dietary restrictions..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  {/* Order Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${getSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (8.5%)</span>
                      <span>${getTax().toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${getTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    onClick={handleCheckout}
                    disabled={isCheckingOut || !selectedSchool}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {isCheckingOut ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Checkout
                      </>
                    )}
                  </Button>

                  {/* Order Info */}
                  <div className="text-center text-sm text-gray-500 space-y-1">
                    <div className="flex items-center justify-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Estimated pickup: 15-20 minutes</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>Pickup at selected school</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
