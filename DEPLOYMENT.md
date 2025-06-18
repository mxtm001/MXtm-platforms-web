# MXTM Investment Platform - Deployment Guide

## Quick Deploy Options

### Option 1: Vercel (Recommended)
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Deploy automatically

### Option 2: Netlify
1. Build the project: `npm run build`
2. Upload the `out` folder to Netlify
3. Configure as static site

### Option 3: Any Static Host
1. Run: `npm run build`
2. Upload the `out` folder to your host
3. Configure your domain

## Build Commands

\`\`\`bash
# Install dependencies
npm install

# Build for production
npm run build

# The built files will be in the 'out' directory
\`\`\`

## Environment Setup

No environment variables required for basic functionality.
The app uses localStorage for data persistence.

## Troubleshooting

### Build Errors
- TypeScript errors are ignored during build
- ESLint errors are ignored during build
- If you get hydration errors, they're handled gracefully

### Deployment Issues
- Make sure you're using the static export configuration
- Upload the entire 'out' directory
- Configure your host to serve index.html for all routes

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- JavaScript must be enabled
- LocalStorage must be available

## Admin Access

Default admin credentials:
- Email: admin@mxtminvestment.com
- Password: Admin123!

## Features Included

✅ User Registration & Login
✅ Remember Me functionality
✅ Admin Dashboard
✅ User Management
✅ Deposit/Withdrawal System
✅ Investment Plans
✅ Transaction History
✅ Verification System
✅ Real-time Chat
✅ Mobile Responsive
✅ Multi-currency Support

## Support

For deployment issues, check:
1. Browser console for errors
2. Network tab for failed requests
3. LocalStorage for data persistence
4. Admin panel for user management
