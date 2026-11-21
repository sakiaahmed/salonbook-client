
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Scissors,
  CalendarDays,
  Users,
  Receipt,
  UserCircle,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Services",
    href: "/dashboard/admin#services",
    icon: Scissors,
  },
  {
    name: "Appointments",
    href: "/dashboard/admin#appointments",
    icon: CalendarDays,
  },
  {
    name: "Manage Users",
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    name: "Transactions",
    href: "/dashboard/admin/transactions",
    icon: Receipt,
  },
  {
    name: "My Profile",
    href: "/dashboard/admin/profile",
    icon: UserCircle,
  },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href.includes("#")) {
      return pathname === "/dashboard/admin";
    }

    if (href === "/dashboard/admin") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#fffaf9]">

      {/* Mobile Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-pink-100 bg-white px-5 py-4 lg:hidden">

        <Link
          href="/dashboard/admin"
          className="flex items-center gap-2 text-xl font-extrabold text-pink-600"
        >
          <Sparkles className="h-6 w-6" />
          SalonBook
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-gray-700 hover:bg-gray-100"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

      </div>

      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-pink-100 bg-white transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
            mobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }`}
        >

          {/* Logo */}
          <div className="border-b border-gray-100 px-7 py-7">

            <Link
              href="/dashboard/admin"
              className="flex items-center gap-3"
            >
              <div className="rounded-xl bg-pink-600 p-3 text-white">
                <Sparkles className="h-6 w-6" />
              </div>

              <div>
                <h1 className="text-xl font-extrabold text-gray-900">
                  SalonBook
                </h1>

                <p className="text-xs font-medium text-pink-600">
                  Admin Panel
                </p>
              </div>
            </Link>

          </div>

          {/* Navigation */}
          <nav className="space-y-2 px-4 py-7">

            <p className="mb-4 px-3 text-xs font-bold uppercase tracking-widest text-gray-400">
              Management
            </p>

            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-pink-100 text-pink-700"
                      : "text-gray-600 hover:bg-pink-50 hover:text-pink-600"
                  }`}
                >
                  <Icon className="h-5 w-5" />

                  {item.name}
                </Link>
              );
            })}

          </nav>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 p-5">

            <Link
              href="/"
              className="flex items-center justify-center rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              Back to Website
            </Link>

            <p className="mt-4 text-center text-xs text-gray-400">
              SalonBook Admin Panel
            </p>

          </div>

        </aside>

        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            aria-label="Close navigation menu"
          />
        )}

        {/* Main Content */}
        <main className="min-w-0 flex-1">

          <div className="min-h-screen">
            {children}
          </div>

        </main>

      </div>
    </div>
  );
}
