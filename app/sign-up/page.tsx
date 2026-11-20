"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "../../lib/auth-client"; // পাথ ঠিক করা হয়েছে
import toast from "react-hot-toast";
import { Loader2, Upload } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    const imageFormData = new FormData();
    imageFormData.append("image", file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: "POST",
        body: imageFormData,
      });
      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, image: data.data.url }));
        toast.success("Image uploaded!");
      } else {
        toast.error("Image upload failed");
      }
    } catch (error) {
      toast.error("Error uploading image");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    if (!/[A-Z]/.test(formData.password)) {
      return toast.error("Password must contain an uppercase letter");
    }
    if (!/[a-z]/.test(formData.password)) {
      return toast.error("Password must contain a lowercase letter");
    }

    setLoading(true);
    const { error } = await signUp.email({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      image: formData.image,
      role: "customer",
    } as any); // as any যোগ করা হয়েছে এরর দূর করার জন্য
    setLoading(false);

    if (error) {
      toast.error(error.message || "Failed to sign up");
    } else {
      toast.success("Account created successfully!");
      router.push("/dashboard/customer");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Create an Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input required type="text" name="name" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none" placeholder="John Doe" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input required type="email" name="email" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none" placeholder="you@example.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input required type="password" name="password" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none" placeholder="At least 6 chars, 1 Upper, 1 Lower" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image (Optional)</label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer bg-pink-50 text-pink-600 px-4 py-2 rounded-lg font-medium hover:bg-pink-100 transition flex items-center gap-2">
                {imageUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                {imageUploading ? "Uploading..." : "Upload Image"}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              {formData.image && (
                <img src={formData.image} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
              )}
            </div>
          </div>

          <button disabled={loading || imageUploading} type="submit" className="w-full bg-pink-600 text-white font-bold py-3 rounded-lg hover:bg-pink-700 transition disabled:opacity-50 flex justify-center items-center gap-2 mt-4">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account? <Link href="/sign-in" className="text-pink-600 font-medium hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}