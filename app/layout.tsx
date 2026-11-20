
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SalonBook - Salon Appointment Booking",
  description: "Book your salon appointments easily.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${inter.variable} flex min-h-screen flex-col`}>
        <Navbar />

        <main className="flex-1">
          {children}
        </main>

        <Footer />

        <Toaster position="top-center" />
      </body>
    </html>
  );
}
