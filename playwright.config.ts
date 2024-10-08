// playwright.config.ts
import { PlaywrightTestConfig } from "@playwright/test";
require("dotenv").config();

const config: PlaywrightTestConfig = {
  testDir: "./tests",
  timeout: 50000,
  expect: {
    timeout: 10000,
  },
  retries: 0,
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
    {
      name: "firefox",
      use: { browserName: "firefox" },
    },
  ],
};

export default config;
