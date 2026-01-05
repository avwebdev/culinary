"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/hooks/useCart";
import { submitOrder, getSchoolOrderingSettings, OrderingSettings } from "@/lib/api/orders-client";
import { isDateAvailable, formatDate, toISODateString } from "@/lib/date-utils";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface School {
  id: string;
  name: string;
}

export default function Cart() {
  const router = useRouter();
  const { data: session } = useSession();
  const { slugs, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schoolId, setSchoolId] = useState("");
  const [schools, setSchools] = useState<School[]>([]);
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>();
  const [orderingSettings, setOrderingSettings] = useState<OrderingSettings | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);

  // Fetch schools on mount
  useEffect(() => {
    async function fetchSchools() {
      try {
        const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
        const response = await fetch(`${API_URL}/api/schools?fields[0]=name`);
        if (response.ok) {
          const result = await response.json();
          setSchools(result.data?.map((s: any) => ({ id: s.id, name: s.name })) || []);
        }
      } catch (err) {
        console.error("Failed to fetch schools:", err);
      }
    }
    fetchSchools();
  }, []);

  // Fetch ordering settings when school changes
  useEffect(() => {
    async function fetchSettings() {
      if (!schoolId) {
        setOrderingSettings(null);
        setDeliveryDate(undefined);
        return;
      }

      setLoadingSettings(true);
      try {
        const settings = await getSchoolOrderingSettings(schoolId);
        setOrderingSettings(settings);
        setDeliveryDate(undefined);
        setDateError(null);
      } catch (err) {
        console.error("Failed to fetch ordering settings:", err);
        setOrderingSettings(null);
      } finally {
        setLoadingSettings(false);
      }
    }
    fetchSettings();
  }, [schoolId]);

  // Validate selected date
  useEffect(() => {
    if (!deliveryDate || !orderingSettings) {
      setDateError(null);
      return;
    }

    const { available, reason } = isDateAvailable(
      deliveryDate,
      orderingSettings.orderCutoffTime,
      orderingSettings.advanceOrderDays ?? 1,
      orderingSettings.blacklistedDates || [],
      orderingSettings.recurringBlacklists || []
    );

    if (!available) {
      setDateError(reason || "Date not available");
    } else {
      setDateError(null);
    }
  }, [deliveryDate, orderingSettings]);

  // Disabled date checker for calendar
  const isDateDisabled = (date: Date): boolean => {
    if (!orderingSettings) return true;

    const { available } = isDateAvailable(
      date,
      orderingSettings.orderCutoffTime,
      orderingSettings.advanceOrderDays ?? 1,
      orderingSettings.blacklistedDates || [],
      orderingSettings.recurringBlacklists || []
    );

    return !available;
  };

  const handleSubmitOrder = async () => {
    if (!session?.user?.email) {
      setError("You must be logged in to place an order");
      return;
    }

    if (!schoolId) {
      setError("Please select a school");
      return;
    }

    if (!deliveryDate) {
      setError("Please select a delivery date");
      return;
    }

    if (dateError) {
      setError(dateError);
      return;
    }

    if (slugs.length === 0) {
      setError("Your cart is empty");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const cartItems = slugs.map((uuid) => ({ uuid }));
      const deliveryDateString = toISODateString(deliveryDate);
      await submitOrder(cartItems, session.user.email, schoolId, deliveryDateString);

      clearCart();
      alert("Order submitted successfully! It is now pending admin approval.");
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit order");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return <div className="p-8">Please log in to view your cart.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="max-w-2xl">
        {slugs.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <>
            <p className="mb-6 text-lg">
              Your cart contains <strong>{slugs.length} items</strong>.
            </p>

            {/* School Selection */}
            <div className="mb-6">
              <Label htmlFor="school-select" className="block mb-2 font-semibold">
                Select School:
              </Label>
              <Select
                value={schoolId}
                onValueChange={setSchoolId}
                disabled={isSubmitting}
              >
                <SelectTrigger id="school-select" className="w-full">
                  <SelectValue placeholder="Choose a school..." />
                </SelectTrigger>
                <SelectContent>
                  {schools.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Delivery Date Selection */}
            {schoolId && (
              <div className="mb-6">
                <Label className="block mb-2 font-semibold">
                  Select Delivery Date:
                </Label>
                
                {loadingSettings ? (
                  <p className="text-gray-500">Loading available dates...</p>
                ) : orderingSettings ? (
                  <>
                    {orderingSettings.orderCutoffTime && (
                      <p className="text-sm text-gray-600 mb-2">
                        Order cutoff time: <strong>{orderingSettings.orderCutoffTime}</strong>
                      </p>
                    )}
                    {orderingSettings.advanceOrderDays && orderingSettings.advanceOrderDays > 0 && (
                      <p className="text-sm text-gray-600 mb-2">
                        Orders must be placed at least{" "}
                        <strong>{orderingSettings.advanceOrderDays} day(s)</strong> in advance
                      </p>
                    )}
                    
                    <div className="border rounded-lg p-4 inline-block">
                      <Calendar
                        mode="single"
                        selected={deliveryDate}
                        onSelect={setDeliveryDate}
                        disabled={isDateDisabled}
                        className="rounded-md"
                      />
                    </div>

                    {deliveryDate && !dateError && (
                      <p className="mt-2 text-green-600">
                        Selected: <strong>{formatDate(deliveryDate)}</strong>
                      </p>
                    )}
                    
                    {dateError && (
                      <p className="mt-2 text-red-600">{dateError}</p>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500">
                    Could not load ordering settings for this school.
                  </p>
                )}
              </div>
            )}

            <button
              onClick={handleSubmitOrder}
              disabled={isSubmitting || slugs.length === 0 || !schoolId || !deliveryDate || !!dateError}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded"
            >
              {isSubmitting ? "Submitting..." : "Submit Order for Approval"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
