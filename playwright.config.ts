import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:5200',
    reuseExistingServer: true
  },
  use: {
    baseURL: 'http://localhost:5200'
  }
});
