import { atom } from 'nanostores';

type Backend = {
  lang: 'NODEJS' | 'RUST',
  api_url: string
}

export const $backend = atom<Backend>({
  lang: 'RUST',
  api_url: import.meta.env.PUBLIC_RUST_BACKEND
});
