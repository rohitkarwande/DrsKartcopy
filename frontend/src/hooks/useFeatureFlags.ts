import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface FeatureFlag {
  key: string;
  is_enabled: boolean;
  name: string;
  description: string;
  updated_at: string;
}

export function useFeatureFlags() {
  return useQuery({
    queryKey: ['feature-flags'],
    queryFn: async () => {
      const res = await api.get('/feature-flags');
      return res.data as {
        flags: Record<string, boolean>;
        list: FeatureFlag[];
      };
    },
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useFeatureFlag(key: string, defaultValue = true) {
  const { data, isLoading } = useFeatureFlags();
  if (isLoading || !data?.flags) {
    return { isEnabled: defaultValue, isLoading };
  }
  const isEnabled = data.flags[key] !== undefined ? data.flags[key] : defaultValue;
  return { isEnabled, isLoading: false };
}
