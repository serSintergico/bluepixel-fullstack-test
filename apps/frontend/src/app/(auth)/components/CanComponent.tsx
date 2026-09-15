'use client';

import { useAuth } from "../context/AuthContext";
import { Role } from "@/entities/entities.interfaces";

interface CanProps {
  role: Role;
  children: React.ReactNode;
}

export function Can({ role, children }: CanProps) {
  const { hasRole } = useAuth();

  if (!hasRole(role)) {
    return null; // Si no tiene el rol, no renderiza el componente en la UI
  }

  return <>{children}</>;
}