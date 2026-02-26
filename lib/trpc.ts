import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import SuperJSON from 'superjson';
import type { AppRouter } from '../types/router';

export const trpc = createTRPCReact<AppRouter>();

export function getTRPCClient() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://ewf-emergency-call-backend-production.up.railway.app';
  
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: `${API_BASE_URL}/api/trpc`,
        transformer: SuperJSON,
        headers() {
          const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
          return token ? { Authorization: `Bearer ${token}` } : {};
        },
      }),
    ],
  });
}
