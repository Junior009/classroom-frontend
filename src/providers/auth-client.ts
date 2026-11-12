import { createAuthClient } from "better-auth/react";
import { BACKEND_BASE_URL } from "../components/constants";

export const authClient = createAuthClient({
  baseURL: BACKEND_BASE_URL.replace(/\/api\/?$/, "").replace(/\/$/, ""),
  fetchOptions: {
    credentials: "include",
  },
});