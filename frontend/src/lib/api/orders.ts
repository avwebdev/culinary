import { auth } from "@/lib/auth/auth";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

export type OrderStatus = "pending" | "approved" | "rejected" | "completed";

export interface Order {
  id: string;
  lines: { uuid: string }[];
  userEmail: string;
  status: OrderStatus;
  deliveryDate: string;
  school?: { id: string; name: string };
  approvedBy?: { id: string; firstname: string; lastname: string };
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlacklistedDate {
  date: string;
  reason: string;
}

export interface RecurringBlacklist {
  type: 'dayOfWeek' | 'dayOfMonth' | 'weekOfMonth';
  value?: number;
  week?: number;
  dayOfWeek?: number;
  reason: string;
}

export interface OrderingSettings {
  name: string;
  orderCutoffTime?: string;
  advanceOrderDays?: number;
  blacklistedDates?: BlacklistedDate[];
  recurringBlacklists?: RecurringBlacklist[];
}

/**
 * Get school ordering settings for date selection
 */
export async function getSchoolOrderingSettings(schoolId: string): Promise<OrderingSettings> {
  const response = await fetch(`${API_URL}/api/schools/${schoolId}/ordering-settings`);

  if (!response.ok) {
    throw new Error(`Failed to fetch ordering settings: ${response.statusText}`);
  }

  const result = await response.json();
  return result;
}

/**
 * Submit a cart as an order
 */
export async function submitOrder(
  cartItems: { uuid: string }[],
  userEmail: string,
  schoolId: string,
  deliveryDate: string
): Promise<Order> {
  const response = await fetch(`${API_URL}/api/carts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        lines: cartItems,
        userEmail,
        school: schoolId,
        deliveryDate,
        status: "pending",
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || `Failed to submit order: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data;
}

/**
 * Get orders for the current admin user (manager)
 */
export async function getOrdersForApproval(schoolId?: string, deliveryDate?: string): Promise<Order[]> {
  const session = await auth() as { jwt?: string } | null;

  if (!session) {
    throw new Error("Not authenticated");
  }

  let url = `${API_URL}/api/carts?populate=school,approvedBy&filters[status][$eq]=pending`;
  
  if (schoolId) {
    url += `&filters[school][id][$eq]=${schoolId}`;
  }
  
  if (deliveryDate) {
    url += `&filters[deliveryDate][$eq]=${deliveryDate}`;
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${session.jwt}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch orders: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data || [];
}

/**
 * Approve an order
 */
export async function approveOrder(orderId: string): Promise<Order> {
  const session = await auth() as { jwt?: string } | null;

  if (!session) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_URL}/api/carts/${orderId}/approve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.jwt}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.error?.message || `Failed to approve order: ${response.statusText}`
    );
  }

  const result = await response.json();
  return result.data;
}

/**
 * Reject an order
 */
export async function rejectOrder(
  orderId: string,
  rejectionReason?: string
): Promise<Order> {
  const session = await auth() as { jwt?: string } | null;

  if (!session) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_URL}/api/carts/${orderId}/reject`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.jwt}`,
    },
    body: JSON.stringify({
      rejectionReason,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.error?.message || `Failed to reject order: ${response.statusText}`
    );
  }

  const result = await response.json();
  return result.data;
}

/**
 * Get a single order by ID
 */
export async function getOrder(orderId: string): Promise<Order> {
  const session = await auth() as { jwt?: string } | null;

  const response = await fetch(
    `${API_URL}/api/carts/${orderId}?populate=school,approvedBy`,
    {
      headers: {
        ...(session && { Authorization: `Bearer ${session.jwt}` }),
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch order: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data;
}
