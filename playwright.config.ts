import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "tests",
    timeout: 7200000, // 2 hour (AIA flow waits for Submit)
    use: {
        headless: false,
        viewport: null,
        launchOptions: {
            args: ["--start-maximized"],
        },
    },
    projects: [{ name: "chromium", use: {} }],
});
