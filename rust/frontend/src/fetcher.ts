import { $backend } from './stores/backendStore';

export const fetcher = (keys: string[], options: RequestInit = {}) => fetch(
  (console.log($backend.get()), `${$backend.get().api_url}${keys.join('')}`),
  options
);
