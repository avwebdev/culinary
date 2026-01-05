/**
 * custom cart routes for approval workflow
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/carts/:id/approve',
      handler: 'api::cart.cart.approveOrder',
    },
    {
      method: 'POST',
      path: '/carts/:id/reject',
      handler: 'api::cart.cart.rejectOrder',
    },
    {
      method: 'GET',
      path: '/carts/email-preview/:template',
      handler: 'api::cart.cart.previewEmail',
    },
  ],
};
