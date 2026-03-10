import { test } from "@playwright/test";
import { profilesTest } from "../data/profilesTest.js";

import { fillKnowYouBetterForm } from "./fillPage.js";

import { clickOnBtn } from "./utilities.js";

const testData = process.env.TEST_DATA
    ? JSON.parse(process.env.TEST_DATA)
    : profilesTest;
const profilesToRun = Array.isArray(testData) ? testData : [testData];

for (const profile of profilesToRun) {
    console.log("profile", profile);
    const { knowYouBetterFormData, profileName } = profile;

    test(`fill AIA form for ${profileName}`, async ({ page }) => {
        test.setTimeout(120000);

        console.log("Navigating to AIA insurance page...");
        await page.goto("https://insure.aia.com.sg/aianow3/ucc?f=26068&i=agy");
        await page.waitForLoadState("networkidle");
        await page.screenshot({
            path: `tests/screenshots/${profileName}/1-landing-page.png`,
            fullPage: true,
        });
        await clickOnBtn("Get a quote now", page);

        await fillKnowYouBetterForm(page, knowYouBetterFormData);
        await page.screenshot({
            path: `tests/screenshots/${profileName}/2-know-you-better-form-filled.png`,
            fullPage: true,
        });

        console.log("Test completed successfully!");

        // Keep browser open - wait 1 hour so user can interact with the filled form
        await new Promise((r) => setTimeout(r, 3600000));
    });
}
