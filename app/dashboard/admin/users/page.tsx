
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader2, ShieldCheck, ShieldBan, Users } from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface User {
  _id: string;
  name?: string;
  email: string;
  image?: string;
  phoneNumber?: string;
  role: string;
  isBlocked?: boolean;
  createdAt?: string;
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);

      // Get JWT token from Better Auth
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error("Failed to get authentication token");
      }

      // Send token to backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const usersData = await response.json();

      setUsers(usersData);
    } catch (error) {
      console.error("Fetch users error:", error);

      toast.error(
        error instanceof Error ? error.message : "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Block or unblock user
  const handleBlockToggle = async (user: User) => {
    const action = user.isBlocked ? "unblock" : "block";

    try {
      setUpdatingId(user._id);

      // Get JWT token
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error("Failed to get authentication token");
      }

      // Send request to backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${user._id}/${action}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
          credentials: "include",
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || `Failed to ${action} user`
        );
      }

      toast.success(responseData.message);

      // Update UI without reloading
      setUsers((previousUsers) =>
        previousUsers.map((item) =>
          item._id === user._id
            ? { ...item, isBlocked: !item.isBlocked }
            : item
        )
      );
    } catch (error) {
      console.error("Block/unblock error:", error);

      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Calculate statistics
  const totalUsers = users.length;
  const blockedUsers = users.filter(
    (user) => user.isBlocked === true
  ).length;
  const activeUsers = totalUsers - blockedUsers;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Manage Users
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View and manage all registered users.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total Users */}
        <div className="rounded-xl border bg-white p-5">
          <div className="flex items-center gap-3">
            <Users className="text-blue-500" size={24} />

            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold">{totalUsers}</p>
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div className="rounded-xl border bg-white p-5">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-green-500" size={24} />

            <div>
              <p className="text-sm text-gray-500">Active Users</p>
              <p className="text-2xl font-bold">{activeUsers}</p>
            </div>
          </div>
        </div>

        {/* Blocked Users */}
        <div className="rounded-xl border bg-white p-5">
          <div className="flex items-center gap-3">
            <ShieldBan className="text-red-500" size={24} />

            <div>
              <p className="text-sm text-gray-500">Blocked Users</p>
              <p className="text-2xl font-bold">{blockedUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-xl border bg-white">
        <div className="border-b p-5">
          <h2 className="font-semibold text-gray-900">
            All Users
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2
              className="animate-spin text-orange-500"
              size={32}
            />
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Phone</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user._id}>
                    {/* User Information */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name || "User"}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 font-semibold">
                            {user.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                        )}

                        <div>
                          <p className="font-medium text-gray-900">
                            {user.name || "Unnamed User"}
                          </p>

                          <p className="text-gray-500">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-5 py-4 text-gray-600">
                      {user.phoneNumber || "N/A"}
                    </td>

                    {/* Role */}
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize">
                        {user.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          user.isBlocked
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4">
                      {user.role === "admin" ? (
                        <span className="text-xs text-gray-400">
                          Protected
                        </span>
                      ) : (
                        <button
                          onClick={() => handleBlockToggle(user)}
                          disabled={updatingId === user._id}
                          className={`rounded-lg px-3 py-2 text-xs font-medium transition disabled:opacity-50 ${
                            user.isBlocked
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          }`}
                        >
                          {updatingId === user._id ? (
                            <Loader2
                              size={14}
                              className="animate-spin"
                            />
                          ) : user.isBlocked ? (
                            "Unblock"
                          ) : (
                            "Block"
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
