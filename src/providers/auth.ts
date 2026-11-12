import type { AuthProvider } from "@refinedev/core";
import { authClient } from "./auth-client";

const getError = (message: string) => ({
  name: "AuthenticationError",
  message,
});

export const getRoleHome = (role: unknown) => {
  if (role === "admin") return "/";
  if (role === "teacher") return "/teacher";
  return "/student";
};

export const authProvider: AuthProvider = {
  login: async ({ email, password, rememberMe }) => {
    if (typeof email !== "string" || typeof password !== "string") {
      return {
        success: false,
        error: getError("Email and password are required."),
      };
    }

    const { data, error } = await authClient.signIn.email({
      email,
      password,
      rememberMe: rememberMe === true,
    });

    if (error) {
      return { success: false, error: getError(error.message) };
    }

    const role = (data?.user as { role?: unknown } | undefined)?.role;
    if (role !== "admin" && role !== "teacher" && role !== "student") {
      return {
        success: false,
        error: getError("The account has no valid application role."),
      };
    }

    return { success: true, redirectTo: getRoleHome(role) };
  },
  register: async ({ name, email, password }) => {
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return {
        success: false,
        error: getError("Name, email, and password are required."),
      };
    }

    const { error } = await authClient.signUp.email({ name, email, password });

    if (error) {
      return { success: false, error: getError(error.message) };
    }

    return { success: true, redirectTo: "/student" };
  },
  logout: async () => {
    const { error } = await authClient.signOut();
    return error
      ? { success: false, error: getError(error.message) }
      : { success: true, redirectTo: "/login" };
  },
  check: async () => {
    const { data: session, error } = await authClient.getSession();

    if (error || !session) {
      return { authenticated: false, redirectTo: "/login" };
    }

    return { authenticated: true };
  },
  getIdentity: async () => {
    const { data: session } = await authClient.getSession();
    return session?.user ?? null;
  },
  onError: async (error) => ({ error }),
};