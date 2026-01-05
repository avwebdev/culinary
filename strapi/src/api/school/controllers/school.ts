/**
 * school controller
 */

import { factories } from '@strapi/strapi';

interface BlacklistedDate {
  date: string;
  reason: string;
}

export default factories.createCoreController('api::school.school', ({ strapi }) => ({
  /**
   * Get pending orders for specific dates (for conflict checking before blacklisting)
   */
  async pendingOrdersForDates(ctx) {
    const { id } = ctx.params;
    const { dates } = ctx.query;
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('User not authenticated');
    }

    // Check if user is a manager for this school
    const userSchools = await strapi.entityService.findMany('api::school.school', {
      filters: {
        id: { $eq: id },
        managers: { id: user.id },
      },
      fields: ['id'],
    });

    if (!userSchools || userSchools.length === 0) {
      return ctx.forbidden('You do not have permission to manage this school');
    }

    // Parse dates from query string
    let dateArray: string[] = [];
    if (typeof dates === 'string') {
      dateArray = dates.split(',').map(d => d.trim());
    } else if (Array.isArray(dates)) {
      dateArray = dates;
    }

    if (dateArray.length === 0) {
      return ctx.badRequest('At least one date is required');
    }

    const cartService = strapi.service('api::cart.cart');
    const results = await cartService.getPendingOrdersForDates(id, dateArray);

    ctx.body = {
      schoolId: id,
      results,
      totalPending: results.reduce((sum: number, r: any) => sum + r.count, 0),
    };
  },

  /**
   * Bulk add blacklisted dates (supports CSV import and multiple dates)
   */
  async bulkBlacklist(ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('User not authenticated');
    }

    // Check if user is a manager for this school
    const userSchools = await strapi.entityService.findMany('api::school.school', {
      filters: {
        id: { $eq: id },
        managers: { id: user.id },
      },
      fields: ['id'],
    });

    if (!userSchools || userSchools.length === 0) {
      return ctx.forbidden('You do not have permission to manage this school');
    }

    const { dates, csv, confirmCancellation } = ctx.request.body || {};

    let newDates: BlacklistedDate[] = [];

    // Handle JSON array of dates
    if (dates && Array.isArray(dates)) {
      newDates = dates.map((d: any) => ({
        date: d.date || d,
        reason: d.reason || 'Blocked',
      }));
    }

    // Handle CSV string (format: date,reason per line)
    if (csv && typeof csv === 'string') {
      const lines = csv.split('\n').map(l => l.trim()).filter(l => l && !l.toLowerCase().startsWith('date'));
      
      for (const line of lines) {
        const parts = line.split(',');
        if (parts.length >= 1) {
          const date = parts[0].trim();
          const reason = parts.slice(1).join(',').trim() || 'Blocked';
          
          // Validate date format
          if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            newDates.push({ date, reason });
          }
        }
      }
    }

    if (newDates.length === 0) {
      return ctx.badRequest('No valid dates provided. Use "dates" array or "csv" string.');
    }

    // Get current school data
    const school = await strapi.entityService.findOne('api::school.school', id, {
      fields: ['blacklistedDates'],
    }) as unknown as { blacklistedDates?: BlacklistedDate[] } | null;

    const existingDates: BlacklistedDate[] = school?.blacklistedDates || [];
    const existingDateSet = new Set(existingDates.map(d => d.date));

    // Filter out duplicates
    const uniqueNewDates = newDates.filter(d => !existingDateSet.has(d.date));

    if (uniqueNewDates.length === 0) {
      ctx.body = {
        message: 'All dates are already blacklisted',
        added: 0,
        skipped: newDates.length,
      };
      return;
    }

    // Check for pending orders on these dates
    const cartService = strapi.service('api::cart.cart');
    const pendingCheck = await cartService.getPendingOrdersForDates(
      id,
      uniqueNewDates.map(d => d.date)
    );
    
    const totalPending = pendingCheck.reduce((sum: number, r: any) => sum + r.count, 0);

    // If there are pending orders and user hasn't confirmed, return warning
    if (totalPending > 0 && !confirmCancellation) {
      ctx.body = {
        warning: true,
        message: `${totalPending} pending order(s) will be cancelled if you proceed`,
        pendingOrders: pendingCheck.filter((r: any) => r.count > 0),
        datesToAdd: uniqueNewDates,
      };
      return;
    }

    // Merge and update
    const mergedDates = [...existingDates, ...uniqueNewDates];
    
    await strapi.entityService.update('api::school.school', id, {
      data: {
        blacklistedDates: mergedDates as any,
      },
    });

    ctx.body = {
      success: true,
      added: uniqueNewDates.length,
      skipped: newDates.length - uniqueNewDates.length,
      totalBlacklisted: mergedDates.length,
      cancelledOrders: totalPending,
    };
  },

  /**
   * Get school ordering settings
   */
  async orderingSettings(ctx) {
    const { id } = ctx.params;

    const school = await strapi.entityService.findOne('api::school.school', id, {
      fields: [
        'name',
        'orderCutoffTime',
        'advanceOrderDays',
        'blacklistedDates',
        'recurringBlacklists',
      ],
    });

    if (!school) {
      return ctx.notFound();
    }

    ctx.body = school;
  },
}));
