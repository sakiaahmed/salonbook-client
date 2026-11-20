
import Link from "next/link";
import {
  XCircle,
  RefreshCw,
  LayoutDashboard,
  Scissors,
  ShieldCheck,
} from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-[#fffaf9] px-6 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-xl shadow-pink-100/50 md:p-12">

        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-orange-100">
          <XCircle className="h-14 w-14 text-orange-500" />
        </div>

        <h1 className="mt-7 text-3xl font-extrabold text-gray-900">
          Payment Cancelled
        </h1>

        <p className="mt-4 leading-7 text-gray-500">
          Your checkout process was cancelled.
          Your appointment has not been paid.
          You can return to your dashboard and try again whenever
          you are ready.
        </p>

        <div className="mt-7 rounded-2xl bg-orange-50 p-5 text-left">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-orange-600" />

            <div>
              <p className="font-bold text-orange-800">
                Your Appointment is Safe
              </p>

              <p className="mt-2 text-sm leading-6 text-orange-700">
                Cancelling checkout does not delete your appointment.
                Its payment status will remain unpaid unless a verified
                successful payment is received.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-3">

          <Link
            href="/dashboard/customer"
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-pink-600 py-4 font-bold text-white transition hover:bg-pink-700"
          >
            <LayoutDashboard className="h-5 w-5" />
            Go to Dashboard
          </Link>

          <Link
            href="/services"
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-4 font-semibold text-gray-700 transition hover:border-pink-400 hover:text-pink-600"
          >
            <Scissors className="h-5 w-5" />
            Browse Services
          </Link>

        </div>

        <p className="mt-7 text-xs text-gray-400">
          Need help? Please contact our salon support team.
        </p>

      </div>
    </div>
  );
}
