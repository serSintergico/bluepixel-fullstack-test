import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/http.config';
import { RequestItem, RequestStatus } from '@/entities/entities.interfaces';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';

// 1. Obtener todas las solicitudes del tenant
export function useGetRequests() {
  return useQuery<RequestItem[]>({
    queryKey: ['requests'],
    queryFn: async () => {
      const res = await api.get('/requests');
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos de caché
  });
}

// 2. Obtener métricas para el Dashboard
export function useGetDashboardStats() {
  return useQuery({
    queryKey: ['requests', 'stats'],
    queryFn: async () => {
      const res = await api.get('/requests/dashboard/stats');
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// 3. Obtener detalle e historial de una solicitud
export function useGetRequestDetail(id: string) {
  return useQuery<RequestItem>({
    queryKey: ['requests', id],
    queryFn: async () => {
      const res = await api.get(`/requests/${id}`);
      return res.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// 4. Mutación para crear una nueva solicitud
export function useCreateRequest() {
  const queryClient = useQueryClient();
  const [idempotencyKey] = useState(() => uuidv4());

  return useMutation({
    mutationFn: async (payload: { title: string; description: string }) => {
      const res = await api.post('/requests', payload, {
        headers: {
          'Idempotency-Key': idempotencyKey,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      // Invalida las queries para re-obtener la lista y las estadísticas
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });
}

// 5. Mutación para cambiar estado (Aprobar, Rechazar, Enviar)
export function useUpdateRequestStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: RequestStatus }) => {
      const res = await api.patch(`/requests/${id}/status`, { status });
      return res.data;
    },
    onSuccess: (_, variables) => {
      // Invalida la lista global y el detalle específico actualizado
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['requests', variables.id] });
    },
  });
}