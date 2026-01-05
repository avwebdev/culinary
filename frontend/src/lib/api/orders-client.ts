/**
 * Client-safe ordering utilities that don't require authentication
 */

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

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
 * Get school ordering settings for date selection (public, no auth required)
 */
export async function getSchoolOrderingSettings(schoolId: string): Promise<OrderingSettings> {
  const response = await fetch(`${API_URL}/api/schools/${schoolId}/ordering-settings`);

  if (!response.ok) {
    throw new Error(`Failed to fetch ordering settings: ${response.statusText}`);
  }

  const result = await response.json();
  return result;
}

export interface Order {
  id: string;
  lines: { uuid: string }[];
  userEmail: string;
  status: string;
  deliveryDate: string;
  school?: { id: string; name: string };
  approvedBy?: { id: string; firstname: string; lastname: string };
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Submit a cart as an order (no auth required for order creation)
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
 * Submit a new order (client-side version using session token)
 */
export async function submitOrderClient(
  schoolId: string,
  deliveryDate: string,
  lines: { uuid: string }[],
  userEmail: string,
  jwt: string
): Promise<any> {
  const response = await fetch(`${API_URL}/api/carts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      data: {
        school: schoolId,
        deliveryDate,
        lines,
        userEmail,
        status: "pending",
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.error?.message || `Failed to submit order: ${response.statusText}`
    );
  }

  const result = await response.json();
  return result.data;
}
