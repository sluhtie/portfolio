/// <reference types="vite/client" />

interface Window {
  umami?: {
    track: (event: string, data?: Record<string, unknown>) => void;
  };
}
