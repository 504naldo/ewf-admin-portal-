# EWF Emergency Call - Admin Portal

Web-based admin dashboard for managing the EWF Emergency Call system.

## Features

- **Authentication** - Secure login with role-based access (admin only)
- **Incident Management** - View, create, update, and assign incidents
- **Technician Monitoring** - View technician availability and status
- **Reports** - View and download PDF reports, export to CSV
- **Real-time Updates** - Auto-refresh every 15 seconds

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- React Query (TanStack)
- date-fns

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Access to the Railway backend API

### Installation

1. Clone or extract the project:
```bash
cd ewf-admin-portal
```

2. Install dependencies:
```bash
pnpm install
```

3. Create `.env.local` file:
```bash
cp .env.example .env.local
```

4. Edit `.env.local` and set the backend URL:
```env
NEXT_PUBLIC_API_BASE_URL=https://ewf-emergency-call-backend-production.up.railway.app
```

### Development

Run the development server:
```bash
pnpm dev
```

Open [http://localhost:4000](http://localhost:4000) in your browser.

### Build for Production

```bash
pnpm build
pnpm start
```

## Deployment

### Deploy to Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variable in Vercel dashboard:
   - `NEXT_PUBLIC_API_BASE_URL` = Your Railway backend URL

4. Redeploy after setting env var

### Deploy to Railway

1. Create a new project on Railway
2. Connect your GitHub repository
3. Set environment variable:
   - `NEXT_PUBLIC_API_BASE_URL` = Your Railway backend URL
4. Railway will auto-deploy

## Login Credentials

Use the same admin credentials from your backend:
- Email: (your admin email)
- Password: (your admin password)

**Note:** Only users with `role: 'admin'` can access the portal.

## API Endpoints

The admin portal expects these endpoints from the backend:

### Auth
- `POST /api/login` - Login with email/password
- `GET /api/me` - Get current user

### Incidents
- `GET /api/incidents` - List all incidents (with optional filters)
- `GET /api/incidents/:id` - Get incident details
- `POST /api/incidents` - Create new incident
- `PATCH /api/incidents/:id` - Update incident
- `POST /api/incidents/:id/notes` - Add note to incident

### Technicians
- `GET /api/technicians` - List all technicians

### Reports
- `GET /api/reports` - List incidents with PDF reports

### Calendar (Optional)
- `POST /api/calendar/events` - Create Google Calendar event

## Project Structure

```
ewf-admin-portal/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx          # Login page
│   ├── admin/
│   │   ├── layout.tsx            # Admin layout with navigation
│   │   ├── page.tsx              # Redirect to incidents
│   │   ├── incidents/
│   │   │   └── page.tsx          # Incidents management
│   │   ├── technicians/
│   │   │   └── page.tsx          # Technicians view
│   │   └── reports/
│   │       └── page.tsx          # Reports view
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Root page (redirect to login)
│   └── globals.css               # Global styles
├── lib/
│   ├── api.ts                    # API client
│   ├── auth.ts                   # Auth utilities
│   └── types.ts                  # TypeScript types
├── middleware.ts                 # Route protection
├── .env.example                  # Environment variables template
├── .env.local                    # Local environment variables (git ignored)
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies

```

## Security Notes

- Tokens are stored in localStorage (consider httpOnly cookies for production)
- All API requests include Authorization header with JWT token
- Middleware protects admin routes from unauthorized access
- Only admin role users can access the portal

## Troubleshooting

### "Failed to load data"
- Check that `NEXT_PUBLIC_API_BASE_URL` is set correctly
- Verify the Railway backend is running
- Check browser console for CORS errors

### "Access denied"
- Ensure your user has `role: 'admin'` in the database
- Check that the backend returns the correct user object

### Build errors
- Run `pnpm install` to ensure all dependencies are installed
- Check that Node.js version is 18 or higher

## License

Internal use only - EWF Emergency Call System
# Deployed to Railway
