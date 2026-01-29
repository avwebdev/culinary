"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

// Extended session type to include Strapi JWT
interface ExtendedSession {
  jwt?: string;
  id?: string;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

interface EmailNotifications {
  newOrders: boolean;
  orderApproved: boolean;
  orderRejected: boolean;
}

interface AdminPreference {
  id: number;
  adminId: number;
  emailNotifications: EmailNotifications;
}

export default function AdminPreferencesPage() {
  const { data: session } = useSession();
  const extSession = session as ExtendedSession | null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [preferences, setPreferences] = useState<AdminPreference | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [notifications, setNotifications] = useState<EmailNotifications>({
    newOrders: true,
    orderApproved: true,
    orderRejected: true,
  });

  useEffect(() => {
    if (!extSession?.jwt) return;

    const fetchPreferences = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${API_URL}/api/admin-preferences/me`, {
          headers: {
            Authorization: `Bearer ${extSession.jwt}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch preferences");
        }

        const data: AdminPreference = await response.json();
        setPreferences(data);
        setNotifications(data.emailNotifications || {
          newOrders: true,
          orderApproved: true,
          orderRejected: true,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load preferences");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreferences();
  }, [extSession?.jwt]);

  const handleSave = async () => {
    if (!extSession?.jwt) {
      setError("Not authenticated");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      const response = await fetch(`${API_URL}/api/admin-preferences/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${extSession.jwt}`,
        },
        body: JSON.stringify({
          emailNotifications: notifications,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || "Failed to save preferences");
      }

      const updated = await response.json();
      setPreferences(updated);
      setSuccess("Preferences saved successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save preferences");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = (key: keyof EmailNotifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!session) {
    return <div className="p-8">Please log in to access this page.</div>;
  }

  if (isLoading) {
    return <div className="p-8">Loading preferences...</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Notification Preferences</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Email Notifications</h2>

        <p className="text-gray-600 mb-6">
          Choose which email notifications you&apos;d like to receive for order updates.
        </p>

        <div className="space-y-6">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="newOrders"
              checked={notifications.newOrders}
              onCheckedChange={() => handleToggle("newOrders")}
            />
            <div>
              <Label htmlFor="newOrders" className="font-medium cursor-pointer">
                New Order Notifications
              </Label>
              <p className="text-sm text-gray-500">
                Receive an email when a new order is placed for your school(s)
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="orderApproved"
              checked={notifications.orderApproved}
              onCheckedChange={() => handleToggle("orderApproved")}
            />
            <div>
              <Label htmlFor="orderApproved" className="font-medium cursor-pointer">
                Order Approval Notifications
              </Label>
              <p className="text-sm text-gray-500">
                Receive an email when an order is approved
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="orderRejected"
              checked={notifications.orderRejected}
              onCheckedChange={() => handleToggle("orderRejected")}
            />
            <div>
              <Label htmlFor="orderRejected" className="font-medium cursor-pointer">
                Order Rejection Notifications
              </Label>
              <p className="text-sm text-gray-500">
                Receive an email when an order is rejected
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="lg"
          >
            {isSaving ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </div>
    </div>
  );
}
