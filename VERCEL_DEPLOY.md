# Vercel Deployment Guide

This document provides guidance on deploying this application to Vercel.

## Overview

The application has been converted from TypeScript to JavaScript for both frontend and backend code to ensure smoother deployment on Vercel. This approach eliminates TypeScript compilation errors that could otherwise occur during the build process.

## Pre-Deployment Checklist

1. Ensure all your necessary environment variables are set up in Vercel:
   - `DATABASE_URL` - Your Neon PostgreSQL database connection string
   - `PAYSTACK_SECRET_KEY` - For payment processing
   - `PAYSTACK_PUBLIC_KEY` - For payment processing
   - `SENDGRID_API_KEY` - For email notifications

2. Make sure the `vercel.json` and other configuration files are properly set up (they should be already).

## Deployment Steps

### Option 1: Automatic Deployment via GitHub

1. Push your code to a GitHub repository.
2. Log in to your Vercel account.
3. Click "New Project" and import your GitHub repository.
4. Configure your project:
   - Set the Framework Preset to "Other"
   - Set the Build Command to `node vercel-build.js` (our custom build script)
   - Set the Output Directory to `dist`
   - Configure your Environment Variables in the project settings
5. Click "Deploy"

### Option 2: Deployment via Vercel CLI

1. Install the Vercel CLI: `npm i -g vercel`
2. Run `vercel login` and follow the prompts to login
3. From your project directory, run: `vercel`
4. Follow the prompts to configure your deployment
5. For production deployment, use: `vercel --prod`

## Key Files for Vercel Deployment

The following files have been specifically prepared for Vercel deployment:

- `vercel.json` - Configures how Vercel builds and routes requests
- `vercel-build.js` - Custom build script to prioritize JavaScript/JSX files
- `server/index.js` - JavaScript version of the main server entry point
- `shared/schema.js` - JavaScript version of the database schema
- `api/index.js` - Serverless function entry point for Vercel
- `client/src/*.jsx` - JavaScript versions of React components
- `client/index.html` - Updated to use .jsx files instead of .tsx

## JavaScript/JSX Prioritization

We've taken the following steps to ensure Vercel uses the JavaScript/JSX files instead of TypeScript files:

1. **Complete JavaScript Conversion**: All critical files have been converted from TypeScript (.ts/.tsx) to JavaScript (.js/.jsx).

2. **Custom Build Script**: Added a custom build script (`vercel-build.js`) that:
   - Removes TypeScript files that have JavaScript equivalents
   - Updates index.html to point to .jsx instead of .tsx files
   - Runs the build process properly

3. **Vercel Configuration**: The `vercel.json` file includes:
   - An `ignoreCommand` to remove any remaining TypeScript files 
   - `excludeFiles` configuration to exclude TypeScript files from the build
   - Custom build command to use our JavaScript-prioritizing build script

4. **File Structure**: Maintained both .tsx and .jsx files but ensured .jsx will be picked up first through configuration.

## Important Notes

1. **JavaScript Conversion**: Both frontend and backend code have been converted to JavaScript to avoid TypeScript compilation issues on Vercel.

2. **Adapter Pattern**: TypeScript adapter files have been kept and modified to load the JavaScript implementations, ensuring compatibility with the existing build system.

3. **Database Migration**: When deploying, you'll need to run database migrations. Normally, you'd run `npm run db:push`, but on Vercel, consider setting up a one-time migration script in the build command.

4. **Environment Variables**: All sensitive information should be configured as Environment Variables in your Vercel project settings, not hardcoded in the repository.

5. **Troubleshooting**: If you encounter issues after deployment, check the following:
   - Verify all environment variables are correctly set in Vercel
   - Check the Function Logs in the Vercel dashboard
   - Ensure your database is accessible from Vercel's servers (e.g., proper IP allowlisting)
   - Look for any TypeScript-related build errors, which would indicate the JavaScript conversion is incomplete

## Post-Deployment Verification

After deployment, verify the following:

1. The homepage loads correctly
2. User authentication works
3. Product listings display properly
4. Payment processing functions correctly
5. Admin and supplier interfaces are accessible

If any issues occur, check the Vercel deployment logs for details.