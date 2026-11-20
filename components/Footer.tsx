
import Link from "next/link";
import { Scissors, Heart, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#201720] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">

        <div className="grid gap-12 md:grid-cols-3">

          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="rounded-xl bg-pink-600 p-3">
                <Scissors className="h-6 w-6 text-white" />
              </div>

              <span className="text-2xl font-extrabold">
                SalonBook
              </span>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-gray-400">
              Your beauty, your moment, your salon.
              Discover your favorite salon services and
              enjoy a convenient online booking experience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold">
              Quick Links
            </h3>

            <div className="mt-6 flex flex-col gap-4">
              <Link href="/" className="w-fit text-sm text-gray-400 transition hover:text-pink-400">
                Home
              </Link>

              <Link href="/services" className="w-fit text-sm text-gray-400 transition hover:text-pink-400">
                Browse Services
              </Link>

              <Link href="/sign-in" className="w-fit text-sm text-gray-400 transition hover:text-pink-400">
                Sign In
              </Link>

              <Link href="/sign-up" className="w-fit text-sm text-gray-400 transition hover:text-pink-400">
                Create Account
              </Link>
            </div>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-lg font-bold">
              Start Your Journey
            </h3>

            <p className="mt-6 text-sm leading-7 text-gray-400">
              Ready for your next salon experience?
              Explore our services and book your appointment today.
            </p>

            <Link
              href="/services"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-pink-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-pink-700"
            >
              Explore Services
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-14 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-8 text-center sm:flex-row sm:text-left">

          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} SalonBook. All rights reserved.
          </p>

          <p className="flex items-center gap-2 text-sm text-gray-400">
            Made with
            <Heart className="h-4 w-4 fill-pink-500 text-pink-500" />
            for your beauty
          </p>

        </div>

      </div>
    </footer>
  );
}
