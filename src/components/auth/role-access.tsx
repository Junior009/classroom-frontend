import { useGetIdentity } from "@refinedev/core";
import { Navigate, Outlet } from "react-router";
import type { User } from "@/types";
import { getRoleHome } from "@/providers/auth";
import type { UserRole } from "@/types";

type RoleGuardProps = {
  allowedRoles: UserRole[];
};

export function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const { data: user, isLoading } = useGetIdentity<User>();

  if (isLoading) {
    return <p className="p-6 text-sm text-muted-foreground" role="status">A verificar acesso...</p>;
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={getRoleHome(user.role)} replace />;
  }

  return <Outlet />;
}

export function RoleHome() {
  const { data: user, isLoading } = useGetIdentity<User>();

  if (isLoading) {
    return <p className="p-6 text-sm text-muted-foreground" role="status">A carregar a sua área...</p>;
  }

  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "admin") return <Navigate to="/admin" replace />;

  return <Navigate to={getRoleHome(user.role)} replace />;
}