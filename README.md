
# SalonBook Client

Frontend application for SalonBook, a salon appointment booking and management platform.

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Better Auth
- Stripe
- Lucide React
- React Hot Toast

## Features

- Responsive user interface
- User registration and login
- Customer and admin dashboards
- Browse salon services
- Search services
- View service details
- Book appointments
- Dynamic available time slots
- Appointment management
- Customer profile management
- Admin service management
- Admin appointment management
- Online payment using Stripe
- Payment history
- Loading states and notifications

## Installation

1. Clone the repository:

```bash
git clone YOUR_CLIENT_REPOSITORY_URL
```

2. Navigate to the client directory:

```bash
cd salonbook-client
```

3. Install dependencies:

```bash
npm install
```

4. Create a `.env.local` file in the root directory.

Add the following environment variable:

```env
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
```

Replace the URL with your deployed backend URL when deploying.

## Run the Development Server

```bash
npm run dev
```

Open your browser and visit:

```text
http://localhost:3000
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build production application |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## User Roles

### Customer

- Browse salon services
- Book appointments
- View appointments
- Cancel appointments
- Make payments
- View payment history
- Update profile

### Admin

- Manage salon services
- Add new services
- Update existing services
- Activate or deactivate services
- View customer appointments
- Confirm appointments
- Cancel appointments
- View transactions
- Manage users

## Payment

SalonBook integrates Stripe Checkout for secure online payments.

Stripe test mode is used during development.

## Project

SalonBook is a salon appointment booking platform that allows customers to book salon services online and administrators to manage services, appointments, and payments.

## Application Architecture

The frontend is built with Next.js App Router and reusable React components.
