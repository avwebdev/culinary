/**
 * School lifecycle hooks
 * Handles auto-cancellation of orders when dates are blacklisted
 */

import { render } from '@react-email/render';
import { OrderRejected, SchoolBranding, OrderData } from '../../../../email-templates';

interface BlacklistedDate {
  date: string;
  reason: string;
}

interface RecurringBlacklist {
  type: 'dayOfWeek' | 'dayOfMonth' | 'weekOfMonth';
  value?: number;
  week?: number;
  dayOfWeek?: number;
  reason: string;
}

function findNewBlacklistedDates(
  oldDates: BlacklistedDate[] = [],
  newDates: BlacklistedDate[] = []
): BlacklistedDate[] {
  const oldDateSet = new Set(oldDates.map(d => d.date));
  return newDates.filter(d => !oldDateSet.has(d.date));
}

function findNewRecurringPatterns(
  oldPatterns: RecurringBlacklist[] = [],
  newPatterns: RecurringBlacklist[] = []
): RecurringBlacklist[] {
  // Simple comparison based on stringified patterns
  const oldSet = new Set(oldPatterns.map(p => JSON.stringify(p)));
  return newPatterns.filter(p => !oldSet.has(JSON.stringify(p)));
}

export default {
  async afterUpdate(event: any) {
    const { result, params } = event;
    const schoolId = result.id;

    // Get the previous data to compare
    const previousData = params.data?._previousData;
    if (!previousData) {
      return;
    }

    const strapi = (global as any).strapi;
    const cartService = strapi.service('api::cart.cart');

    // Check for newly blacklisted specific dates
    const newBlacklistedDates = findNewBlacklistedDates(
      previousData.blacklistedDates,
      result.blacklistedDates
    );

    // Check for new recurring patterns
    const newRecurringPatterns = findNewRecurringPatterns(
      previousData.recurringBlacklists,
      result.recurringBlacklists
    );

    const datesToCancel: { date: string; reason: string }[] = [];

    // Add specific dates
    for (const bd of newBlacklistedDates) {
      datesToCancel.push({ date: bd.date, reason: bd.reason });
    }

    // Calculate affected dates from new recurring patterns
    for (const pattern of newRecurringPatterns) {
      const affectedDates = cartService.getAffectedDatesForPattern(pattern, 6);
      for (const date of affectedDates) {
        datesToCancel.push({ date, reason: pattern.reason });
      }
    }

    if (datesToCancel.length === 0) {
      return;
    }

    // Group by reason and cancel orders
    const datesByReason = new Map<string, string[]>();
    for (const { date, reason } of datesToCancel) {
      const dates = datesByReason.get(reason) || [];
      dates.push(date);
      datesByReason.set(reason, dates);
    }

    // Fetch school for branding
    const school = await strapi.entityService.findOne('api::school.school', schoolId, {
      populate: { culinaryLogo: true },
    });

    const schoolBranding: SchoolBranding = {
      name: school.name,
      culinaryLogo: school.culinaryLogo,
      email: school.email,
      phone: school.phone,
      primaryColor: school.primaryColor,
      secondaryColor: school.secondaryColor,
      accentColor: school.accentColor,
    };

    const strapiUrl = process.env.STRAPI_URL || 'http://localhost:1337';

    for (const [reason, dates] of datesByReason) {
      const { orders } = await cartService.cancelOrdersForBlacklistedDates(
        schoolId,
        [...new Set(dates)], // Remove duplicates
        reason
      );

      // Send rejection emails
      for (const order of orders) {
        if (order.userEmail) {
          const orderData: OrderData = {
            id: order.id,
            userEmail: order.userEmail,
            status: 'rejected',
            deliveryDate: order.deliveryDate,
            rejectionReason: order.rejectionReason,
            lines: order.lines,
          };

          try {
            const html = await render(OrderRejected({ school: schoolBranding, order: orderData, strapiUrl }));
            await strapi.plugins['email'].services.email.send({
              to: order.userEmail,
              subject: `Order #${order.id} Update - ${school.name}`,
              html,
            });
          } catch (error) {
            strapi.log.error(`Failed to send rejection email for order ${order.id}:`, error);
          }
        }
      }
    }
  },

  async beforeUpdate(event: any) {
    const { params, where } = event;
    const schoolId = where?.id;

    if (!schoolId) return;

    const strapi = (global as any).strapi;

    // Fetch current data to compare later
    const currentSchool = await strapi.entityService.findOne('api::school.school', schoolId, {
      fields: ['blacklistedDates', 'recurringBlacklists'],
    });

    // Store previous data in params for afterUpdate to access
    if (!params.data) {
      params.data = {};
    }
    params.data._previousData = {
      blacklistedDates: currentSchool?.blacklistedDates || [],
      recurringBlacklists: currentSchool?.recurringBlacklists || [],
    };
  },
};
