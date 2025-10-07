
# SATE-JIP: Regional Infrastructure Information System

## Overview

SATE-JIP (Sistem Aplikasi Terintegrasi - Jaringan Infrastruktur Pemerintah) is a comprehensive web-based application designed to manage and monitor government infrastructure data for Kabupaten Madiun. The system provides centralized management of internet infrastructure locations, administrative personnel, and activity scheduling across government offices (OPD).

## Key Features

### Infrastructure Management
- Interactive map visualization of infrastructure locations using Mapbox
- Comprehensive location data including coordinates, internet specifications, and infrastructure types
- Support for multiple infrastructure categories: OPD offices, public facilities, and district offices
- Real-time location status monitoring (active, inactive, maintenance)
- Detailed infrastructure information including ISP providers, internet speed, and connection types

### Administrative Management
- Personnel information system (PIC) for each government office
- Contact management with WhatsApp integration
- Role-based access control for administrators
- User authentication and session management

### Activity Calendar
- Interactive calendar system with multiple view modes (month, week, day, year)
- Event creation and management for government activities
- OPD-based event categorization
- Drag-and-drop event rescheduling
- Color-coded event classification
- Event filtering and search capabilities

### Data Visualization
- Statistical dashboards with pie charts and tables
- Location distribution analytics
- ISP provider statistics
- Infrastructure type distribution
- Internet speed and infrastructure analysis

### Configuration Management
- OPD (Organisasi Perangkat Daerah) configuration
- ISP provider settings
- System-wide configuration management

## Technology Stack

### Frontend
- **Framework**: Next.js 15.1.4 (React 19)
- **UI Components**: Radix UI, shadcn/ui
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **Maps**: Mapbox GL JS, React Map GL
- **Forms**: React Hook Form with Zod validation
- **Tables**: TanStack Table (React Table v8)
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js 18
- **Database ORM**: Drizzle ORM
- **Database**: MySQL
- **API**: Next.js API Routes

### Development Tools
- **Language**: TypeScript
- **Package Manager**: npm
- **Linting**: ESLint
- **Code Formatting**: Prettier (implicit through ESLint)

### Deployment
- **Containerization**: Docker with multi-stage builds
- **Development**: Docker Compose with hot-reload
- **Production**: Optimized standalone Next.js build

## System Requirements

### For Development
- Node.js 18 or higher
- npm 9 or higher
- MySQL 8.0 or higher
- Git

### For Docker Deployment
- Docker Engine 20.10 or higher
- Docker Compose 2.0 or higher

## Installation

### Local Development Setup

1. Clone the repository:
```bash
git clone https://github.com/diskominfo-madiunkab/sate-itik-diskominfo.git
cd sate-jip
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your database credentials:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sate_jip_db
```

4. Run database migrations:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Docker Deployment

#### Development Mode

1. Start the development container:
```bash
docker compose -f docker-compose.dev.yml up
```

This mode includes:
- Hot-reload functionality
- Source code mounted as volume
- Port 3000 exposed

#### Production Mode

1. Build and start the production container:
```bash
docker compose up -d
```

This mode includes:
- Multi-stage optimized build
- Standalone Next.js server
- Production-ready configuration
- Non-root user for security

2. View logs:
```bash
docker compose logs -f
```

3. Stop the containers:
```bash
docker compose down
```

## User Guide

### Authentication

1. Navigate to `/login`
2. Enter admin credentials:
   - Username: `admin`
   - Password: `password`
3. Click "Login" to access the dashboard

### Dashboard Navigation

The main dashboard (`/dashboard`) provides access to:

- **Map View**: Interactive Mapbox visualization of all infrastructure locations
- **Location Table**: Comprehensive table of all registered locations with filtering and sorting
- **Admin Table**: Personnel and contact information management
- **Statistics**: Visual analytics of infrastructure distribution

### Managing Locations

