"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSchoolOrderingSettings, OrderingSettings } from "@/lib/api/orders-client";
import { isDateAvailable, formatDate, toISODateString } from "@/lib/date-utils";
import { type Matcher } from "react-day-picker";

interface School {
  id: string;
  name: string;
}

interface OrderCalendarProps {
  schools?: School[];
  title?: string;
  description?: string;
}

export default function OrderCalendar({
  schools: initialSchools,
  title = "Schedule a Custom Order",
  description = "Select your school and preferred delivery date to place a custom order.",
}: OrderCalendarProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [schools, setSchools] = useState<School[]>(initialSchools || []);
  const [schoolId, setSchoolId] = useState("");
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>();
  const [orderingSettings, setOrderingSettings] = useState<OrderingSettings | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);

  // Fetch schools on mount if not provided
  useEffect(() => {
    if (initialSchools && initialSchools.length > 0) return;

    async function fetchSchools() {
      try {
        const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
        const response = await fetch(`${API_URL}/api/schools?fields[0]=name`);
        if (response.ok) {
          const result = await response.json();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setSchools(result.data?.map((s: any) => ({ id: s.id, name: s.name })) || []);
        }
      } catch (err) {
        console.error("Failed to fetch schools:", err);
      }
    }
    fetchSchools();
  }, [initialSchools]);

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

  // Calculate disabled dates for the calendar
  const getDisabledDates = (): Matcher => {
    return (date: Date) => {
      if (!orderingSettings) return false;

      const { available } = isDateAvailable(
        date,
        orderingSettings.orderCutoffTime,
        orderingSettings.advanceOrderDays ?? 1,
        orderingSettings.blacklistedDates || [],
        orderingSettings.recurringBlacklists || []
      );

      return !available;
    };
  };

  const handleContinueToOrder = () => {
    if (!deliveryDate || !schoolId) return;

    // Store selected school and date in sessionStorage for the cart page
    sessionStorage.setItem(
      "orderDetails",
      JSON.stringify({
        schoolId,
        deliveryDate: toISODateString(deliveryDate),
      })
    );

    router.push("/auth/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2Fcontact");
  };

  const selectedSchool = schools.find((s) => s.id === schoolId);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column - School Selection & Actions */}
        <div className="flex-1 space-y-6">
          {/* School Selection */}
          <div className="space-y-2">
            <Label htmlFor="school-select">Select School</Label>
            <Select value={schoolId} onValueChange={setSchoolId}>
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

          {/* Selected Summary */}
          {deliveryDate && !dateError && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                <strong>Delivery Date:</strong> {formatDate(deliveryDate)}
              </p>
              {selectedSchool && (
                <p className="text-sm text-green-800">
                  <strong>School:</strong> {selectedSchool.name}
                </p>
              )}
            </div>
          )}

          {/* Action Button */}
          <Button
            onClick={handleContinueToOrder}
            disabled={!deliveryDate || !schoolId || !!dateError}
            className="w-full"
            size="lg"
          >
            {session ? "Browse Menu & Order" : "Sign In to Order"}
          </Button>

          {!session && (
            <p className="text-sm text-gray-500 text-center">
              You&apos;ll need to sign in to complete your order
            </p>
          )}
        </div>

        {/* Right Column - Calendar */}
        <div className="shrink-0">
          {!schoolId ? (
            <div className="flex items-center justify-center h-full min-h-[280px] text-gray-400 border rounded-md p-4">
              Select a school to see available dates
            </div>
          ) : loadingSettings ? (
            <div className="flex items-center justify-center h-full min-h-[280px] text-gray-500 border rounded-md p-4">
              Loading availability...
            </div>
          ) : orderingSettings ? (
            <div className="space-y-2">
              <Label>Select Delivery Date</Label>
              <Calendar
                mode="single"
                selected={deliveryDate}
                onSelect={setDeliveryDate}
                disabled={getDisabledDates()}
                className="rounded-md border"
                fromDate={new Date()}
              />

              {orderingSettings.orderCutoffTime && (
                <p className="text-sm text-gray-500 text-center">
                  Orders must be placed by {orderingSettings.orderCutoffTime} the day before
                </p>
              )}

              {dateError && (
                <p className="text-sm text-red-500 text-center">{dateError}</p>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
