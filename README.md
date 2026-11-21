
# SalonBook Client

Frontend application for SalonBook, a full-stack salon appointment booking and management platform.

## Technologies Used

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Better Auth
- Stripe Checkout
- Lucide React
- React Hot Toast

## Features

### Authentication
- User registration and login
- Email and password authentication
- Google authentication
- Role-based access control
- Customer and admin accounts

### Customer Features
- Browse salon services
- Search services
- Filter services by category
- Sort services by price (low to high and high to low)
- View service details
- Book appointments
- View available appointment slots
- Manage appointments
- Cancel eligible appointments
- Make online payments using Stripe
- View transaction history
- Update profile information
- Upload profile pictures

### Admin Features
- Admin dashboard with statistics
- Sidebar navigation
- Manage salon services
- Add new services
- Update existing services
- Activate and deactivate services
- Manage customer appointments
- Confirm appointments
- Cancel appointments
- View transaction history
- Manage users
- Block and unblock users
- Update admin profile

### Additional Features
- Responsive design for mobile, tablet, and desktop
- Loading states
- Error handling
- Notifications using React Hot Toast
- Protected dashboard routes
- Dynamic appointment availability
- Stripe payment success and cancellation pages

## Installation

### 1. Clone the Repository

```bash
git clone YOUR_CLIENT_REPOSITORY_URL
```

### 2. Navigate to the Project Directory

```bash
cd salonbook-client
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root.

Add the following environment variable:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Replace the URL with your deployed backend URL when deploying the application.

### 5. Start the Development Server

```bash
npm run dev
```

Open your browser and visit:

http://localhost:3000

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build production application |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## User Roles

### Customer

Customers can:

- Browse salon services
- Search and filter services
- Sort services by price
- Book appointments
- View appointments
- Cancel eligible appointments
- Make payments
- View transaction history
- Update profile information

### Admin

Administrators can:

- Access the admin dashboard
- Manage salon services
- Add, edit, and deactivate services
- View and manage appointments
- Confirm and cancel appointments
- Manage registered users
- Block and unblock users
- View transactions
- Update admin profile

## Authentication

SalonBook uses Better Auth for authentication.

The application supports:

- Email and password authentication
- Google authentication
- Role-based access for customers and administrators
- Protected dashboard pages

## Appointment Booking

Customers can select a salon service, appointment date, and available time slot.

The application dynamically displays available appointment slots based on the selected date.

## Payment Integration

SalonBook integrates Stripe Checkout for secure online payments.

Stripe test mode is used during development.

The application includes:

- Stripe Checkout
- Payment success page
- Payment cancellation page
- Customer transaction history
- Admin transaction management

## Project Structure

```text
salonbook-client/
├── app/
│   ├── dashboard/
│   │   ├── admin/
│   │   └── customer/
│   ├── services/
│   ├── sign-in/
│   ├── sign-up/
│   └── ...
├── components/
├── lib/
├── public/
├── .env.local
├── package.json
└── README.md
```

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend server URL |

Never expose private API keys, database credentials, or server secrets in client-side environment variables.

## Application Architecture

The frontend is built using Next.js App Router and reusable React components.

The application communicates with the backend REST API for authentication, services, appointments, users, and payment-related operations.

## Project Description

SalonBook is an online salon appointment booking platform that allows customers to discover salon services, book appointments, and make payments online.

Administrators can manage services, appointments, transactions, and registered users through a dedicated admin dashboard.
