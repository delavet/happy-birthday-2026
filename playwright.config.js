import { defineConfig, devices } from "@playwright/test";

const publishedURL = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: "./tests",
  testMatch: "*.spec.js",
  timeout: 90000,
  reporter: "list",
  workers: 2,
  use: {
    baseURL: publishedURL || "http://127.0.0.1:4173/output/site/",
    trace: "retain-on-failure",
    reducedMotion: "reduce",
  },
  webServer: publishedURL ? undefined : {
    command: "python3 -m http.server 4173 --bind 127.0.0.1",
    url: "http://127.0.0.1:4173/output/site/",
    reuseExistingServer: true,
  },
  projects: [
    {
      name: "desktop-chromium",
      grep: /desktop (complete birthday|keyboard choices|animated actors)/,
      use: { browserName: "chromium", channel: "chrome", viewport: { width: 1440, height: 900 } },
    },
    {
      name: "desktop-webkit",
      grep: /desktop (complete birthday|keyboard choices|animated actors)/,
      use: { browserName: "webkit", viewport: { width: 1280, height: 720 } },
    },
    {
      name: "mobile-smoke",
      grep: /mobile smoke:/,
      use: { ...devices["Pixel 7"], channel: "chrome" },
    },
  ],
});
