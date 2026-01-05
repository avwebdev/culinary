/**
 * admin-preference controller
 */

import { factories } from '@strapi/strapi';

const CONTENT_TYPE = 'api::admin-preference.admin-preference' as any;

export default factories.createCoreController(CONTENT_TYPE, ({ strapi }) => ({
  /**
   * Get or create preferences for the authenticated admin
   */
  async getOrCreate(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('User not authenticated');
    }

    try {
      const preference = await (strapi.service(CONTENT_TYPE) as any).getOrCreate(user.id);
      ctx.body = preference;
    } catch (error) {
      ctx.throw(500, error instanceof Error ? error.message : 'Server error');
    }
  },

  /**
   * Update preferences for the authenticated admin
   */
  async updateMine(ctx) {
    const user = ctx.state.user;
    const { emailNotifications } = ctx.request.body || {};

    if (!user) {
      return ctx.unauthorized('User not authenticated');
    }

    if (!emailNotifications || typeof emailNotifications !== 'object') {
      return ctx.badRequest('emailNotifications object is required');
    }

    try {
      const updated = await (strapi.service(CONTENT_TYPE) as any).updatePreferences(
        user.id,
        emailNotifications
      );
      ctx.body = updated;
    } catch (error) {
      ctx.throw(500, error instanceof Error ? error.message : 'Server error');
    }
  },
}));
