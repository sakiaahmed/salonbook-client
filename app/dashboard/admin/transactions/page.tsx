
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  Receipt,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

type Transaction = {
  _id: string;
  appointmentId: string;
  customerId: string;
  userName?: string;
  amount: number;
  currency: string;
  status: string;
  stripeSessionId: string;
  stripePaymentIntentId?: string | null;
  createdAt: string;
  updatedAt?: string;
};

export default function AdminTransactionsPage() {
  const { data: session, isPending } = useSession();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Get authentication token
      const tokenResponse = await fetch(
        `${API_URL}/api/auth/token`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.token) {
        throw new Error("Authentication failed. Please sign in again.");
      }

      // Fetch all transactions (Admin Only)
      const response = await fetch(
        `${API_URL}/api/payments/admin/transactions`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load transactions"
        );
      }

      setTransactions(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error("Admin transactions error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isPending) return;

    if (session?.user) {
      fetchTransactions();
    } else {
      setLoading(false);
    }
  }, [session, isPending, fetchTransactions]);

  const formatAmount = (amount: number, currency: string) => {
    const normalizedCurrency = (currency || "bdt").toLowerCase();

    if (normalizedCurrency === "bdt") {
      return `৳${Number(amount).toLocaleString("en-BD")}`;
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: normalizedCurrency.toUpperCase(),
    }).format(Number(amount));
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const paidCount = transactions.filter(
    (item) => item.status.toLowerCase() === "paid"
  ).length;

  const failedCount = transactions.filter(
    (item) => item.status.toLowerCase() === "failed"
  ).length;

  // Authentication loading
  if (isPending) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-pink-600" />
      </div>
    );
  }

  // Login check
  if (!session?.user) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <ShieldCheck className="h-14 w-14 text-pink-500" />

        <h2 className="mt-5 text-2xl font-bold text-gray-900">
          Admin Login Required
        </h2>

        <Link
          href="/sign-in"
          className="mt-7 rounded-xl bg-pink-600 px-7 py-3 font-semibold text-white hover:bg-pink-700"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const role = (
    session.user as { role?: string }
  ).role || "customer";

  if (role !== "admin") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <AlertCircle className="h-14 w-14 text-orange-500" />

        <h2 className="mt-5 text-2xl font-bold text-gray-900">
          Admin Access Only
        </h2>

        <p className="mt-3 text-gray-500">
          You do not have permission to view all transactions.
        </p>

        <Link
          href="/"
          className="mt-6 text-pink-600 hover:underline"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf9]">

      {/* Header */}
      <section className="bg-[#fff1ef] px-6 py-12">
        <div className="mx-auto max-w-7xl">

          <Link
            href="/dashboard/admin"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-pink-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin Dashboard
          </Link>

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-pink-600 p-3 text-white">
              <Receipt className="h-7 w-7" />
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-pink-600">
                Payment Management
              </p>

              <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
                Transaction History
              </h1>
            </div>
          </div>

          <p className="mt-5 text-gray-600">
            Monitor all customer payments and transaction records.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">

        {/* Statistics */}
        <div className="mb-10 grid gap-5 sm:grid-cols-3">

          {[
            {
              title: "Total Transactions",
              value: transactions.length,
              icon: Receipt,
              color: "bg-pink-100 text-pink-600",
            },
            {
              title: "Successful Payments",
              value: paidCount,
              icon: CheckCircle2,
              color: "bg-green-100 text-green-600",
            },
            {
              title: "Failed Payments",
              value: failedCount,
              icon: AlertCircle,
              color: "bg-red-100 text-red-600",
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

                    <h2 className="mt-3 text-3xl font-extrabold text-gray-900">
                      {stat.value}
                    </h2>
                  </div>

                  <div className={`rounded-xl p-4 ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            );
          })}

        </div>

        {/* Transaction List */}
        <div>

          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">
                All Transactions
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Complete payment records from all customers.
              </p>
            </div>

            <button
              onClick={fetchTransactions}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-pink-400 hover:text-pink-600 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="rounded-3xl bg-white py-20 text-center">
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-pink-600" />

              <p className="mt-4 text-gray-500">
                Loading transactions...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500" />

              <h3 className="mt-4 font-bold text-red-700">
                Unable to Load Transactions
              </h3>

              <p className="mt-2 text-sm text-red-600">
                {error}
              </p>

              <button
                onClick={fetchTransactions}
                className="mt-6 rounded-xl bg-pink-600 px-6 py-3 font-semibold text-white hover:bg-pink-700"
              >
                Try Again
              </button>
            </div>
          ) : transactions.length === 0 ? (
            <div className="rounded-3xl border border-gray-100 bg-white px-6 py-20 text-center">
              <CreditCard className="mx-auto h-14 w-14 text-pink-300" />

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                No Transactions Yet
              </h3>

              <p className="mt-3 text-gray-500">
                Customer payment records will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-5">

              {transactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-lg md:p-7"
                >
                  <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

                    {/* Customer Details */}
                    <div className="flex items-start gap-4">

                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
                        <CreditCard className="h-7 w-7" />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {transaction.userName || "Customer"}
                        </h3>

                        <p className="mt-2 break-all text-xs text-gray-400">
                          Customer ID: {transaction.customerId}
                        </p>

                        <p className="mt-2 break-all text-xs text-gray-400">
                          Transaction ID: {transaction._id}
                        </p>

                        <p className="mt-3 text-sm text-gray-500">
                          <span className="font-semibold text-gray-700">
                            Appointment:
                          </span>{" "}
                          {transaction.appointmentId}
                        </p>
                      </div>

                    </div>

                    {/* Payment Details */}
                    <div className="md:text-right">

                      <p className="text-xs font-medium text-gray-400">
                        Payment Amount
                      </p>

                      <p className="mt-2 text-2xl font-extrabold text-pink-600">
                        {formatAmount(
                          transaction.amount,
                          transaction.currency
                        )}
                      </p>

                      <span
                        className={`mt-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold capitalize ${
                          transaction.status.toLowerCase() === "paid"
                            ? "bg-green-100 text-green-700"
                            : transaction.status.toLowerCase() === "failed"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {transaction.status.toLowerCase() === "paid" ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}

                        {transaction.status}
                      </span>

                    </div>

                  </div>

                  {/* Payment Date */}
                  <div className="mt-6 flex flex-col gap-2 border-t border-gray-100 pt-5 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">

                    <span className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-pink-500" />
                      {formatDate(transaction.createdAt)}
                    </span>

                    {transaction.stripePaymentIntentId && (
                      <span className="break-all">
                        Stripe Reference:{" "}
                        {transaction.stripePaymentIntentId}
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