1. Navigate to the dashboard
2. Use the map to view location pins
3. Click on any pin to view detailed information
4. Use the locations table for:
   - Searching specific locations
   - Filtering by various criteria
   - Sorting by columns
   - Exporting data

### Activity Calendar

Access the calendar at `/activityCalendar`:

1. **Viewing Events**:
   - Switch between Month, Week, Day, and Year views
   - Click on any event to see details
   - Use date navigator to move between periods

2. **Creating Events**:
   - Click "Add Event" or click on a date
   - Fill in event details:
     - Title (required)
     - OPD Name (required)
     - Start Date/Time (required)
     - End Date/Time (required)
     - Description (optional)
     - Color category
   - Click "Create" to save

3. **Editing Events**:
   - Click on an event to open details
   - Click "Edit" button
   - Modify event information
   - Save changes

4. **Drag and Drop**:
   - Drag events to reschedule
   - Confirmation dialog appears (if enabled in settings)
   - Confirm or cancel the change

5. **Calendar Settings**:
   - Toggle 12/24 hour format
   - Enable/disable drag confirmation
   - Change event badge style (dot/standard)

### Configuration Management

Access configuration at `/dataConfig`:

1. **OPD Configuration**:
   - Add new government offices
   - Edit existing OPD information
   - Manage OPD types and addresses

2. **ISP Configuration**:
   - Add internet service providers
   - Update provider information

## Developer Guide

### Project Structure

```
src/
├── app/                          # Next.js app directory
│   ├── activityCalendar/        # Calendar page
│   ├── api/                     # API routes
│   │   ├── event/              # Event management endpoints
│   │   └── statistics/         # Statistics endpoints
│   ├── context/                # React contexts
│   ├── dashboard/              # Dashboard page
│   ├── dataConfig/             # Configuration page
│   └── login/                  # Authentication page
├── components/                  # Shared components
│   ├── chart/                  # Chart components
│   ├── map/                    # Map components
│   ├── sidebar/                # Navigation sidebar
│   └── ui/                     # UI primitives
├── lib/                        # Utilities and configurations
│   ├── data/                   # Static data and mock data
│   ├── db/                     # Database configuration
│   ├── mapbox/                 # Mapbox utilities
│   └── utils/                  # Helper functions
└── modules/                    # Feature modules
    └── components/
        └── calendar/           # Calendar module
```

### Database Schema

The application uses Drizzle ORM with MySQL. Key tables:

**eventCalendar**
- `id`: Auto-increment primary key
- `title`: Event title (required)
- `description`: Event description (optional)
- `opdName`: Associated OPD name (required)
- `startDate`: Event start timestamp (required)
- `endDate`: Event end timestamp (required)
- `color`: Event category color (required)
- `createdAt`: Record creation timestamp
- `updatedAt`: Record update timestamp

See `src/lib/db/schema.ts` for complete schema definitions.

### API Endpoints

#### Event Management

**GET /api/event**
- Retrieve all events
- Returns: Array of event objects

**POST /api/event**
- Create new event
- Body: Event data conforming to eventSchema
- Returns: Created event object

**GET /api/event/[id]**
- Retrieve single event
- Params: Event ID
- Returns: Event object

**PUT /api/event/[id]**
- Update event
- Params: Event ID
- Body: Updated event data
- Returns: Updated event object

**DELETE /api/event/[id]**
- Delete event
- Params: Event ID
- Returns: Success status

See `src/app/api/event/route.ts` for implementation details.

### Adding New Features

#### Adding a New Page

1. Create page file in `src/app/your-page/page.tsx`:
```typescript
"use client";

export default function NewPage() {
  return <div>New Page Content</div>;
}
```

2. Add route to sidebar in `src/components/sidebar/app-sidebar.tsx`:
```typescript
{
  title: "New Feature",
  url: "/new-feature",
  icon: Icon,
}
```

#### Adding a New API Route

1. Create route file in `src/app/api/your-route/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Implementation
  return NextResponse.json({ data: [] });
}
```

2. Implement request handler with proper validation using Zod
3. Use Drizzle ORM for database operations

