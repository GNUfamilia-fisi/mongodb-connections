/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_NODEJS_BACKEND: string;
  readonly PUBLIC_RUST_BACKEND: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
