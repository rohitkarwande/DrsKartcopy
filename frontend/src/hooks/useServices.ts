import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface ServiceRequest {
  id: number;
  user_id: number;
  equipment_type: string | null;
  issue_description: string;
  contact_name: string | null;
  contact_phone: string | null;
  city: string | null;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Rejected';
  assigned_to: number | null;
  created_at: string;
  updated_at: string;
}

export function useMyServiceRequests() {
  return useQuery({
    queryKey: ['services', 'my-requests'],
    queryFn: async () => {
      const res = await api.get('/service-requests/my-requests');
      return res.data as ServiceRequest[];
    },
    staleTime: 1000 * 30,
  });
}

export function useCreateServiceRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      equipment_type: string;
      issue_description: string;
      contact_name: string;
      contact_phone: string;
      city: string;
    }) => {
      const res = await api.post('/service-requests', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services', 'my-requests'] });
    },
  });
}
