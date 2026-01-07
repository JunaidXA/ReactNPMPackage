interface ViteTypeOptions {
  // strictImportMetaEnv: unknown
}

type ImportMetaEnvFallbackKey = "strictImportMetaEnv" extends keyof ViteTypeOptions ? never : string;

interface ImportMetaEnv {
  [key: ImportMetaEnvFallbackKey]: any;
  BASE_URL: string;
  MODE: string;
  DEV: boolean;
  PROD: boolean;
  SSR: boolean;
}

interface ImportMeta {
  url: string;

  readonly hot?: import("./hot").ViteHotContext;

  readonly env: ImportMetaEnv;

  glob: import("./importGlob").ImportGlobFunction;
}
