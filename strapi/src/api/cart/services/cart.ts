/**
 * cart service
 */

import { factories } from '@strapi/strapi';

interface BlacklistedDate {
  date: string;
  reason: string;
}

interface RecurringBlacklist {
  type: 'dayOfWeek' | 'dayOfMonth' | 'weekOfMonth';
  value?: number; // dayOfWeek (0-6) or dayOfMonth (1-31)
  week?: number; // 1-5, -1 for last
  dayOfWeek?: number; // 0-6 for weekOfMonth
  reason: string;
}

interface School {
  id: number;
  orderCutoffTime?: string;
  advanceOrderDays?: number;
  blacklistedDates?: BlacklistedDate[];
  recurringBlacklists?: RecurringBlacklist[];
  [key: string]: any;
}

export default factories.createCoreService('api::cart.cart', ({ strapi }) => ({
  /**
   * Check if a date matches any recurring blacklist pattern
   */
  matchesRecurringPattern(date: Date, pattern: RecurringBlacklist): boolean {
    const dayOfWeek = date.getDay();
    const dayOfMonth = date.getDate();
    
    switch (pattern.type) {
      case 'dayOfWeek':
        // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        return dayOfWeek === pattern.value;
      
      case 'dayOfMonth':
        // 1-31
        return dayOfMonth === pattern.value;
      
      case 'weekOfMonth':
        // Calculate which week of the month (1-5, or -1 for last)
        const targetDayOfWeek = pattern.dayOfWeek ?? 0;
        
        if (dayOfWeek !== targetDayOfWeek) {
          return false;
        }
        
        if (pattern.week === -1) {
          // Last occurrence of this weekday in the month
          const nextWeekSameDay = new Date(date);
          nextWeekSameDay.setDate(date.getDate() + 7);
          return nextWeekSameDay.getMonth() !== date.getMonth();
        }
        
        // Which occurrence of this weekday in the month (1st, 2nd, 3rd, etc.)
        const weekNumber = Math.ceil(dayOfMonth / 7);
        return weekNumber === pattern.week;
      
      default:
        return false;
    }
  },

  /**
   * Check if a specific date is blacklisted
   */
  isDateBlacklisted(
    date: Date,
    blacklistedDates: BlacklistedDate[] = [],
    recurringBlacklists: RecurringBlacklist[] = []
  ): { blacklisted: boolean; reason?: string } {
    const dateString = date.toISOString().split('T')[0];
    
    // Check specific blacklisted dates
    const specificMatch = blacklistedDates.find(bd => bd.date === dateString);
    if (specificMatch) {
      return { blacklisted: true, reason: specificMatch.reason };
    }
    
    // Check recurring patterns
    for (const pattern of recurringBlacklists) {
      if (this.matchesRecurringPattern(date, pattern)) {
        return { blacklisted: true, reason: pattern.reason };
      }
    }
    
    return { blacklisted: false };
  },

  /**
   * Validate order window (cutoff time and advance days)
   */
  validateOrderWindow(
    deliveryDate: Date,
    school: School
  ): { valid: boolean; error?: string } {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const delivery = new Date(deliveryDate.getFullYear(), deliveryDate.getMonth(), deliveryDate.getDate());
    
    // Check if delivery date is in the past
    if (delivery < today) {
      return { valid: false, error: 'Cannot place orders for past dates' };
    }
    
    // Check advance order days requirement
    const advanceOrderDays = school.advanceOrderDays ?? 1;
    const minDeliveryDate = new Date(today);
    minDeliveryDate.setDate(minDeliveryDate.getDate() + advanceOrderDays);
    
    if (delivery < minDeliveryDate) {
      return { 
        valid: false, 
        error: `Orders must be placed at least ${advanceOrderDays} day(s) in advance` 
      };
    }
    
    // Check cutoff time for same-day + advance days
    if (school.orderCutoffTime) {
      const [hours, minutes] = school.orderCutoffTime.split(':').map(Number);
      const cutoffToday = new Date(today);
      cutoffToday.setHours(hours, minutes, 0, 0);
      
      // If ordering for the minimum advance date and past cutoff time
      if (delivery.getTime() === minDeliveryDate.getTime() && now > cutoffToday) {
        return { 
          valid: false, 
          error: `Order cutoff time (${school.orderCutoffTime}) has passed for this date` 
        };
      }
    }
    
    // Check if date is blacklisted
    const blacklistCheck = this.isDateBlacklisted(
      delivery,
      school.blacklistedDates || [],
      school.recurringBlacklists || []
    );
    
    if (blacklistCheck.blacklisted) {
      return { 
        valid: false, 
        error: `This date is not available for orders: ${blacklistCheck.reason || 'Blocked'}` 
      };
    }
    
    return { valid: true };
  },

  /**
   * Check if user already has a pending order for this school and date
   */
  async checkPendingOrderLimit(
    userEmail: string,
    schoolId: number,
    deliveryDate: Date
  ): Promise<{ canOrder: boolean; existingOrderId?: string | number }> {
    const dateString = deliveryDate.toISOString().split('T')[0];
    
    const existingOrders = await strapi.entityService.findMany('api::cart.cart', {
      filters: {
        userEmail: { $eq: userEmail },
        school: { id: { $eq: schoolId } },
        status: { $eq: 'pending' },
        deliveryDate: { $eq: dateString },
      },
      fields: ['id'],
      limit: 1,
    });

    if (existingOrders && existingOrders.length > 0) {
      return { canOrder: false, existingOrderId: existingOrders[0].id };
    }
    
    return { canOrder: true };
  },

  /**
   * Get pending orders for specific dates (for conflict checking)
   */
  async getPendingOrdersForDates(
    schoolId: number,
    dates: string[]
  ): Promise<{ date: string; count: number; orders: any[] }[]> {
    const results: { date: string; count: number; orders: any[] }[] = [];
    
    for (const date of dates) {
      const orders = await strapi.entityService.findMany('api::cart.cart', {
        filters: {
          school: { id: { $eq: schoolId } },
          status: { $eq: 'pending' },
          deliveryDate: { $eq: date },
        },
        fields: ['id', 'userEmail', 'createdAt'],
      });
      
      results.push({
        date,
        count: orders?.length || 0,
        orders: orders || [],
      });
    }
    
    return results;
  },

  /**
   * Cancel orders for blacklisted dates
   */
  async cancelOrdersForBlacklistedDates(
    schoolId: number,
    dates: string[],
    reason: string
  ): Promise<{ cancelled: number; orders: any[] }> {
    const cancelledOrders: any[] = [];
    
    for (const date of dates) {
      const orders = await strapi.entityService.findMany('api::cart.cart', {
        filters: {
          school: { id: { $eq: schoolId } },
          status: { $eq: 'pending' },
          deliveryDate: { $eq: date },
        },
        populate: { school: true },
      });
      
      for (const order of orders || []) {
        const updated = await strapi.entityService.update('api::cart.cart', order.id, {
          data: {
            status: 'rejected',
            rejectionReason: `Date no longer available: ${reason}`,
          },
          populate: { school: true },
        });
        cancelledOrders.push(updated);
      }
    }
    
    return { cancelled: cancelledOrders.length, orders: cancelledOrders };
  },

  /**
   * Calculate which dates would be affected by a recurring blacklist pattern
   * Returns dates for the next N months
   */
  getAffectedDatesForPattern(
    pattern: RecurringBlacklist,
    monthsAhead: number = 6
  ): string[] {
    const dates: string[] = [];
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + monthsAhead);
    
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      if (this.matchesRecurringPattern(currentDate, pattern)) {
        dates.push(currentDate.toISOString().split('T')[0]);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  },
}));

