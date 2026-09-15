'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import {  User, Role } from '@/entities/entities.interfaces';
import { api } from '@/api/http.config';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginMutation: ReturnType<typeof useLoginMutation>;
  logout: () => void;
  hasRole: (role: Role) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook interno para la mutación de Login con TanStack Query
function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }: Record<string, string>) => {
      const res = await api.post('/auth/login', { email, password });
      return res.data;
    },
    onSuccess: (data) => {
      // Guardar token en cookies y datos de usuario en localStorage
      Cookies.set('token', data.access_token, { expires: 1 });
      localStorage.setItem('user', JSON.stringify(data.user));

      // Actualizar el caché de TanStack Query inmediatamente
      queryClient.setQueryData(['authUser'], data.user);
    },
  });
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [hasToken, setHasToken] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    setHasToken(!!Cookies.get('token'));
  }, []);

  // Query cacheada a 5 minutos para obtener/mantener la sesión del usuario
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ['authUser'],
    queryFn: () => {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    },
    enabled: hasToken,
    staleTime: 5 * 60 * 1000, // 5 minutos sin re-fetch innecesario
    gcTime: 10 * 60 * 1000,
  });

  const loginMutation = useLoginMutation();

  const logout = () => {
    Cookies.remove('token');
    localStorage.removeItem('user');
    setHasToken(false);
    queryClient.removeQueries({ queryKey: ['authUser'] });
    queryClient.clear();
    router.replace('/login');
  };

  const hasRole = (role: Role): boolean => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        isAuthenticated: !!user,
        loginMutation,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}