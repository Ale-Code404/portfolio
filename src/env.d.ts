/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly TEMPLATED_API_URL: string;
  readonly TEMPLATED_API_KEY: string;
  readonly WORK_STARTS_YEAR: int;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
