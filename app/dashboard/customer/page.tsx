
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";

import {
  CalendarDays,
  Clock,
  Scissors,
  CreditCard,
  Loader2,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Receipt,
  History,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

type Appointment = {
  _id: string;
  serviceName: string;
  serviceImage?: string;
  category?: string;
  appointmentDate: string;
  timeSlot: string;
  servicePrice: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
};

export default function CustomerDashboard() {
  const { data: session, isPending } = useSession();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payingId, setPayingId] = useState("");

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const tokenResponse = await fetch(
        `${API_URL}/api/auth/token`,
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      if (!tokenResponse.ok) {
        throw new Error("Your login session has expired.");
      }

      const tokenData = await tokenResponse.json();

      if (!tokenData.token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(
        `${API_URL}/api/appointments/my`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load appointments"
        );
      }

      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Dashboard error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPending) return;

    if (session?.user) {
      fetchAppointments();
    } else {
      setLoading(false);
    }
  }, [session, isPending]);

  // Stripe Checkout
  const handlePayment = async (appointmentId: string) => {
    try {
      setPayingId(appointmentId);

      const tokenResponse = await fetch(
        `${API_URL}/api/auth/token`,
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.token) {
        throw new Error("Please sign in again.");
      }

      const response = await fetch(
        `${API_URL}/api/payments/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({ appointmentId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Payment session creation failed"
        );
      }

      if (!data.url) {
        throw new Error("Stripe Checkout URL not found");
      }

      window.location.assign(data.url);

    } catch (error) {
      console.error("Payment error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Payment could not be started"
      );

      setPayingId("");
    }
  };

  const formatDate = (date: string) => {
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPaymentStyle = (status: string) => {
    return status.toLowerCase() === "paid"
      ? "bg-green-100 text-green-700"
      : "bg-orange-100 text-orange-700";
  };

  if (isPending) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-pink-600" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <AlertCircle className="h-14 w-14 text-pink-500" />

        <h2 className="mt-5 text-2xl font-bold text-gray-900">
          Login Required
        </h2>

        <p className="mt-3 text-gray-500">
          Please sign in to view your appointments.
        </p>

        <Link
          href="/sign-in"
          className="mt-7 rounded-xl bg-pink-600 px-7 py-3 font-semibold text-white hover:bg-pink-700"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const userRole =
    (session.user as { role?: string }).role || "customer";

  if (userRole !== "customer") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <AlertCircle className="h-12 w-12 text-orange-500" />

        <h2 className="mt-4 text-xl font-bold text-gray-900">
          Customer Access Only
        </h2>

        <Link href="/" className="mt-5 text-pink-600 hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  const confirmedCount = appointments.filter(
    (item) => item.status.toLowerCase() === "confirmed"
  ).length;

  const pendingCount = appointments.filter(
    (item) => item.status.toLowerCase() === "pending"
  ).length;

  const paidCount = appointments.filter(
    (item) => item.paymentStatus.toLowerCase() === "paid"
  ).length;

  return (
    <div className="min-h-screen bg-[#fffaf9]">

      {/* Dashboard Header */}
      <section className="bg-[#fff1ef] px-6 py-12">
        <div className="mx-auto max-w-7xl">

          <p className="text-sm font-bold uppercase tracking-widest text-pink-600">
            Customer Dashboard
          </p>

          <h1 className="mt-3 text-3xl font-extrabold text-gray-900 md:text-4xl">
            Welcome back, {session.user.name}!
          </h1>

          <p className="mt-3 text-gray-600">
            Manage your appointments and payments from here.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">

            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-6 py-3 font-semibold text-white transition hover:bg-pink-700"
            >
              Book a New Service
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              href="/dashboard/customer/transactions"
              className="inline-flex items-center gap-2 rounded-xl border border-pink-200 bg-white px-6 py-3 font-semibold text-pink-700 transition hover:bg-pink-50"
            >
              <Receipt className="h-5 w-5" />
              Transaction History
            </Link>

          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">

        {/* Statistics */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {[
            {
              title: "Total Bookings",
              value: appointments.length,
              icon: CalendarDays,
              color: "bg-pink-100 text-pink-600",
            },
            {
              title: "Confirmed",
              value: confirmedCount,
              icon: CheckCircle2,
              color: "bg-green-100 text-green-600",
            },
            {
              title: "Pending",
              value: pendingCount,
              icon: Clock,
              color: "bg-yellow-100 text-yellow-600",
            },
            {
              title: "Paid",
              value: paidCount,
              icon: CreditCard,
              color: "bg-purple-100 text-purple-600",
            },
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </p>

                    <h3 className="mt-3 text-3xl font-extrabold text-gray-900">
                      {stat.value}
                    </h3>
                  </div>

                  <div className={`rounded-xl p-4 ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Appointment Section */}
        <div className="mt-12">

          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">
                My Appointments
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                View and manage your salon bookings.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">

              <Link
                href="/dashboard/customer/transactions"
                className="inline-flex items-center gap-2 rounded-xl border border-pink-200 bg-white px-4 py-3 text-sm font-semibold text-pink-700 hover:bg-pink-50"
              >
                <History className="h-4 w-4" />
                Transactions
              </Link>

              <button
                onClick={fetchAppointments}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:border-pink-400 hover:text-pink-600 disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>

            </div>
          </div>

          {loading ? (
            <div className="rounded-2xl bg-white py-20 text-center">
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-pink-600" />

              <p className="mt-4 text-gray-500">
                Loading your appointments...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
              <p className="font-semibold text-red-600">{error}</p>

              <button
                onClick={fetchAppointments}
                className="mt-5 rounded-xl bg-pink-600 px-6 py-3 font-semibold text-white"
              >
                Try Again
              </button>
            </div>
          ) : appointments.length === 0 ? (
            <div className="rounded-3xl border border-gray-100 bg-white px-6 py-20 text-center">
              <Scissors className="mx-auto h-14 w-14 text-pink-300" />

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                No Appointments Yet
              </h3>

              <p className="mt-3 text-gray-500">
                Your bookings will appear here once you make one.
              </p>

              <Link
                href="/services"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-pink-600 px-7 py-3 font-semibold text-white hover:bg-pink-700"
              >
                Explore Services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-6">

              {appointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:shadow-lg"
                >

                  <div className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center">

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-pink-100">

                        {appointment.serviceImage ? (
                          <img
                            src={appointment.serviceImage}
                            alt={appointment.serviceName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Scissors className="h-9 w-9 text-pink-500" />
                        )}

                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {appointment.serviceName}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {appointment.category || "Salon Service"}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">

                          <span className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-pink-500" />
                            {formatDate(appointment.appointmentDate)}
                          </span>

                          <span className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-pink-500" />
                            {appointment.timeSlot}
                          </span>

                        </div>
                      </div>

                    </div>

                    <div className="md:text-right">
                      <p className="text-xs font-medium text-gray-400">
                        Service Price
                      </p>

                      <p className="mt-1 text-2xl font-extrabold text-pink-600">
                        ৳{Number(appointment.servicePrice).toLocaleString("en-BD")}
                      </p>
                    </div>

                  </div>

                  <div className="flex flex-col justify-between gap-4 border-t border-gray-100 bg-gray-50/70 p-6 sm:flex-row sm:items-center">

                    <div className="flex flex-wrap gap-3">

                      <span className={`rounded-full px-4 py-2 text-xs font-bold capitalize ${getStatusStyle(appointment.status)}`}>
                        {appointment.status}
                      </span>

                      <span className={`rounded-full px-4 py-2 text-xs font-bold capitalize ${getPaymentStyle(appointment.paymentStatus)}`}>
                        Payment: {appointment.paymentStatus}
                      </span>

                    </div>

                    {appointment.status.toLowerCase() === "confirmed" &&
                    appointment.paymentStatus.toLowerCase() !== "paid" ? (

                      <button
                        onClick={() => handlePayment(appointment._id)}
                        disabled={payingId === appointment._id}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-pink-600 px-6 py-3 font-bold text-white shadow-lg shadow-pink-100 transition hover:bg-pink-700 disabled:opacity-50"
                      >
                        {payingId === appointment._id ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Redirecting...
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-5 w-5" />
                            Pay Now
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>

                    ) : appointment.paymentStatus.toLowerCase() === "paid" ? (

                      <span className="inline-flex items-center gap-2 font-semibold text-green-600">
                        <CheckCircle2 className="h-5 w-5" />
                        Payment Complete
                      </span>

                    ) : appointment.status.toLowerCase() === "pending" ? (

                      <span className="inline-flex items-center gap-2 text-sm font-medium text-yellow-700">
                        <Clock className="h-4 w-4" />
                        Awaiting Admin Confirmation
                      </span>

                    ) : (

                      <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-500">
                        <XCircle className="h-4 w-4" />
                        No Payment Action Available
                      </span>

                    )}

                  </div>
                </div>
              ))}

            </div>
          )}

        </div>
      </section>
    </div>
  );
}
