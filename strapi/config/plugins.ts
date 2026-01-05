module.exports = ({ env }) => ({
  'strapi-v5-plugin-populate-deep': {
    config: {
      defaultDepth: 3, // Default is 5
    }
  },
  email: {
    config: {
      provider: 'sendmail',
      providerOptions: {},
      settings: {
        defaultFrom: env('EMAIL_DEFAULT_FROM', 'noreply@culinary.com'),
        defaultReplyTo: env('EMAIL_DEFAULT_REPLY_TO', 'support@culinary.com'),
      },
    },
  },
});
