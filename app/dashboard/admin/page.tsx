
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";

import {
  CalendarDays,
  Clock,
  Scissors,
  Users,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  ShieldCheck,
  CreditCard,
  AlertCircle,
  Receipt,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Eye,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

type Appointment = {
  _id: string;
  serviceName?: string;
  category?: string;
  customerName?: string;
  customerEmail?: string;
  appointmentDate: string;
  timeSlot: string;
  servicePrice: number;
  status: string;
  paymentStatus: string;
  message?: string;
  createdAt?: string;
};

type Service = {
  _id: string;
  serviceName?: string;
  name?: string;
  category?: string;
  description?: string;
  price: number;
  duration?: number;
  image?: string;
  status: string;
  createdAt?: string;
};

type ServiceForm = {
  serviceName: string;
  category: string;
  description: string;
  price: string;
  duration: string;
  image: string;
  status: string;
};

const initialForm: ServiceForm = {
  serviceName: "",
  category: "",
  description: "",
  price: "",
  duration: "",
  image: "",
  status: "Active",
};

export default function AdminDashboard() {
  const { data: session, isPending } = useSession();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] = useState("");
  const [savingService, setSavingService] = useState(false);

  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(
    null
  );

  const [serviceForm, setServiceForm] =
    useState<ServiceForm>(initialForm);

  // Get JWT from Better Auth
  const getToken = async () => {
    const response = await fetch(`${API_URL}/api/auth/token`, {
      credentials: "include",
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok || !data.token) {
      throw new Error("Authentication failed. Please sign in again.");
    }

    return data.token as string;
  };

  // Fetch appointments and services
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = await getToken();

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [appointmentResponse, serviceResponse] = await Promise.all([
        fetch(`${API_URL}/api/appointments`, {
          headers,
          cache: "no-store",
        }),

        fetch(`${API_URL}/api/services/admin/all`, {
          headers,
          cache: "no-store",
        }),
      ]);

      const appointmentData = await appointmentResponse.json();
      const serviceData = await serviceResponse.json();

      if (!appointmentResponse.ok) {
        throw new Error(
          appointmentData.message || "Unable to load appointments"
        );
      }

      if (!serviceResponse.ok) {
        throw new Error(
          serviceData.message || "Unable to load services"
        );
      }

      setAppointments(
        Array.isArray(appointmentData) ? appointmentData : []
      );

      setServices(
        Array.isArray(serviceData) ? serviceData : []
      );

    } catch (error) {
      console.error("Admin dashboard error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isPending) return;

    if (session?.user) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [session, isPending, fetchDashboardData]);

  // Reset service form
  const resetServiceForm = () => {
    setServiceForm(initialForm);
    setEditingServiceId(null);
    setShowServiceForm(false);
  };

  // Open Add Service form
  const handleAddService = () => {
    setServiceForm(initialForm);
    setEditingServiceId(null);
    setShowServiceForm(true);
  };

  // Open Edit Service form
  const handleEditService = (service: Service) => {
    setEditingServiceId(service._id);

    setServiceForm({
      serviceName: service.serviceName || service.name || "",
      category: service.category || "",
      description: service.description || "",
      price: String(service.price),
      duration: String(service.duration || ""),
      image: service.image || "",
      status: service.status || "Active",
    });

    setShowServiceForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Handle form input
  const handleServiceInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setServiceForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Create or Update Service
  const handleServiceSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (
      !serviceForm.serviceName.trim() ||
      !serviceForm.category.trim() ||
      !serviceForm.description.trim() ||
      !serviceForm.image.trim()
    ) {
      toast.error("Please fill in all service fields.");
      return;
    }

    const price = Number(serviceForm.price);
    const duration = Number(serviceForm.duration);

    if (!Number.isFinite(price) || price <= 0) {
      toast.error("Price must be greater than zero.");
      return;
    }

    if (!Number.isFinite(duration) || duration <= 0) {
      toast.error("Duration must be greater than zero.");
      return;
    }

    if (!["Active", "Inactive"].includes(serviceForm.status)) {
      toast.error("Please select a valid status.");
      return;
    }

    try {
      setSavingService(true);

      const token = await getToken();

      const serviceData = {
        serviceName: serviceForm.serviceName.trim(),
        category: serviceForm.category.trim(),
        description: serviceForm.description.trim(),
        price,
        duration,
        image: serviceForm.image.trim(),
        status: serviceForm.status,
      };

      const isEditing = Boolean(editingServiceId);

      const url = isEditing
        ? `${API_URL}/api/services/${editingServiceId}`
        : `${API_URL}/api/services`;

      const response = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(serviceData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to save service"
        );
      }

      toast.success(
        isEditing
          ? "Service updated successfully!"
          : "Service created successfully!"
      );

      resetServiceForm();

      await fetchDashboardData();

    } catch (error) {
      console.error("Save service error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save service"
      );
    } finally {
      setSavingService(false);
    }
  };

  // Toggle service Active / Inactive
  const handleToggleService = async (service: Service) => {
    const nextStatus =
      service.status.toLowerCase() === "active"
        ? "Inactive"
        : "Active";

    const approved = window.confirm(
      `Are you sure you want to make "${service.serviceName || service.name}" ${nextStatus}?`
    );

    if (!approved) return;

    try {
      setUpdatingId(service._id);

      const token = await getToken();

      const response = await fetch(
        `${API_URL}/api/services/${service._id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status: nextStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update service status"
        );
      }

      toast.success(`Service is now ${nextStatus}.`);

      await fetchDashboardData();

    } catch (error) {
      console.error("Toggle service error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Status update failed"
      );
    } finally {
      setUpdatingId("");
    }
  };

  // Delete Service
  const handleDeleteService = async (service: Service) => {
    const approved = window.confirm(
      `Are you sure you want to permanently delete "${service.serviceName || service.name}"? This action cannot be undone.`
    );

    if (!approved) return;

    try {
      setUpdatingId(service._id);

      const token = await getToken();

      const response = await fetch(
        `${API_URL}/api/services/${service._id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete service"
        );
      }

      toast.success("Service deleted successfully!");

      if (editingServiceId === service._id) {
        resetServiceForm();
      }

      await fetchDashboardData();

    } catch (error) {
      console.error("Delete service error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete service"
      );
    } finally {
      setUpdatingId("");
    }
  };

  // Update appointment status
  const handleStatusUpdate = async (
    appointmentId: string,
    status: "confirmed" | "cancelled"
  ) => {
    const action =
      status === "confirmed" ? "confirm" : "cancel";

    const approved = window.confirm(
      `Are you sure you want to ${action} this appointment?`
    );

    if (!approved) return;

    try {
      setUpdatingId(appointmentId);

      const token = await getToken();

      const response = await fetch(
        `${API_URL}/api/appointments/${appointmentId}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Status update failed"
        );
      }

      toast.success(
        data.message || "Appointment updated successfully"
      );

      await fetchDashboardData();

    } catch (error) {
      console.error("Appointment update error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update appointment"
      );
    } finally {
      setUpdatingId("");
    }
  };

  // Statistics
  const pendingCount = appointments.filter(
    (item) => item.status?.toLowerCase() === "pending"
  ).length;

  const confirmedCount = appointments.filter(
    (item) => item.status?.toLowerCase() === "confirmed"
  ).length;

  const cancelledCount = appointments.filter(
    (item) => item.status?.toLowerCase() === "cancelled"
  ).length;

  const paidCount = appointments.filter(
    (item) => item.paymentStatus?.toLowerCase() === "paid"
  ).length;

  const activeServices = services.filter(
    (item) => item.status?.toLowerCase() === "active"
  ).length;

  const formatDate = (date: string) => {
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const statusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Session Loading
  if (isPending) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-pink-600" />
      </div>
    );
  }

  // Login Check
  if (!session?.user) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <ShieldCheck className="h-14 w-14 text-pink-500" />

        <h2 className="mt-5 text-2xl font-bold text-gray-900">
          Admin Login Required
        </h2>

        <p className="mt-3 text-gray-500">
          Please sign in to access the admin dashboard.
        </p>

        <Link
          href="/sign-in"
          className="mt-7 rounded-xl bg-pink-600 px-7 py-3 font-semibold text-white"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const userRole =
    (session.user as { role?: string }).role || "customer";

  if (userRole !== "admin") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <AlertCircle className="h-12 w-12 text-orange-500" />

        <h2 className="mt-4 text-xl font-bold text-gray-900">
          Admin Access Only
        </h2>

        <p className="mt-2 text-gray-500">
          You do not have permission to access this dashboard.
        </p>

        <Link
          href="/"
          className="mt-5 text-pink-600 hover:underline"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf9]">

      {/* Dashboard Header */}
      <section className="bg-[#fff1ef] px-6 py-12">
        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

            <div>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-pink-600 p-3 text-white">
                  <ShieldCheck className="h-7 w-7" />
                </div>

                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-pink-600">
                    Administration
                  </p>

                  <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
                    Admin Dashboard
                  </h1>
                </div>
              </div>

              <p className="mt-5 text-gray-600">
                Welcome back, {session.user.name}. Manage your salon bookings and services.
              </p>
            </div>

            <Link
              href="/dashboard/admin/transactions"
              className="inline-flex items-center justify-center gap-3 rounded-xl border border-pink-200 bg-white px-6 py-4 font-bold text-pink-700 shadow-sm transition hover:-translate-y-1 hover:border-pink-400 hover:bg-pink-50"
            >
              <Receipt className="h-5 w-5" />
              Transaction History
              <CreditCard className="h-5 w-5" />
            </Link>

          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">

        {/* Statistics */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {[
            {
              title: "Total Appointments",
              value: appointments.length,
              icon: CalendarDays,
              color: "bg-pink-100 text-pink-600",
            },
            {
              title: "Pending Appointments",
              value: pendingCount,
              icon: Clock,
              color: "bg-yellow-100 text-yellow-600",
            },
            {
              title: "Confirmed Appointments",
              value: confirmedCount,
              icon: CheckCircle2,
              color: "bg-green-100 text-green-600",
            },
            {
              title: "Cancelled Appointments",
              value: cancelledCount,
              icon: XCircle,
              color: "bg-red-100 text-red-600",
            },
            {
              title: "Paid Appointments",
              value: paidCount,
              icon: CreditCard,
              color: "bg-purple-100 text-purple-600",
            },
            {
              title: "Active Services",
              value: activeServices,
              icon: Scissors,
              color: "bg-orange-100 text-orange-600",
            },
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </p>

                    <h3 className="mt-3 text-3xl font-extrabold text-gray-900">
                      {stat.value}
                    </h3>
                  </div>

                  <div className={`rounded-xl p-4 ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            );
          })}

        </div>

        {/* ================================= */}
        {/* SERVICE MANAGEMENT */}
        {/* ================================= */}

        <div className="mt-16">

          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-pink-600">
                Manage Your Salon
              </p>

              <h2 className="mt-2 text-2xl font-extrabold text-gray-900 md:text-3xl">
                Service Management
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Add, edit, delete and control your salon services.
              </p>
            </div>

            <button
              onClick={handleAddService}
              className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-pink-100 transition hover:bg-pink-700"
            >
              <Plus className="h-5 w-5" />
              Add New Service
            </button>
          </div>

          {/* Add/Edit Form */}
          {showServiceForm && (
            <div className="mb-10 rounded-3xl border border-pink-100 bg-white p-6 shadow-xl shadow-pink-100/40 md:p-9">

              <div className="mb-7 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900">
                    {editingServiceId
                      ? "Edit Service"
                      : "Create New Service"}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Enter the service information below.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={resetServiceForm}
                  className="rounded-xl bg-gray-100 p-3 text-gray-600 transition hover:bg-red-100 hover:text-red-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleServiceSubmit} className="space-y-6">

                <div className="grid gap-6 md:grid-cols-2">

                  {/* Service Name */}
                  <div>
                    <label
                      htmlFor="serviceName"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Service Name *
                    </label>

                    <input
                      id="serviceName"
                      name="serviceName"
                      type="text"
                      required
                      value={serviceForm.serviceName}
                      onChange={handleServiceInput}
                      placeholder="Example: Haircut"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label
                      htmlFor="category"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Category *
                    </label>

                    <input
                      id="category"
                      name="category"
                      type="text"
                      required
                      value={serviceForm.category}
                      onChange={handleServiceInput}
                      placeholder="Example: Hair"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label
                      htmlFor="price"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Price (BDT) *
                    </label>

                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0.01"
                      step="0.01"
                      required
                      value={serviceForm.price}
                      onChange={handleServiceInput}
                      placeholder="500"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label
                      htmlFor="duration"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Duration (Minutes) *
                    </label>

                    <input
                      id="duration"
                      name="duration"
                      type="number"
                      min="1"
                      step="1"
                      required
                      value={serviceForm.duration}
                      onChange={handleServiceInput}
                      placeholder="30"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                    />
                  </div>

                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Description *
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    required
                    value={serviceForm.description}
                    onChange={handleServiceInput}
                    placeholder="Describe this salon service..."
                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label
                    htmlFor="image"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Service Image URL *
                  </label>

                  <input
                    id="image"
                    name="image"
                    type="url"
                    required
                    value={serviceForm.image}
                    onChange={handleServiceInput}
                    placeholder="https://example.com/service-image.jpg"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    Paste a publicly accessible image URL.
                  </p>

                  {serviceForm.image && (
                    <div className="mt-4 overflow-hidden rounded-xl border border-gray-100">
                      <img
                        src={serviceForm.image}
                        alt="Service preview"
                        className="h-48 w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label
                    htmlFor="status"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Service Status *
                  </label>

                  <select
                    id="status"
                    name="status"
                    value={serviceForm.status}
                    onChange={handleServiceInput}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100 md:max-w-xs"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Form Actions */}
                <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-6">

                  <button
                    type="submit"
                    disabled={savingService}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-pink-600 px-7 py-3.5 font-bold text-white transition hover:bg-pink-700 disabled:opacity-50"
                  >
                    {savingService ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Save className="h-5 w-5" />
                    )}

                    {savingService
                      ? "Saving..."
                      : editingServiceId
                        ? "Update Service"
                        : "Create Service"}
                  </button>

                  <button
                    type="button"
                    onClick={resetServiceForm}
                    disabled={savingService}
                    className="rounded-xl border border-gray-200 bg-white px-7 py-3.5 font-semibold text-gray-600 transition hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                </div>

              </form>
            </div>
          )}

          {/* Service Grid */}
          {loading ? (
            <div className="rounded-2xl bg-white py-16 text-center">
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-pink-600" />

              <p className="mt-4 text-gray-500">
                Loading services...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
              <AlertCircle className="mx-auto h-10 w-10 text-red-500" />

              <p className="mt-4 font-semibold text-red-600">
                {error}
              </p>
            </div>
          ) : services.length === 0 ? (
            <div className="rounded-3xl border border-gray-100 bg-white px-6 py-16 text-center">
              <Scissors className="mx-auto h-14 w-14 text-pink-300" />

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                No Services Available
              </h3>

              <p className="mt-3 text-gray-500">
                Add your first salon service to get started.
              </p>
            </div>
          ) : (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">

              {services.map((service) => (
                <div
                  key={service._id}
                  className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >

                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-pink-100 to-orange-100">

                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.serviceName || service.name || "Service"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Scissors className="h-16 w-16 text-pink-300" />
                      </div>
                    )}

                    <span
                      className={`absolute right-4 top-4 rounded-full px-3 py-1.5 text-xs font-bold ${
                        service.status?.toLowerCase() === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {service.status}
                    </span>
                  </div>

                  {/* Information */}
                  <div className="p-6">

                    <p className="text-xs font-bold uppercase tracking-widest text-pink-600">
                      {service.category}
                    </p>

                    <h3 className="mt-2 text-xl font-bold text-gray-900">
                      {service.serviceName || service.name}
                    </h3>

                    <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-gray-500">
                      {service.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-5">

                      <div>
                        <p className="text-xs text-gray-400">
                          Price
                        </p>

                        <p className="mt-1 text-xl font-extrabold text-pink-600">
                          ৳{Number(service.price).toLocaleString("en-BD")}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-gray-400">
                          Duration
                        </p>

                        <p className="mt-1 font-semibold text-gray-700">
                          {service.duration || "N/A"} min
                        </p>
                      </div>

                    </div>

                    {/* Actions */}
                    <div className="mt-6 grid grid-cols-2 gap-3">

                      <button
                        onClick={() => handleEditService(service)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-pink-200 bg-pink-50 py-3 text-sm font-bold text-pink-700 transition hover:bg-pink-100"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteService(service)}
                        disabled={updatingId === service._id}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                      >
                        {updatingId === service._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        Delete
                      </button>

                      <button
                        onClick={() => handleToggleService(service)}
                        disabled={updatingId === service._id}
                        className="col-span-2 inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-sm font-bold text-gray-700 transition hover:border-pink-400 hover:text-pink-600 disabled:opacity-50"
                      >
                        <Eye className="h-4 w-4" />

                        {service.status?.toLowerCase() === "active"
                          ? "Deactivate Service"
                          : "Activate Service"}
                      </button>

                    </div>
                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

        {/* ================================= */}
        {/* APPOINTMENT MANAGEMENT */}
        {/* ================================= */}

        <div className="mt-20">

          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-pink-600">
                Booking Management
              </p>

              <h2 className="mt-2 text-2xl font-extrabold text-gray-900 md:text-3xl">
                Manage Appointments
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Review, confirm and cancel customer bookings.
              </p>
            </div>

            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:border-pink-400 hover:text-pink-600 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="rounded-2xl bg-white py-20 text-center">
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-pink-600" />

              <p className="mt-4 text-gray-500">
                Loading appointments...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
              <p className="font-semibold text-red-600">
                {error}
              </p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="rounded-3xl border border-gray-100 bg-white px-6 py-20 text-center">
              <CalendarDays className="mx-auto h-14 w-14 text-pink-300" />

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                No Appointments Found
              </h3>

              <p className="mt-3 text-gray-500">
                Customer bookings will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-6">

              {appointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:shadow-lg"
                >
                  <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-center">

                    <div>

                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-900">
                          {appointment.serviceName || "Salon Service"}
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${statusStyle(appointment.status)}`}
                        >
                          {appointment.status}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 text-sm text-gray-500 sm:grid-cols-2">

                        <p className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-pink-500" />
                          {appointment.customerName || "Customer"}
                        </p>

                        <p>{appointment.customerEmail}</p>

                        <p className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-pink-500" />
                          {formatDate(appointment.appointmentDate)}
                        </p>

                        <p className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-pink-500" />
                          {appointment.timeSlot}
                        </p>

                      </div>

                      {appointment.message && (
                        <div className="mt-4 rounded-xl bg-gray-50 p-4">
                          <p className="text-xs font-semibold uppercase text-gray-400">
                            Customer Message
                          </p>

                          <p className="mt-2 text-sm text-gray-700">
                            {appointment.message}
                          </p>
                        </div>
                      )}

                      <div className="mt-4 flex flex-wrap items-center gap-3">

                        <span className="font-bold text-pink-600">
                          ৳{Number(appointment.servicePrice).toLocaleString("en-BD")}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                            appointment.paymentStatus?.toLowerCase() === "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          Payment: {appointment.paymentStatus}
                        </span>

                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 lg:flex-col">

                      {appointment.status?.toLowerCase() === "pending" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(
                              appointment._id,
                              "confirmed"
                            )
                          }
                          disabled={updatingId === appointment._id}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          {updatingId === appointment._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4" />
                          )}

                          Confirm
                        </button>
                      )}

                      {["pending", "confirmed"].includes(
                        appointment.status?.toLowerCase()
                      ) && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(
                              appointment._id,
                              "cancelled"
                            )
                          }
                          disabled={updatingId === appointment._id}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          <XCircle className="h-4 w-4" />
                          Cancel
                        </button>
                      )}

                      {appointment.status?.toLowerCase() === "cancelled" && (
                        <span className="text-center text-sm font-semibold text-gray-400">
                          No further actions
                        </span>
                      )}

                    </div>
                  </div>
                </div>
              ))}

            </div>
          )}

        </div>

      </section>
    </div>
  );
}
