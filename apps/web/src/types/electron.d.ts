export {};

declare global {
  interface Window {
    electron?: {
      platform: string;
      versions: Record<string, string>;
      openExternal: (url: string) => Promise<void>;
      window: {
        minimize: () => Promise<void>;
        maximize: () => Promise<void>;
        close: () => Promise<void>;
      };
    };
  }
}

