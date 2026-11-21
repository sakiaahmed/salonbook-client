
"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  Scissors,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      router.push("/");
    } catch {
      toast.error("Logout failed");
    }
  };

  const user = session?.user;
  const role = (user as any)?.role;

  const dashboardPath =
    role === "admin"
      ? "/dashboard/admin"
      : "/dashboard/customer";

  const profilePath =
    role === "admin"
      ? "/dashboard/admin/profile"
      : "/dashboard/customer/profile";

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-lg bg-pink-600 p-2">
              <Scissors className="h-5 w-5 text-white" />
            </div>

            <span className="text-xl font-bold text-gray-900">
              SalonBook
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/"
              className="font-medium text-gray-600 hover:text-pink-600"
            >
              Home
            </Link>

            <Link
              href="/services"
              className="font-medium text-gray-600 hover:text-pink-600"
            >
              Browse Services
            </Link>
          </div>

          {/* Desktop User Section */}
          <div className="hidden items-center gap-4 md:flex">
            {user ? (
              <div className="flex items-center gap-3">

                {/* User Info */}
                <div className="flex items-center gap-2 border-r border-gray-200 pr-4">
                  <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-pink-100 font-bold uppercase text-pink-700">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name || "User"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      user.name?.charAt(0)
                    )}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900">
                      {user.name}
                    </span>

                    <span className="text-xs capitalize text-gray-500">
                      {role}
                    </span>
                  </div>
                </div>

                {/* Dashboard */}
                <Link
                  href={dashboardPath}
                  className="flex items-center gap-2 rounded-full bg-pink-50 px-4 py-2 font-medium text-pink-700 transition hover:bg-pink-100"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>

                {/* My Profile */}
                <Link
                  href={profilePath}
                  className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-200"
                >
                  <UserRound className="h-4 w-4" />
                  My Profile
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 font-medium text-gray-500 hover:text-red-500"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="font-medium text-gray-600 hover:text-pink-600"
                >
                  Sign In
                </Link>

                <Link
                  href="/sign-up"
                  className="rounded-lg bg-pink-600 px-5 py-2 font-medium text-white transition hover:bg-pink-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="space-y-2 border-t border-gray-100 bg-white px-4 pb-4 pt-2 md:hidden">

          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-gray-600"
          >
            Home
          </Link>

          <Link
            href="/services"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-gray-600"
          >
            Browse Services
          </Link>

          <div className="flex flex-col gap-2 border-t border-gray-100 pt-4">
            {user ? (
              <>
                <div className="flex items-center gap-3 py-2">
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-pink-100 font-bold uppercase text-pink-700">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name || "User"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      user.name?.charAt(0)
                    )}
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">
                      {user.name}
                    </p>

                    <p className="text-xs capitalize text-gray-500">
                      {role}
                    </p>
                  </div>
                </div>

                <Link
                  href={dashboardPath}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg bg-pink-50 py-3 text-center text-pink-700"
                >
                  <LayoutDashboard className="mr-2 inline h-4 w-4" />
                  Dashboard
                </Link>

                <Link
                  href={profilePath}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg bg-gray-100 py-3 text-center text-gray-700"
                >
                  <UserRound className="mr-2 inline h-4 w-4" />
                  My Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 py-3 text-red-500"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg border border-gray-200 py-2 text-center text-gray-600"
                >
                  Sign In
                </Link>

                <Link
                  href="/sign-up"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg bg-pink-600 py-2 text-center text-white"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
