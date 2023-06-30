import { useStore } from "@nanostores/react";
import { $backend } from "../stores/backendStore";

export function BackendLogo() {
  const backend = useStore($backend);

  const toggleBackend = () => {
    if (backend.lang === 'RUST') {
      $backend.set({
        lang: 'NODEJS',
        api_url: import.meta.env.PUBLIC_NODEJS_BACKEND
      });
    } else {
      $backend.set({
        lang: 'RUST',
        api_url: import.meta.env.PUBLIC_RUST_BACKEND,
      });
    }
  }

  return (
    <section onClick={toggleBackend} style={{
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      userSelect: 'none'
    }}>
      {
        backend.lang === 'RUST' ? (
          <>
            <h4>Backend:</h4>
            <img height={30} style={{marginLeft: 5, aspectRatio: 4/3 }} src='/rust_logo.png' />
          </>
        ) : (
          <>
            <h4>Backend:</h4>
            <img height={30} style={{marginLeft: 10, aspectRatio: 0.9 }} src='/nodejs_logo.png' />
          </>
        )
      }
    </section>
  );
}
