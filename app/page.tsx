
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Clock3,
  Heart,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
  CheckCircle2,
  UserRound,
} from "lucide-react";

const features = [
  {
    icon: CalendarCheck,
    title: "Easy Online Booking",
    description:
      "Book your favorite salon services anytime, anywhere with just a few clicks.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Professionals",
    description:
      "Enjoy quality salon services from experienced and skilled professionals.",
  },
  {
    icon: Clock3,
    title: "Flexible Scheduling",
    description:
      "Choose a date and time that perfectly fits your daily schedule.",
  },
];

const steps = [
  {
    number: "01",
    title: "Explore Services",
    description: "Browse our available salon services and find your favorite.",
  },
  {
    number: "02",
    title: "Book Your Appointment",
    description: "Select your preferred date and available time slot.",
  },
  {
    number: "03",
    title: "Enjoy Your Experience",
    description: "Confirm your appointment and enjoy your salon experience.",
  },
];

export default function Home() {
  return (
    <div className="overflow-hidden bg-white text-gray-900">
      {/* HERO SECTION */}
      <section className="relative bg-[#fff7f5]">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-pink-200/40 blur-3xl" />
        <div className="absolute -bottom-20 left-0 h-64 w-64 rounded-full bg-orange-100/60 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 md:grid-cols-2 md:px-10 md:py-28">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white px-4 py-2 text-sm font-semibold text-pink-700 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Your Beauty, Your Schedule
            </div>

            <h1 className="max-w-xl text-5xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-6xl lg:text-7xl">
              Your Beauty.
              <br />
              Your Moment.
              <br />
              <span className="text-pink-600">Your Salon.</span>
            </h1>

            <p className="mt-7 max-w-lg text-base leading-8 text-gray-600 md:text-lg">
              Discover your favorite salon services and book your next
              appointment effortlessly. A beautiful experience starts with
              SalonBook.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/services"
                className="inline-flex items-center gap-3 rounded-xl bg-pink-600 px-7 py-4 font-semibold text-white shadow-lg shadow-pink-200 transition hover:-translate-y-1 hover:bg-pink-700"
              >
                Explore Services
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                href="/sign-up"
                className="rounded-xl border border-gray-300 bg-white px-7 py-4 font-semibold text-gray-800 transition hover:border-pink-500 hover:text-pink-600"
              >
                Get Started
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <div className="flex -space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-pink-200 text-pink-700">
                  <UserRound className="h-5 w-5" />
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-orange-200 text-orange-700">
                  <UserRound className="h-5 w-5" />
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-purple-200 text-purple-700">
                  <UserRound className="h-5 w-5" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1 text-yellow-500">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <Star key={item} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Your beauty journey starts here
                </p>
              </div>
            </div>
          </div>

          {/* HERO VISUAL */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute inset-8 rounded-full bg-pink-200/60 blur-3xl" />

            <div className="relative rounded-[2rem] border border-white bg-gradient-to-br from-pink-200 via-rose-100 to-orange-100 p-7 shadow-2xl shadow-pink-200/50 md:p-10">
              <div className="flex min-h-[400px] flex-col justify-between rounded-[1.5rem] border border-white/70 bg-white/70 p-7 backdrop-blur-md md:p-9">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-600 text-white shadow-lg shadow-pink-200">
                    <Scissors className="h-6 w-6" />
                  </div>

                  <span className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">
                    Beauty Starts Here
                  </span>
                </div>

                <div className="py-10 text-center">
                  <div className="mx-auto mb-6 flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-pink-300 to-orange-200 shadow-inner">
                    <Sparkles className="h-20 w-20 text-white" />
                  </div>

                  <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                    Feel Beautiful.
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    Take some time for yourself.
                    <br />
                    You deserve it.
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-4 shadow-lg shadow-pink-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
                        <CalendarCheck className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="font-bold text-gray-900">
                          Your Next Appointment
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Book your favorite service
                        </p>
                      </div>
                    </div>

                    <CheckCircle2 className="h-6 w-6 text-pink-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -left-5 top-20 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-xl md:-left-10">
              <Heart className="h-5 w-5 fill-pink-500 text-pink-500" />
              <span className="text-sm font-semibold text-gray-800">
                Self Care Matters
              </span>
            </div>

            <div className="absolute -right-4 bottom-20 rounded-2xl bg-white px-4 py-3 shadow-xl md:-right-8">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-semibold text-gray-800">
                  Feel Special
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:px-10">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-pink-600">
            Why SalonBook
          </span>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
            Beauty Booking Made Simple
          </h2>

          <p className="mt-4 leading-7 text-gray-500">
            Everything you need for a convenient and enjoyable salon booking
            experience.
          </p>
        </div>

        <div className="grid gap-7 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl hover:shadow-pink-100"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="text-xl font-bold text-gray-900">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-7 text-gray-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#fff7f5] px-6 py-24 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-pink-600">
              Simple Process
            </span>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
              Book Your Appointment in 3 Steps
            </h2>

            <p className="mt-4 leading-7 text-gray-500">
              Getting your favorite salon service has never been easier.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="relative rounded-3xl border border-pink-100 bg-white p-8"
              >
                <span className="text-5xl font-extrabold text-pink-100">
                  {step.number}
                </span>

                <h3 className="mt-6 text-xl font-bold text-gray-900">
                  {step.title}
                </h3>

                <p className="mt-4 leading-7 text-gray-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="px-6 py-24 md:px-10">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-pink-600 to-rose-500 px-7 py-16 text-center shadow-xl shadow-pink-200 md:px-16">
          <Sparkles className="mx-auto h-10 w-10 text-pink-100" />

          <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-extrabold leading-tight text-white md:text-5xl">
            Ready to Feel Your Best?
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-pink-100">
            Your next salon experience is just a few clicks away.
            Create your account and start exploring today.
          </p>

          <Link
            href="/services"
            className="mt-9 inline-flex items-center gap-3 rounded-xl bg-white px-8 py-4 font-bold text-pink-700 transition hover:-translate-y-1 hover:bg-pink-50"
          >
            Book Your Appointment
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
