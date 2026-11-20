
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Clock,
  ArrowRight,
  Scissors,
  Sparkles,
  Loader2,
  RefreshCw,
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

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/services`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load services");
      }

      const data = await response.json();

      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Services fetch error:", err);
      setError("Unable to load services. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const categories = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(
          services
            .map((service) => service.category)
            .filter((value): value is string => Boolean(value))
        )
      ),
    ];
  }, [services]);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const name = service.serviceName || service.name || "";
      const query = search.toLowerCase();

      const matchesSearch =
        name.toLowerCase().includes(query) ||
        (service.description || "").toLowerCase().includes(query);

      const matchesCategory =
        category === "All" || service.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [services, search, category]);

  const formatPrice = (price: number) => {
    return `৳${Number(price).toLocaleString("en-BD")}`;
  };

  return (
    <div className="min-h-screen bg-[#fffaf9]">
      {/* PAGE HERO */}
      <section className="bg-[#fff1ef] px-6 py-20">
        <div className="mx-auto max-w-7xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-pink-600 shadow-sm">
            <Sparkles className="h-4 w-4" />
            Discover Your Beauty
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
            Our Salon Services
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-gray-600 md:text-lg">
            Explore our range of beauty and salon services.
            Find your favorite treatment and book your next appointment
            with SalonBook.
          </p>

          <div className="mx-auto mt-8 flex max-w-xl items-center gap-3 rounded-2xl border border-pink-100 bg-white px-5 py-4 shadow-lg shadow-pink-100/50">
            <Search className="h-5 w-5 shrink-0 text-pink-500" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search salon services..."
              className="w-full bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
            />
          </div>
        </div>
      </section>

      {/* SERVICES LIST */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-pink-600">
              Explore Our Collection
            </span>

            <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
              Available Services
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {services.length} services available
            </p>
          </div>

          {/* CATEGORY FILTER */}
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  category === item
                    ? "bg-pink-600 text-white shadow-lg shadow-pink-200"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-pink-400 hover:text-pink-600"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex min-h-64 items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-pink-600" />
              <p className="mt-4 text-gray-500">
                Loading salon services...
              </p>
            </div>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
            <p className="font-semibold text-red-600">{error}</p>

            <button
              onClick={fetchServices}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-pink-600 px-5 py-3 font-semibold text-white hover:bg-pink-700"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && filteredServices.length === 0 && (
          <div className="rounded-3xl border border-gray-100 bg-white px-6 py-20 text-center">
            <Scissors className="mx-auto h-12 w-12 text-pink-400" />

            <h3 className="mt-5 text-xl font-bold text-gray-900">
              No Services Found
            </h3>

            <p className="mt-2 text-gray-500">
              Try another search or category.
            </p>
          </div>
        )}

        {/* SERVICE CARDS */}
        {!loading && !error && filteredServices.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <div
                key={service._id}
                className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-pink-100"
              >
                {/* SERVICE IMAGE */}
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-pink-100 to-orange-100">
                  <div className="flex h-full items-center justify-center">
                    <Scissors className="h-20 w-20 text-pink-300" />
                  </div>

                  {(service.image || service.imageUrl) && (
                    <img
                      src={service.image || service.imageUrl}
                      alt={service.serviceName || service.name || "Salon service"}
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                  )}

                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-pink-600 shadow-sm">
                    {service.category || "Salon"}
                  </span>
                </div>

                {/* SERVICE INFORMATION */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {service.serviceName || service.name || "Salon Service"}
                  </h3>

                  <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-gray-500">
                    {service.description || "Discover this salon service."}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        Starting from
                      </p>

                      <p className="mt-1 text-2xl font-extrabold text-pink-600">
                        {formatPrice(service.price)}
                      </p>
                    </div>

                    {service.duration && (
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        {service.duration} min
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/services/${service._id}`}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 py-3.5 font-semibold text-white transition hover:bg-pink-700"
                  >
                    View Details
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* BOTTOM CTA */}
      <section className="bg-[#fff1ef] px-6 py-16 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Ready for a Little Self Care?
        </h2>

        <p className="mt-3 text-gray-600">
          Find your favorite salon service and make time for yourself.
        </p>

        <Link
          href="/sign-up"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-pink-600 px-7 py-4 font-semibold text-white transition hover:bg-pink-700"
        >
          Create Your Account
          <ArrowRight className="h-5 w-5" />
        </Link>
      </section>
    </div>
  );
}
