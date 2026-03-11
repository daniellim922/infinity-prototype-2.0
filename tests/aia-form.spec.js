import { test } from "@playwright/test";
import { profilesTest } from "../data/profilesTest.js";

import { fillKnowYouBetterForm } from "./fillPage.js";

import {
    clickOnBtn,
    extractPlanSelectionData,
    replaceNextWithSubmitButton,
} from "./utilities.js";

const testData = process.env.TEST_DATA
    ? JSON.parse(process.env.TEST_DATA)
    : profilesTest;
const profilesToRun = Array.isArray(testData) ? testData : [testData];

for (const profile of profilesToRun) {
    console.log("profile", profile);
    const { knowYouBetterFormData, profileName } = profile;

    test(`fill AIA form for ${profileName}`, async ({ page }) => {
        test.setTimeout(7200000); // 2 hour — wait for user to click Submit

        console.log("Navigating to AIA insurance page...");
        await page.goto("https://insure.aia.com.sg/aianow3/ucc?f=26068&i=agy");
        await page.waitForLoadState("networkidle");
        await page.screenshot({
            path: `tests/screenshots/${profileName}/1-landing-page.png`,
            fullPage: true,
        });
        await clickOnBtn("Get a quote now", page);

        await fillKnowYouBetterForm(page, knowYouBetterFormData);
        const url = page.url();
        const pageState = await page.evaluate(() => {
            const bodyText = document.body?.innerText ?? "";
            return {
                hasViewPlans: bodyText.includes("View plans"),
                hasSelectPlan: bodyText.includes("Select plan"),
                toggleCount:
                    document.querySelectorAll(".toggle-container").length,
                checkedCount: document.querySelectorAll(
                    ".toggle-container input:checked",
                ).length,
            };
        });
        await fetch(
            "http://127.0.0.1:7432/ingest/971ecca8-b484-49e5-9a94-f19734477e24",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Debug-Session-Id": "c583a8",
                },
                body: JSON.stringify({
                    sessionId: "c583a8",
                    location: "aia-form.spec.js:before-extract",
                    message: "page state before extractPlanSelectionData",
                    data: { url, ...pageState },
                    timestamp: Date.now(),
                    hypothesisId: "H1",
                }),
            },
        ).catch(() => {});

        await replaceNextWithSubmitButton(page);
        console.log("Test completed successfully! Browser will close.");
    });
}
