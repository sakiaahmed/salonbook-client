
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import {
  getMyProfile,
  updateMyProfile,
  type UserProfile,
} from "@/lib/profile-api";
import toast from "react-hot-toast";
import {
  UserRound,
  Upload,
  Loader2,
  Save,
  ArrowLeft,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";

type ProfilePageProps = {
  expectedRole: "customer" | "admin";
};

export default function ProfilePage({
  expectedRole,
}: ProfilePageProps) {
  const { data: session, isPending } = useSession();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      setLoading(false);
      return;
    }

    let active = true;

    const fetchProfile = async () => {
      try {
        setLoading(true);

        const data = await getMyProfile();

        if (!active) return;

        setProfile(data);
        setName(data.name || "");
        setImage(data.image || "");
        setPhoneNumber(data.phoneNumber || "");
      } catch (error) {
        if (!active) return;

        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load profile"
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      active = false;
    };
  }, [session, isPending]);

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
      toast.error("Image upload configuration is missing.");
      e.target.value = "";
      return;
    }

    setImageUploading(true);

    const imageFormData = new FormData();
    imageFormData.append("image", file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: imageFormData,
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success || !data.data?.url) {
        throw new Error("Image upload failed.");
      }

      setImage(data.data.url);
      toast.success("Profile image uploaded successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to upload image"
      );
    } finally {
      setImageUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    try {
      setSaving(true);

      const result = await updateMyProfile({
        name: name.trim(),
        image: image.trim(),
        phoneNumber: phoneNumber.trim(),
      });

      setProfile(result.profile);

      setName(result.profile.name);
      setImage(result.profile.image);
      setPhoneNumber(result.profile.phoneNumber);

      toast.success(
        result.message || "Profile updated successfully!"
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-pink-600" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <UserRound className="h-14 w-14 text-pink-500" />

        <h2 className="mt-5 text-2xl font-bold text-gray-900">
          Login Required
        </h2>

        <p className="mt-3 text-gray-500">
          Please sign in to manage your profile.
        </p>

        <Link
          href="/sign-in"
          className="mt-7 rounded-xl bg-pink-600 px-7 py-3 font-semibold text-white hover:bg-pink-700"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <UserRound className="h-12 w-12 text-gray-400" />

        <h2 className="mt-4 text-xl font-bold text-gray-900">
          Unable to Load Profile
        </h2>

        <p className="mt-2 text-gray-500">
          Please refresh the page or sign in again.
        </p>
      </div>
    );
  }

  if (profile.role !== expectedRole) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <ShieldCheck className="h-12 w-12 text-orange-500" />

        <h2 className="mt-4 text-xl font-bold text-gray-900">
          Access Denied
        </h2>

        <p className="mt-2 text-gray-500">
          You do not have permission to access this profile page.
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

  const dashboardPath =
    expectedRole === "admin"
      ? "/dashboard/admin"
      : "/dashboard/customer";

  return (
    <div className="min-h-screen bg-[#fffaf9]">
      <section className="bg-[#fff1ef] px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-widest text-pink-600">
            {expectedRole} Dashboard
          </p>

          <h1 className="mt-3 text-3xl font-extrabold text-gray-900 md:text-4xl">
            My Profile
          </h1>

          <p className="mt-3 text-gray-600">
            Manage your personal information and profile picture.
          </p>

          <Link
            href={dashboardPath}
            className="mt-6 inline-flex items-center gap-2 font-semibold text-pink-700 hover:text-pink-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-6 md:px-10">
            <h2 className="text-xl font-bold text-gray-900">
              Personal Information
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Update your profile details below.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-8 p-6 md:p-10"
          >
            {/* Profile Image */}
            <div className="flex flex-col items-center gap-5 sm:flex-row">
              <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-pink-100 bg-pink-50">
                {image ? (
                  <img
                    src={image}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound className="h-14 w-14 text-pink-400" />
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Profile Picture
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Upload an image up to 5 MB.
                </p>

                <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-pink-50 px-5 py-3 font-semibold text-pink-700 transition hover:bg-pink-100">
                  {imageUploading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Upload className="h-5 w-5" />
                  )}

                  {imageUploading ? "Uploading..." : "Upload Image"}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={imageUploading || saving}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label
                htmlFor="profileName"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Full Name
              </label>

              <div className="relative">
                <UserRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  id="profileName"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="profileEmail"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  id="profileEmail"
                  type="email"
                  value={profile.email}
                  readOnly
                  className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-gray-500 outline-none"
                />
              </div>

              <p className="mt-2 text-xs text-gray-400">
                Your registered email address cannot be changed here.
              </p>
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="profilePhone"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Phone Number
              </label>

              <div className="relative">
                <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  id="profilePhone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                />
              </div>
            </div>

            {/* Account Role */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Account Role
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <ShieldCheck className="h-5 w-5 text-pink-600" />

                <span className="font-semibold capitalize text-gray-700">
                  {profile.role}
                </span>

                <span className="ml-auto text-xs text-gray-400">
                  Protected
                </span>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex flex-wrap justify-end border-t border-gray-100 pt-6">
              <button
                type="submit"
                disabled={saving || imageUploading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-pink-600 px-8 py-3.5 font-bold text-white shadow-lg shadow-pink-100 transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Save className="h-5 w-5" />
                )}

                {saving ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
