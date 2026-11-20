"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Scissors, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
    router.push("/");
  };

  const user = session?.user;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-pink-600 p-2 rounded-lg">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">SalonBook</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-pink-600 font-medium">Home</Link>
            <Link href="/services" className="text-gray-600 hover:text-pink-600 font-medium">Browse Services</Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 border-r border-gray-200 pr-4">
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-700 font-bold uppercase overflow-hidden">
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name?.charAt(0)
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900">{user.name}</span>
                    <span className="text-xs text-gray-500 capitalize">{(user as any).role}</span>
                  </div>
                </div>
                <Link href={`/dashboard/${(user as any).role}`} className="flex items-center gap-2 bg-pink-50 px-4 py-2 rounded-full text-pink-700 font-medium hover:bg-pink-100 transition">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 font-medium flex items-center gap-1">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <>
                <Link href="/sign-in" className="text-gray-600 hover:text-pink-600 font-medium">Sign In</Link>
                <Link href="/sign-up" className="bg-pink-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-pink-700 transition">Sign Up</Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-2">
          <Link href="/" className="block py-2 text-gray-600">Home</Link>
          <Link href="/services" className="block py-2 text-gray-600">Browse Services</Link>
          <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
            {user ? (
              <>
                <Link href={`/dashboard/${(user as any).role}`} className="block py-2 text-center bg-pink-50 text-pink-700 rounded-lg">Dashboard</Link>
                <button onClick={handleLogout} className="block w-full text-center py-2 text-red-500">Logout</button>
              </>
            ) : (
              <>
                <Link href="/sign-in" className="block py-2 text-center text-gray-600 border border-gray-200 rounded-lg">Sign In</Link>
                <Link href="/sign-up" className="block py-2 text-center bg-pink-600 text-white rounded-lg">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}