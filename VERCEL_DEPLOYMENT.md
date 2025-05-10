# Deploying Cloud9Wear to Vercel

This guide provides step-by-step instructions for deploying the Cloud9Wear e-commerce platform to Vercel.

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. A PostgreSQL database (recommended: [Neon](https://neon.tech) for serverless Postgres)
3. A [Paystack](https://paystack.com) account for payment processing

## Deployment Steps

### 1. Prepare Your Repository

Ensure your repository contains all the necessary configuration files:
- `vercel.json` - Vercel deployment configuration
- `.nvmrc` - Specifies Node.js version
- `vercel-scripts/cleanup-uploads.js` - Helper script for uploads directory

### 2. Set Up a PostgreSQL Database

1. Create a PostgreSQL database on Neon.tech or your preferred provider
2. Note down the connection string and credentials

### 3. Deploy to Vercel

#### Using the Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and log in
2. Click "Add New" > "Project"
3. Import your Git repository
4. Configure the project:
   - Build Command: (default)
   - Output Directory: dist
   - Install Command: (default)

5. Add the following environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `PGHOST`: PostgreSQL host
   - `PGPORT`: PostgreSQL port
   - `PGUSER`: PostgreSQL username
   - `PGPASSWORD`: PostgreSQL password
   - `PGDATABASE`: PostgreSQL database name
   - `PAYSTACK_SECRET_KEY`: Your Paystack secret key (starts with sk_)
   - `PAYSTACK_PUBLIC_KEY`: Your Paystack public key (starts with pk_)
   - `SESSION_SECRET`: A random string for securing sessions
   - `VITE_PAYSTACK_PUBLIC_KEY`: Same as your PAYSTACK_PUBLIC_KEY

6. Click "Deploy"

#### Using Vercel CLI

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel login` to authenticate
3. From your project directory, run `vercel`
4. Follow the prompts to configure your project
5. Set environment variables:
   ```
   vercel env add DATABASE_URL
   vercel env add PGHOST
   vercel env add PGPORT
   vercel env add PGUSER
   vercel env add PGPASSWORD
   vercel env add PGDATABASE
   vercel env add PAYSTACK_SECRET_KEY
   vercel env add PAYSTACK_PUBLIC_KEY
   vercel env add SESSION_SECRET
   vercel env add VITE_PAYSTACK_PUBLIC_KEY
   ```
6. Deploy: `vercel --prod`

### 4. Initialize Database

After deployment, you'll need to set up your database schema:

1. Clone your repository locally
2. Create a `.env` file with the same environment variables
3. Run `npm install`
4. Run `npm run db:push` to push your schema to the database

### 5. Post-Deployment

1. Visit your deployed site (e.g., `https://your-project.vercel.app`)
2. Test the application, especially:
   - User authentication
   - Product listings
   - Image uploads
   - Payment processing

## Deployment Approach

The project uses Vercel's standard deployment approach with separate builders for backend and frontend:

1. **Custom TypeScript Build Script**: The `vercel-build.js` script helps with TypeScript errors:
   - Creates custom type definitions to fix TypeScript errors
   - Provides relaxed TypeScript configuration for the build process
   - Lets the build continue even if there are TypeScript errors

2. **Build Process**: The configuration uses:
   - `@vercel/node` for the server-side code
   - npm's build script for the frontend (via buildCommand)

3. **vercel.json**: The configuration specifies the backend build and the build command handles frontend:
   ```json
   {
     "version": 2,
     "buildCommand": "node vercel-scripts/cleanup-uploads.js && node vercel-build.js && npm run build",
     "outputDirectory": "dist",
     "builds": [
       {
         "src": "server/index.ts",
         "use": "@vercel/node"
       }
     ]
   }
   ```

## Troubleshooting

### Images Not Displaying

- Check that your image URLs are correct in the database
- The application uses a URL normalization function to handle various image paths

### Database Connection Issues

- Verify that your database credentials are correct
- Make sure your database allows connections from Vercel's IP addresses
- Check Vercel's deployment logs for any database-related errors

### Payment Processing Not Working

- Confirm that your Paystack API keys are correct
- Ensure the Paystack integration is properly configured for your environment
- Test with a test card in development mode

### TypeScript Build Errors

If you encounter TypeScript errors during the Vercel build process:

1. Check the error logs to identify specific issues
2. Look for errors related to:
   - `server/vite.ts` with `allowedHosts` errors
   - `server/storage.ts` with Drizzle ORM `PgSelectBase` type errors
   - `server/auth.ts` with Express Request/Response type incompatibilities

3. Run the deployment with our custom `vercel-build.js` script which should fix most common errors

### Missing Frontend Files

If the deployment succeeds but you don't see any frontend files or get a 404 error:

1. Check that the `vercel-build.js` script ran successfully
2. Verify the Vercel build logs to ensure the frontend build process completed
3. Make sure the routes in `vercel.json` are correctly configured:
   ```json
   "routes": [
     {
       "src": "/uploads/(.*)",
       "dest": "/uploads/$1"
     },
     {
       "src": "/api/(.*)",
       "dest": "server/index.ts"
     },
     {
       "src": "/assets/(.*)",
       "dest": "/dist/public/assets/$1"
     },
     {
       "src": "/(.*)\\.(.+)$",
       "dest": "/dist/public/$1.$2"
     },
     {
       "src": "/(.*)",
       "dest": "/dist/public/index.html"
     }
   ]
   ```
4. Try manually triggering a redeploy from the Vercel dashboard

## Demo Credentials

For testing purposes, you can use the following demo credentials:
- Admin: admin/password123
- Supplier: supplier/password123
- Customer: customer/password123