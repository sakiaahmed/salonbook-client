
import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

const serverURL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

export const authClient = createAuthClient({
  baseURL: serverURL,

  plugins: [jwtClient()],

  fetchOptions: {
    credentials: "include",
  },
});

export const {
  signIn,
  signUp,
  useSession,
  signOut,
} = authClient;
