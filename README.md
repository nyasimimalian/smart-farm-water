# AquaFarm

AquaFarm is a smart irrigation dashboard built for monitoring farm conditions, managing pump activity, and tracking alerts in real time. It uses Supabase for authentication and database storage, and it provides a responsive web interface for daily irrigation operations.

## Features

- Email/password authentication with signup, login, logout, and password reset
- Protected dashboard routes for authenticated users
- Live sensor monitoring for moisture, temperature, and humidity
- Pump activity tracking and manual pump control
- Alert center with read and unread states
- Per-user settings for moisture thresholds, weather location, and auto mode
- Analytics and history views for irrigation data
- Installable PWA experience

## Tech Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Supabase

## Project Structure

- `src/pages` contains the main application screens
- `src/components` contains shared UI and layout components
- `src/contexts/AuthContext.tsx` manages authentication state
- `src/hooks/useIrrigation.ts` contains the main data queries and mutations
- `src/integrations/supabase` contains the Supabase client and generated types
- `supabase/migrations` contains the database schema and auth-related SQL

## Getting Started

### Requirements

- Node.js
- npm
- A Supabase project

### Install dependencies

```sh
npm install
```

### Run the app

```sh
npm run dev
```

## Supabase Setup

This project is designed to use an external Supabase project for both database and authentication.

1. Create a Supabase project.
2. Copy `.env.example` to `.env`.
3. Add your Supabase values:

```env
VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-supabase-anon-key"
VITE_SUPABASE_PROJECT_ID="your-project-ref"
```

4. Run the SQL migration files in `supabase/migrations` in timestamp order.

Migration order:

1. `20260309073038_5223b2ae-8502-4316-b1d4-491914c7b628.sql`
2. `20260413132917_380227ee-228c-4497-8642-33169720006c.sql`
3. `20260413150000_enable_user_tables.sql`

## Authentication Notes

The app uses Supabase Auth for:

- account creation
- sign in
- sign out
- password reset

For local development, add this redirect URL in Supabase Auth settings:

```text
http://localhost:8080/reset-password
```

Also set your local or deployed frontend URL as the Supabase Site URL.

## Database Notes

The project stores data in these main tables:

- `profiles`
- `sensor_data`
- `pump_log`
- `alerts`
- `settings`

Row Level Security is enabled, and the latest migration switches access control to per-user policies based on authenticated Supabase users.

## Available Scripts

- `npm run dev` starts the development server
- `npm run build` creates a production build
- `npm run build:dev` creates a development-mode build
- `npm run lint` runs ESLint
- `npm run test` runs the test suite once
- `npm run test:watch` runs tests in watch mode

## App Pages

- `/` dashboard
- `/analytics` analytics and historical insights
- `/alerts` alert management
- `/settings` irrigation settings
- `/install` PWA installation help
- `/login` login page
- `/signup` registration page
- `/forgot-password` password reset request page
- `/reset-password` password update page

## Development Notes

- The app expects Supabase environment variables to be present before startup.
- Authentication is required to access the main dashboard routes.
- Settings are auto-created for a new user the first time they are requested.
