/**
 * custom school routes for order management
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/schools/:id/pending-orders-for-dates',
      handler: 'api::school.school.pendingOrdersForDates',
    },
    {
      method: 'POST',
      path: '/schools/:id/bulk-blacklist',
      handler: 'api::school.school.bulkBlacklist',
    },
    {
      method: 'GET',
      path: '/schools/:id/ordering-settings',
      handler: 'api::school.school.orderingSettings',
      config: {
        auth: false, // Public for frontend date picking
      },
    },
  ],
};