#### Creating a New Component

1. Create component file in appropriate directory:
```typescript
"use client"; // If using client-side features

interface ComponentProps {
  // Props definition
}

export function NewComponent({ }: ComponentProps) {
  return <div>Component Content</div>;
}
```

2. Export from index if creating a component library

### Environment Variables

Required variables in `.env.local`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sate_jip_db

# Mapbox (if needed)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_token
```

### Database Migrations

Using Drizzle Kit:

```bash
# Generate migration
npm run db:generate

# Push changes directly to database
npm run db:push

# Open Drizzle Studio
npm run db:studio
```

See `drizzle.config.ts` for configuration.

### Code Style Guidelines

- Use TypeScript for all new code
- Follow React functional component patterns
- Use `"use client"` directive for client components
- Implement proper error handling with try-catch
- Use Zod for schema validation
- Follow existing naming conventions
- Add JSDoc comments for complex functions

### Testing Checklist

Before deploying:

1. Test authentication flow
2. Verify all CRUD operations
3. Check calendar functionality across all views
4. Validate form submissions
5. Test drag-and-drop features
6. Verify data persistence
7. Check responsive design
8. Test Docker builds

## API Reference

### Calendar Events API

All event endpoints are located at `/api/event`.

**Event Schema**:
```typescript
{
  title: string;          // Required, min 1 character
  description?: string;   // Optional
  opdName: string;        // Required, min 1 character
  startDate: string;      // Required, ISO 8601 format
  endDate: string;        // Required, ISO 8601 format
  color: "blue" | "green" | "red" | "yellow" | "purple" | "orange"; // Required
}
```

**Response Format**:
```typescript
{
  id: number;
  title: string;
  description: string | null;
  opdName: string;
  startDate: string;
  endDate: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}
```

## Deployment

### Production Deployment Checklist

1. Update environment variables for production
2. Set secure database credentials
3. Configure production database host
4. Build Docker image:
```bash
docker compose build
```

5. Start services:
```bash
docker compose up -d
```

6. Verify deployment:
```bash
docker compose logs -f
```

7. Test all critical functionality
8. Set up monitoring and logging

### Docker Configuration

Production configuration uses:
- Multi-stage build for optimization
- Non-root user for security
- Standalone Next.js output
- Port 3000 exposed

See `Dockerfile` and `docker-compose.yml` for details.

## Troubleshooting

### Common Issues

**Database Connection Failed**
- Verify database credentials in `.env.local`
- Check MySQL service is running
- Confirm database exists and is accessible

**Docker Build Fails**
- Clear Docker cache: `docker system prune -a`
- Rebuild with no cache: `docker compose build --no-cache`
- Check disk space availability

**Calendar Events Not Saving**
- Verify API endpoints are accessible
- Check network tab for error responses
- Validate event data against schema

**Map Not Displaying**
- Verify Mapbox token is valid
- Check browser console for errors
- Ensure geographic coordinates are valid

### Getting Help

For issues not covered here:
1. Check existing documentation in `CALENDAR_INTEGRATION_PLAN.md`
2. Review `DOCKER_DEPLOYMENT.md` for deployment issues
3. Inspect browser console for client-side errors
4. Check server logs for API errors

## Contributing

When contributing to this project:

1. Fork the repository
2. Create a feature branch
3. Follow existing code style and conventions
4. Write clear commit messages
5. Test thoroughly before submitting
6. Update documentation as needed
7. Submit pull request with detailed description

## License

This project is proprietary software developed for Dinas Komunikasi dan Informatika Kabupaten Madiun.

---

<div align="center">

**Project Information**

Version: 1.0.0 | Last Updated: 2025

Maintained by: [Arief Satria](https://github.com/illufoxKusanagi)


Organization: Dinas Komunikasi dan Informatika Kabupaten Madiun

---

© 2025 Dinas Komunikasi dan Informatika Kabupaten Madiun. All rights reserved.

</div>
