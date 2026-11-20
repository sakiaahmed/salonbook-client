
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Loader2,
  ArrowRight,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

type PaymentStatus = "checking" | "paid" | "pending" | "error";

export default function PaymentSuccessPage() {
  const [status, setStatus] = useState<PaymentStatus>("checking");
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyPayment = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setStatus("checking");

      // Get authenticated JWT
      const tokenResponse = await fetch(
        `${API_URL}/api/auth/token`,
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.token) {
        throw new Error("Please sign in to verify your payment.");
      }

      // Fetch customer transactions
      const response = await fetch(
        `${API_URL}/api/payments/my-transactions`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
          cache: "no-store",
        }
      );

      const transactions = await response.json();

      if (!response.ok) {
        throw new Error(
          transactions.message || "Unable to verify payment."
        );
      }

      // Match the exact Stripe Checkout Session
      const transaction = transactions.find(
        (item: { stripeSessionId: string; status: string }) =>
          item.stripeSessionId === id
      );

      if (transaction?.status?.toLowerCase() === "paid") {
        setStatus("paid");
      } else {
        setStatus("pending");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search)
      .get("session_id");

    if (id) {
      setSessionId(id);
      verifyPayment(id);
    } else {
      setStatus("error");
    }
  }, [verifyPayment]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-[#fffaf9] px-6 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-xl shadow-pink-100/50 md:p-12">

        {status === "checking" && (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>

            <h1 className="mt-7 text-2xl font-extrabold text-gray-900">
              Verifying Your Payment
            </h1>

            <p className="mt-4 leading-7 text-gray-500">
              Please wait while we verify your transaction.
            </p>
          </>
        )}

        {status === "paid" && (
          <>
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-14 w-14 text-green-600" />
            </div>

            <h1 className="mt-7 text-3xl font-extrabold text-gray-900">
              Payment Successful!
            </h1>

            <p className="mt-4 leading-7 text-gray-500">
              Your payment has been verified successfully.
              Your SalonBook transaction is complete.
            </p>

            <div className="mt-7 rounded-2xl bg-green-50 p-5">
              <p className="text-sm font-semibold text-green-700">
                Payment Status: PAID
              </p>

              <p className="mt-2 break-all text-xs text-green-600">
                Session: {sessionId}
              </p>
            </div>

            <Link
              href="/dashboard/customer"
              className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-pink-600 py-4 font-bold text-white transition hover:bg-pink-700"
            >
              Go to Dashboard
              <ArrowRight className="h-5 w-5" />
            </Link>
          </>
        )}

        {status === "pending" && (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100">
              <Clock className="h-10 w-10 text-yellow-600" />
            </div>

            <h1 className="mt-7 text-2xl font-extrabold text-gray-900">
              Payment Verification Pending
            </h1>

            <p className="mt-4 leading-7 text-gray-500">
              Your Checkout session has returned, but the verified
              transaction is not available yet. Please check again.
            </p>

            <button
              onClick={() => verifyPayment(sessionId)}
              disabled={loading || !sessionId}
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 py-4 font-bold text-white hover:bg-pink-700 disabled:opacity-50"
            >
              <RefreshCw className="h-5 w-5" />
              Check Payment Again
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>

            <h1 className="mt-7 text-2xl font-extrabold text-gray-900">
              Unable to Verify Payment
            </h1>

            <p className="mt-4 leading-7 text-gray-500">
              Please sign in again and check your transaction history
              before attempting another payment.
            </p>

            <Link
              href="/sign-in"
              className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-pink-600 py-4 font-bold text-white hover:bg-pink-700"
            >
              Sign In Again
            </Link>
          </>
        )}

        <Link
          href="/services"
          className="mt-6 inline-block text-sm font-semibold text-gray-500 hover:text-pink-600"
        >
          Back to Services
        </Link>

      </div>
    </div>
  );
}
