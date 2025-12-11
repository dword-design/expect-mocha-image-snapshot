import { defineConfig } from '@playwright/test';

export default defineConfig({
  preserveOutput: 'failures-only',
  fullyParallel: true,
});
