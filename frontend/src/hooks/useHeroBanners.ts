import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface HeroBanner {
  id: number;
  title: string;
  subtitle: string;
  badge_text: string;
  image_url: string;
  link_url: string;
  button_text: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

/**
 * Fetch active banners for homepage carousel
 */
export function useActiveHeroBanners() {
  return useQuery({
    queryKey: ['banners', 'active'],
    queryFn: async () => {
      const res = await api.get('/banners');
      return (res.data?.banners || []) as HeroBanner[];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
