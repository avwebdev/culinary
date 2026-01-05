/**
 * custom admin-preference routes
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/admin-preferences/me',
      handler: 'api::admin-preference.admin-preference.getOrCreate',
    },
    {
      method: 'PUT',
      path: '/admin-preferences/me',
      handler: 'api::admin-preference.admin-preference.updateMine',
    },
  ],
};
