
import { authClient } from "./auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image: string;
  phoneNumber: string;
  role: string;
  isBlocked: boolean;
}

interface ProfileResponse {
  success: boolean;
  message?: string;
  profile: UserProfile;
}

const getAuthToken = async () => {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Authentication token could not be retrieved");
  }

  return data.token;
};

export const getMyProfile = async (): Promise<UserProfile> => {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/api/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch profile");
  }

  return result.profile;
};

export const updateMyProfile = async (
  profileData: {
    name: string;
    image: string;
    phoneNumber: string;
  }
): Promise<ProfileResponse> => {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/api/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update profile");
  }

  return result;
};
