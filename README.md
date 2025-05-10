# Cloud9Wear - Print-on-Demand E-commerce Platform

A robust print-on-demand e-commerce platform with seamless product customization and global user engagement.

## Features

- Multiple user interfaces (admin, supplier, customer)
- Multi-language support (English, French, Spanish, German)
- Payment processing with Paystack
- Product customization (colors, sizes, designs)
- Order management and tracking
- Supplier inventory management
- Product reviews with rating system
- Responsive design for all devices

## Tech Stack

- **Frontend**: React with TypeScript
- **Backend**: Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui
- **Authentication**: Passport.js
- **Payment**: Paystack integration
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- PostgreSQL database
- Paystack account for payment processing

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/cloud9wear
   PGHOST=localhost
   PGPORT=5432
   PGUSER=username
   PGPASSWORD=password
   PGDATABASE=cloud9wear
   SESSION_SECRET=your_session_secret
   PAYSTACK_SECRET_KEY=your_paystack_secret_key
   PAYSTACK_PUBLIC_KEY=your_paystack_public_key
   VITE_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
   ```
4. Initialize the database:
   ```bash
   npm run db:push
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed deployment instructions.

## Demo Credentials

Once deployed, you can access the system with these demo credentials:
- Admin: admin/password123
- Supplier: supplier/password123
- Customer: customer/password123

## License

MIT