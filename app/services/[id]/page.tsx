
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Loader2,
  Scissors,
  Sparkles,
  UserRound,
} from "lucide-react";

type Service = {
  _id: string;
  serviceName?: string;
  name?: string;
  category?: string;
  description?: string;
  price: number;
  duration?: number;
  image?: string;
  imageUrl?: string;
  status?: string;
};

type BookingResult = {
  appointmentId: string;
};

type AvailableSlotsResponse = {
  date: string;
  availableTimeSlots: string[];
  bookedTimeSlots: string[];
  allTimeSlots: string[];
};

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

function getLocalDate() {
  const now = new Date();

  const localDate = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000
  );

  return localDate.toISOString().slice(0, 10);
}

export default function ServiceDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const { data: session } = useSession();

  const serviceId = params.id;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [appointmentDate, setAppointmentDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [message, setMessage] = useState("");

  const [availableTimeSlots, setAvailableTimeSlots] =
    useState<string[]>([]);

  const [bookedTimeSlots, setBookedTimeSlots] =
    useState<string[]>([]);

  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState("");

  const [booking, setBooking] = useState(false);
  const [bookingResult, setBookingResult] =
    useState<BookingResult | null>(null);

  const userRole =
    (session?.user as { role?: string } | undefined)?.role ||
    "customer";

  // Fetch service from public services API
  useEffect(() => {
    let isActive = true;

    const fetchService = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/services`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Unable to load services");
        }

        const services: Service[] = await response.json();

        const foundService = services.find(
          (item) => item._id === serviceId
        );

        if (!foundService) {
          throw new Error("Service not found or unavailable");
        }

        if (isActive) {
          setService(foundService);
        }
      } catch (error) {
        if (isActive) {
          setError(
            error instanceof Error
              ? error.message
              : "Something went wrong"
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchService();

    return () => {
      isActive = false;
    };
  }, [serviceId]);

  // Fetch available time slots when date changes
  useEffect(() => {
    let isActive = true;

    const fetchAvailableSlots = async () => {
      if (!appointmentDate) {
        setAvailableTimeSlots([]);
        setBookedTimeSlots([]);
        setTimeSlot("");
        setSlotsError("");
        return;
      }

      try {
        setSlotsLoading(true);
        setSlotsError("");
        setTimeSlot("");

        const response = await fetch(
          `${API_URL}/api/appointments/available-slots?date=${appointmentDate}`,
          {
            cache: "no-store",
          }
        );

        const data: AvailableSlotsResponse =
          await response.json();

        if (!response.ok) {
          throw new Error(
            (data as unknown as { message?: string }).message ||
              "Unable to load available time slots"
          );
        }

        if (isActive) {
          setAvailableTimeSlots(
            data.availableTimeSlots || []
          );

          setBookedTimeSlots(
            data.bookedTimeSlots || []
          );
        }
      } catch (error) {
        if (isActive) {
          setAvailableTimeSlots([]);
          setBookedTimeSlots([]);

          setSlotsError(
            error instanceof Error
              ? error.message
              : "Unable to load time slots"
          );
        }
      } finally {
        if (isActive) {
          setSlotsLoading(false);
        }
      }
    };

    fetchAvailableSlots();

    return () => {
      isActive = false;
    };
  }, [appointmentDate]);

  // Handle appointment booking
  const handleBooking = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!session?.user) {
      toast.error("Please sign in to book an appointment.");
      router.push("/sign-in");
      return;
    }

    if (userRole !== "customer") {
      toast.error("Only customers can book appointments.");
      return;
    }

    if (!service) {
      toast.error("Service information not available.");
      return;
    }

    if (!appointmentDate || !timeSlot) {
      toast.error("Please select date and time.");
      return;
    }

    // Ensure selected slot is currently available
    if (!availableTimeSlots.includes(timeSlot)) {
      toast.error(
        "This time slot is no longer available. Please select another slot."
      );
      setTimeSlot("");
      return;
    }

    try {
      setBooking(true);

      // Step 1: Get JWT from Better Auth
      const tokenResponse = await fetch(
        `${API_URL}/api/auth/token`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      if (!tokenResponse.ok) {
        throw new Error(
          "Your login session has expired. Please sign in again."
        );
      }

      const tokenData = await tokenResponse.json();

      if (!tokenData.token) {
        throw new Error("Unable to generate authentication token.");
      }

      // Step 2: Prepare appointment data
      const appointmentData = {
        serviceId: service._id,
        appointmentDate,
        timeSlot,
        message: message.trim(),
      };

      // Step 3: Send booking request
      const response = await fetch(
        `${API_URL}/api/appointments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify(appointmentData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to book appointment"
        );
      }

      const appointmentId = String(data.insertedId);

      setBookingResult({ appointmentId });

      setAppointmentDate("");
      setTimeSlot("");
      setMessage("");

      setAvailableTimeSlots([]);
      setBookedTimeSlots([]);

      toast.success("Appointment request submitted!");
    } catch (error) {
      console.error("Appointment booking error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );

      if (
        error instanceof Error &&
        error.message.includes("session has expired")
      ) {
        router.push("/sign-in");
      }
    } finally {
      setBooking(false);
    }
  };

  const formatPrice = (price: number) => {
    return `৳${Number(price).toLocaleString("en-BD")}`;
  };

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#fffaf9]">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-pink-600" />
          <p className="mt-4 text-gray-500">
            Loading service details...
          </p>
        </div>
      </div>
    );
  }

  // Error
  if (error || !service) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#fffaf9] px-6 text-center">
        <Scissors className="h-14 w-14 text-pink-300" />

        <h2 className="mt-5 text-2xl font-bold text-gray-900">
          Service Not Found
        </h2>

        <p className="mt-3 text-gray-500">
          {error || "This service is currently unavailable."}
        </p>

        <Link
          href="/services"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-pink-600 px-6 py-3 font-semibold text-white hover:bg-pink-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf9]">

      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 pt-8">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-pink-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Link>
      </div>

      {/* Main Section */}
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-12 lg:grid-cols-2">

        {/* Service Information */}
        <div>
          <div className="relative h-[320px] overflow-hidden rounded-3xl bg-gradient-to-br from-pink-200 to-orange-100 shadow-lg md:h-[450px]">

            <div className="flex h-full items-center justify-center">
              <Scissors className="h-28 w-28 text-white/80" />
            </div>

            {(service.image || service.imageUrl) && (
              <img
                src={service.image || service.imageUrl}
                alt={
                  service.serviceName ||
                  service.name ||
                  "Salon service"
                }
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}

            <span className="absolute left-6 top-6 rounded-full bg-white px-5 py-2 text-sm font-bold text-pink-600 shadow">
              {service.category || "Salon Service"}
            </span>
          </div>

          <div className="mt-9">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-pink-600">
              <Sparkles className="h-4 w-4" />
              SalonBook Exclusive Service
            </div>

            <h1 className="mt-4 text-3xl font-extrabold text-gray-900 md:text-5xl">
              {service.serviceName || service.name}
            </h1>

            <p className="mt-6 text-base leading-8 text-gray-600">
              {service.description}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-5">

              <div className="rounded-2xl border border-pink-100 bg-white p-5">
                <div className="flex items-center gap-2 text-pink-600">
                  <Scissors className="h-5 w-5" />
                  <span className="text-sm font-semibold">
                    Service Price
                  </span>
                </div>

                <p className="mt-3 text-2xl font-extrabold text-gray-900">
                  {formatPrice(service.price)}
                </p>
              </div>

              <div className="rounded-2xl border border-pink-100 bg-white p-5">
                <div className="flex items-center gap-2 text-pink-600">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm font-semibold">
                    Duration
                  </span>
                </div>

                <p className="mt-3 text-2xl font-extrabold text-gray-900">
                  {service.duration || "N/A"}
                  {service.duration ? " min" : ""}
                </p>
              </div>

            </div>

            <div className="mt-8 rounded-2xl bg-[#fff0ed] p-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-pink-600" />

                <p className="text-sm leading-7 text-gray-600">
                  Book your preferred date and time. Your appointment
                  will remain pending until an administrator confirms
                  your booking.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div>
          <div className="sticky top-24 rounded-3xl border border-pink-100 bg-white p-6 shadow-xl shadow-pink-100/50 md:p-9">

            {bookingResult ? (
              <div className="py-12 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>

                <h2 className="mt-6 text-2xl font-extrabold text-gray-900">
                  Booking Submitted!
                </h2>

                <p className="mt-4 leading-7 text-gray-500">
                  Your appointment request has been submitted
                  successfully. Please wait for admin confirmation.
                  You can pay after the appointment is confirmed.
                </p>

                <div className="mt-6 rounded-xl bg-gray-50 p-4 text-left">
                  <p className="text-xs font-semibold uppercase text-gray-400">
                    Appointment ID
                  </p>

                  <p className="mt-2 break-all text-sm font-bold text-gray-800">
                    {bookingResult.appointmentId}
                  </p>
                </div>

                <Link
                  href="/dashboard/customer"
                  className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 py-4 font-bold text-white transition hover:bg-pink-700"
                >
                  Go to Dashboard
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <div className="flex items-center gap-2 text-pink-600">
                    <CalendarDays className="h-5 w-5" />
                    <span className="text-sm font-bold uppercase tracking-widest">
                      Appointment Booking
                    </span>
                  </div>

                  <h2 className="mt-3 text-2xl font-extrabold text-gray-900">
                    Book Your Service
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    Select your preferred date and time.
                  </p>
                </div>

                {/* Service Summary */}
                <div className="mb-7 flex items-center justify-between rounded-2xl bg-[#fff5f3] p-4">
                  <div>
                    <p className="font-bold text-gray-900">
                      {service.serviceName || service.name}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {service.category}
                    </p>
                  </div>

                  <p className="text-xl font-extrabold text-pink-600">
                    {formatPrice(service.price)}
                  </p>
                </div>

                {!session?.user ? (
                  <div className="rounded-2xl bg-pink-50 p-6 text-center">
                    <UserRound className="mx-auto h-10 w-10 text-pink-600" />

                    <h3 className="mt-4 font-bold text-gray-900">
                      Sign In Required
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      Please sign in to your account before booking
                      an appointment.
                    </p>

                    <Link
                      href="/sign-in"
                      className="mt-5 inline-flex rounded-xl bg-pink-600 px-6 py-3 font-semibold text-white hover:bg-pink-700"
                    >
                      Sign In Now
                    </Link>
                  </div>
                ) : userRole !== "customer" ? (
                  <div className="rounded-2xl bg-orange-50 p-6 text-center">
                    <p className="font-semibold text-orange-700">
                      Appointment booking is available for customers only.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleBooking} className="space-y-6">

                    {/* Date */}
                    <div>
                      <label
                        htmlFor="appointmentDate"
                        className="mb-2 block text-sm font-semibold text-gray-700"
                      >
                        Select Appointment Date
                      </label>

                      <input
                        id="appointmentDate"
                        type="date"
                        min={getLocalDate()}
                        value={appointmentDate}
                        onChange={(e) =>
                          setAppointmentDate(e.target.value)
                        }
                        required
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                      />
                    </div>

                    {/* Time Slot */}
                    <div>
                      <label
                        htmlFor="timeSlot"
                        className="mb-2 block text-sm font-semibold text-gray-700"
                      >
                        Select Available Time
                      </label>

                      <select
                        id="timeSlot"
                        value={timeSlot}
                        onChange={(e) =>
                          setTimeSlot(e.target.value)
                        }
                        required
                        disabled={
                          !appointmentDate ||
                          slotsLoading ||
                          !!slotsError ||
                          availableTimeSlots.length === 0
                        }
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        <option value="">
                          {!appointmentDate
                            ? "Select a date first"
                            : slotsLoading
                            ? "Checking available slots..."
                            : slotsError
                            ? "Unable to load slots"
                            : availableTimeSlots.length === 0
                            ? "No available slots"
                            : "Choose a time slot"}
                        </option>

                        {availableTimeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>

                      {/* Loading */}
                      {slotsLoading && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-pink-600">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Checking available time slots...
                        </div>
                      )}

                      {/* Error */}
                      {slotsError && (
                        <p className="mt-3 text-sm text-red-500">
                          {slotsError}
                        </p>
                      )}

                      {/* Available */}
                      {!slotsLoading &&
                        !slotsError &&
                        appointmentDate &&
                        availableTimeSlots.length > 0 && (
                          <p className="mt-2 text-xs text-green-600">
                            {availableTimeSlots.length} time slots available
                          </p>
                        )}

                      {/* No slots */}
                      {!slotsLoading &&
                        !slotsError &&
                        appointmentDate &&
                        availableTimeSlots.length === 0 && (
                          <p className="mt-2 text-xs text-red-500">
                            No available slots for this date. Please select another date.
                          </p>
                        )}

                      {/* Booked slots */}
                      {!slotsLoading &&
                        !slotsError &&
                        bookedTimeSlots.length > 0 && (
                          <p className="mt-2 text-xs text-gray-400">
                            {bookedTimeSlots.length} time slots already booked.
                          </p>
                        )}
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="message"
                        className="mb-2 block text-sm font-semibold text-gray-700"
                      >
                        Additional Message (Optional)
                      </label>

                      <textarea
                        id="message"
                        rows={4}
                        maxLength={500}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us if you have any special requests..."
                        className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-gray-800 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                      />

                      <p className="mt-1 text-right text-xs text-gray-400">
                        {message.length}/500
                      </p>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={
                        booking ||
                        slotsLoading ||
                        !!slotsError ||
                        !appointmentDate ||
                        !timeSlot ||
                        !availableTimeSlots.includes(timeSlot)
                      }
                      className="flex w-full items-center justify-center gap-3 rounded-xl bg-pink-600 py-4 font-bold text-white shadow-lg shadow-pink-200 transition hover:-translate-y-0.5 hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {booking ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Booking...
                        </>
                      ) : (
                        <>
                          Book Appointment
                          <ArrowRight className="h-5 w-5" />
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs leading-5 text-gray-400">
                      Your booking will be pending until admin
                      confirmation. No payment is collected at this step.
                    </p>
                  </form>
                )}
              </>
            )}

          </div>
        </div>
      </section>
    </div>
  );
}
