
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  CalendarDays,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  RefreshCw,
  Receipt,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

type Transaction = {
  _id: string;
  appointmentId: string;
  amount: number;
  currency: string;
  status: string;
  stripeSessionId: string;
  stripePaymentIntentId?: string | null;
  createdAt: string;
  updatedAt?: string;
};

export default function TransactionHistoryPage() {
  const { data: session, isPending } = useSession();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Get Better Auth JWT
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
        throw new Error("Please sign in again to view transactions.");
      }

      // Fetch Customer Transactions
      const response = await fetch(
        `${API_URL}/api/payments/my-transactions`,
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
          data.message || "Unable to load transaction history."
        );
      }

      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Transaction history error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
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

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-700";

      case "failed":
        return "bg-red-100 text-red-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const paidTransactions = transactions.filter(
    (transaction) => transaction.status.toLowerCase() === "paid"
  );

  const totalPaid = paidTransactions.reduce(
    (total, transaction) => total + Number(transaction.amount || 0),
    0
  );

  // Authentication Loading
  if (isPending) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-pink-600" />
      </div>
    );
  }

  // Login Check
  if (!session?.user) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <AlertCircle className="h-14 w-14 text-pink-500" />

        <h2 className="mt-5 text-2xl font-bold text-gray-900">
          Login Required
        </h2>

        <p className="mt-3 text-gray-500">
          Please sign in to view your transaction history.
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

  return (
    <div className="min-h-screen bg-[#fffaf9]">

      {/* Header */}
      <section className="bg-[#fff1ef] px-6 py-12">
        <div className="mx-auto max-w-7xl">

          <Link
            href="/dashboard/customer"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-pink-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <p className="text-sm font-bold uppercase tracking-widest text-pink-600">
            Payment Records
          </p>

          <h1 className="mt-3 text-3xl font-extrabold text-gray-900 md:text-4xl">
            Transaction History
          </h1>

          <p className="mt-3 text-gray-600">
            View and track all your SalonBook payments.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">

        {/* Payment Summary */}
        <div className="mb-10 grid gap-6 md:grid-cols-2">

          <div className="rounded-3xl border border-gray-100 bg-white p-7 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Transactions
                </p>

                <h2 className="mt-3 text-3xl font-extrabold text-gray-900">
                  {transactions.length}
                </h2>
              </div>

              <div className="rounded-2xl bg-pink-100 p-4 text-pink-600">
                <Receipt className="h-7 w-7" />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-7 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Successfully Paid
                </p>

                <h2 className="mt-3 text-3xl font-extrabold text-pink-600">
                  ৳{totalPaid.toLocaleString("en-BD")}
                </h2>
              </div>

              <div className="rounded-2xl bg-green-100 p-4 text-green-600">
                <CreditCard className="h-7 w-7" />
              </div>
            </div>
          </div>

        </div>

        {/* Transaction List */}
        <div>

          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">
                Your Transactions
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                All payment records associated with your account.
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
                Loading your transactions...
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
                Your successful and failed payment records will appear here.
              </p>

              <Link
                href="/dashboard/customer"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-pink-600 px-7 py-3 font-semibold text-white hover:bg-pink-700"
              >
                View Appointments
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {transactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-lg md:p-7"
                >
                  <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

                    {/* Transaction Information */}
                    <div className="flex items-start gap-4">

                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
                        <CreditCard className="h-7 w-7" />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          SalonBook Payment
                        </h3>

                        <p className="mt-2 break-all text-xs text-gray-400">
                          Transaction ID: {transaction._id}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-pink-500" />
                            {formatDate(transaction.createdAt)}
                          </span>
                        </div>

                        <p className="mt-2 text-xs text-gray-400">
                          Appointment ID: {transaction.appointmentId}
                        </p>
                      </div>
                    </div>

                    {/* Amount and Status */}
                    <div className="md:text-right">
                      <p className="text-xs font-medium text-gray-400">
                        Transaction Amount
                      </p>

                      <p className="mt-2 text-2xl font-extrabold text-pink-600">
                        {formatAmount(
                          transaction.amount,
                          transaction.currency
                        )}
                      </p>

                      <div className="mt-3">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold capitalize ${getStatusStyle(transaction.status)}`}
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

                  </div>

                  {transaction.stripePaymentIntentId && (
                    <div className="mt-5 border-t border-gray-100 pt-4">
                      <p className="break-all text-xs text-gray-400">
                        Stripe Payment Reference:{" "}
                        {transaction.stripePaymentIntentId}
                      </p>
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}

        </div>

      </section>
    </div>
  );
}
