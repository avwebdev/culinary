# PUSD Culinary Department Web App

A comprehensive web application for the Pleasanton Unified School District's culinary department, featuring online ordering, reservations, custom requests, and a full admin dashboard.

## Features

### For Users
- **Online Menu & Ordering**: Browse menu items, customize orders, and place orders online
- **Reservations**: Make dining reservations at any school location
- **Custom Requests**: Submit special meal requests
- **Order Tracking**: Track order status and history
- **School Selection**: Choose from multiple school locations
- **User Profiles**: Manage personal information and preferences

### For Administrators
- **Admin Dashboard**: Comprehensive overview with analytics and statistics
- **Order Management**: View, update, and manage all orders
- **Menu Management**: Add, edit, and manage menu items and categories
- **Reservation Management**: Handle reservations and availability
- **User Management**: Manage user accounts and permissions
- **Analytics**: View sales reports and performance metrics
- **Calendar Management**: Block out availability and manage schedules

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: PostgreSQL with Drizzle ORM
- **Payments**: Stripe integration
- **Email**: Resend for notifications
- **Deployment**: Vercel-ready

## Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- PostgreSQL database (Neon, Supabase, or self-hosted)
- Google OAuth credentials
- Stripe account (for payments)
- Resend account (for emails)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/pleasanton_culinary"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe (for payments)
STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="whsec_your-stripe-webhook-secret"

# Email (Resend)
RESEND_API_KEY="your-resend-api-key"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd culinary
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

4. **Set up the database**
   ```bash
   # Push the schema to your database
   pnpm db:push
   
   # (Optional) Open Drizzle Studio to view/edit data
   pnpm db:studio
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Setup

### Using Neon (Recommended)

1. Create a Neon account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string to your `.env.local`
4. Run `pnpm db:push` to create tables

### Using Supabase

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Get your database connection string
4. Run `pnpm db:push` to create tables

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
6. Copy Client ID and Client Secret to your `.env.local`

## Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the dashboard
3. Set up webhooks for payment events
4. Add keys to your `.env.local`

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app is compatible with any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Project Structure

```
culinary/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── auth/              # Authentication pages
│   ├── menu/              # Menu and ordering
│   ├── reservations/      # Reservation system
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── providers/        # Context providers
├── lib/                  # Utility functions
│   ├── auth.ts          # NextAuth configuration
│   ├── db.ts            # Database connection
│   └── schema.ts        # Database schema
├── hooks/               # Custom React hooks
├── public/              # Static assets
└── drizzle/             # Database migrations
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:push` - Push schema to database
- `pnpm db:studio` - Open Drizzle Studio

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email culinary@pleasantonusd.net or create an issue in the repository.

## Roadmap

- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Integration with school management systems
- [ ] Multi-language support
- [ ] Advanced customization options
- [ ] Real-time order notifications
- [ ] Inventory management system
