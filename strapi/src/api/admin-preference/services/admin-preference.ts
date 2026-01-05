/**
 * admin-preference service
 */

import { factories } from '@strapi/strapi';

const CONTENT_TYPE = 'api::admin-preference.admin-preference' as any;

export default factories.createCoreService(CONTENT_TYPE, ({ strapi }) => ({
  /**
   * Get or create admin preferences for the given admin ID
   */
  async getOrCreate(adminId: number) {
    // Try to find existing preferences
    const existing = await strapi.entityService.findMany(CONTENT_TYPE, {
      filters: {
        adminId: { $eq: adminId },
      },
      limit: 1,
    }) as any[];

    if (existing && existing.length > 0) {
      return existing[0];
    }

    // Create new preferences with defaults
    const newPreference = await strapi.entityService.create(CONTENT_TYPE, {
      data: {
        adminId,
        emailNotifications: {
          newOrders: true,
          orderApproved: true,
          orderRejected: true,
        },
      } as any,
    });

    return newPreference;
  },

  /**
   * Update notification preferences for an admin
   */
  async updatePreferences(adminId: number, emailNotifications: Record<string, boolean>) {
    const preference = await (this as any).getOrCreate(adminId);

    const updated = await strapi.entityService.update(CONTENT_TYPE, preference.id, {
      data: {
        emailNotifications: {
          ...preference.emailNotifications,
          ...emailNotifications,
        },
      } as any,
    });

    return updated;
  },
}));
