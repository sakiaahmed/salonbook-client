
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp, signIn } from "../../lib/auth-client";
import toast from "react-hot-toast";
import { Loader2, Upload } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    image: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Profile Image Upload
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageUploading(true);

    const imageFormData = new FormData();
    imageFormData.append("image", file);

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: imageFormData,
        }
      );

      const data = await res.json();

      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          image: data.data.url,
        }));

        toast.success("Image uploaded!");
      } else {
        toast.error("Image upload failed");
      }
    } catch {
      toast.error("Error uploading image");
    } finally {
      setImageUploading(false);
    }
  };

  // Email and Password Signup
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (!/[A-Z]/.test(formData.password)) {
      return toast.error(
        "Password must contain an uppercase letter"
      );
    }

    if (!/[a-z]/.test(formData.password)) {
      return toast.error(
        "Password must contain a lowercase letter"
      );
    }

    setLoading(true);

    try {
      const { error } = await signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        image: formData.image,
        role: "customer",
      } as any);

      if (error) {
        toast.error(error.message || "Failed to sign up");
        return;
      }

      toast.success("Account created successfully!");
      router.push("/dashboard/customer");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Google Signup
  const handleGoogleSignup = async () => {
    setGoogleLoading(true);

    try {
      const { error } = await signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/dashboard/customer`,
      });

      if (error) {
        toast.error(error.message || "Google signup failed");
        setGoogleLoading(false);
      }
    } catch {
      toast.error("Unable to sign up with Google");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">

        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Create an Account
        </h2>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>

            <input
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>

            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>

            <input
              required
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
              placeholder="At least 6 chars, 1 Upper, 1 Lower"
            />
          </div>

          {/* Profile Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Image (Optional)
            </label>

            <div className="flex items-center gap-4">
              <label className="cursor-pointer bg-pink-50 text-pink-600 px-4 py-2 rounded-lg font-medium hover:bg-pink-100 transition flex items-center gap-2">

                {imageUploading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}

                {imageUploading ? "Uploading..." : "Upload Image"}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {formData.image && (
                <img
                  src={formData.image}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
            </div>
          </div>

          <button
            disabled={loading || imageUploading || googleLoading}
            type="submit"
            className="w-full bg-pink-600 text-white font-bold py-3 rounded-lg hover:bg-pink-700 transition disabled:opacity-50 flex justify-center items-center gap-2 mt-4"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Sign Up"
            )}
          </button>

        </form>

        {/* OR Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 border-t border-gray-200"></div>

          <span className="text-sm text-gray-500">OR</span>

          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Google Signup */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={loading || imageUploading || googleLoading}
          className="w-full border border-gray-300 bg-white text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {googleLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <svg viewBox="0 0 48 48" className="w-5 h-5">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.16 13.22l7.98 6.19C13.07 13.72 18.13 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.97 46.98 31.7 46.98 24.55z"
                />
                <path
                  fill="#FBBC05"
                  d="M11.14 28.59A14.4 14.4 0 0 1 10.35 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 3.16 10.78l7.98-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.47 0 11.9-2.13 15.87-5.8l-7.73-6c-2.14 1.45-4.87 2.3-8.14 2.3-5.87 0-10.93-4.22-12.86-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>

              Continue with Google
            </>
          )}
        </button>

        {/* Sign In Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-pink-600 font-medium hover:underline"
          >
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}
