# Cloud9Wear - Print-on-Demand E-commerce Platform

A print-on-demand e-commerce platform that empowers users to create and customize products with an intuitive, multilingual interface and advanced review management system.

## Features

- Multi-user roles: Admin, Supplier, and Customer interfaces
- Multi-language support: English, French, Spanish, and German
- Paystack payment integration supporting MTN Mobile Money, Telecel, and card payments
- Product review and management system
- Coming soon products showcase
- Inventory management for suppliers
- Order tracking and management

## Tech Stack

- React.js with TypeScript for the frontend
- Express.js backend
- Drizzle ORM with PostgreSQL
- Paystack payment integration
- Tailwind CSS with Shadcn UI components
- Internationalization support

## Deploying to Vercel

### Prerequisites

1. Create a [Vercel](https://vercel.com) account if you don't already have one
2. Have a PostgreSQL database (recommend [Neon](https://neon.tech) for serverless Postgres)
3. Paystack account for payment processing

### Deployment Steps

1. Import your GitHub repository into Vercel
2. Configure the following environment variables in the Vercel dashboard:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`: PostgreSQL connection details
   - `PAYSTACK_SECRET_KEY`: Your Paystack secret key (starts with sk_)
   - `PAYSTACK_PUBLIC_KEY`: Your Paystack public key (starts with pk_)
   - `SESSION_SECRET`: A random string for securing sessions
   - `VITE_PAYSTACK_PUBLIC_KEY`: Same as your PAYSTACK_PUBLIC_KEY

3. Deploy your project through the Vercel dashboard
4. After deployment, run database migrations by connecting to your database and executing:
   ```
   npm run db:push
   ```

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example` with your environment variables
4. Run the development server: `npm run dev`
5. Access the application at http://localhost:5000

## Demo Credentials

- Admin: admin/password123
- Supplier: supplier/password123 
- Customer: customer/password123