import { expect } from "@playwright/test";

async function fillTextField(page, data, placeholder) {
    console.log(`Filling text field with "${placeholder}":`, data);
    const dobInput = page.locator(`input[placeholder="${placeholder}"]`);
    await dobInput.waitFor({ state: "visible", timeout: 5000 });
    await dobInput.clear();
    await dobInput.fill(data);
    await dobInput.press("Tab");
    await page.waitForTimeout(500);
    console.log(`${placeholder} field filled successfully`);
}

async function fillRadioField(page, data, placeholder) {
    console.log(`Filling ${placeholder}:`, data);
    const genderRadio = page.locator(
        `input[name="${placeholder}"][type="radio"][value="${data}"]`,
    );
    await genderRadio.waitFor({ state: "visible", timeout: 5000 });
    await genderRadio.check();
    await page.waitForTimeout(500);
    console.log(`${placeholder} field filled successfully`);
}

async function clickOnBtn(name, page) {
    console.log(`Clicking "${name}" button...`);
    const btn = page.getByRole("button", { name });
    await expect(btn).toBeVisible({ timeout: 10000 });
    await expect(btn).toBeEnabled();
    await btn.click();
    console.log(`"${name}" button clicked, waiting for next page to load...`);
}

async function selectFromCustomDropdown(
    page,
    dropdownButtonId,
    searchValue,
    exactMatch = true,
) {
    console.log(`Filling ${searchValue}:`, searchValue);

    const dropdownId = dropdownButtonId.replace("-dropdownButtonId", "");

    // Click the dropdown button to open it
    const dropdownButton = page.locator(`#${dropdownButtonId}`);
    await dropdownButton.waitFor({ state: "visible", timeout: 5000 });
    await dropdownButton.click();
    await page.waitForTimeout(500); // Wait for dropdown to open

    // Wait for dropdown menu to be visible
    const dropdownMenu = page.locator(`#${dropdownId} .dropdown-menu`);
    await dropdownMenu.waitFor({ state: "visible", timeout: 5000 });

    // If there's a search input, type the value
    const searchInput = page.locator(
        `#${dropdownId} .dds-dropdown__search-input__input`,
    );
    const searchInputCount = await searchInput.count();
    if (searchInputCount > 0) {
        await searchInput.clear();
        await searchInput.fill(searchValue);
        await page.waitForTimeout(500); // Wait for filtering
    }

    // Find and click the matching option
    const menuItems = page.locator(`#${dropdownId} .dds-dropdown__menu__item`);
    await menuItems.first().waitFor({ state: "visible", timeout: 5000 });

    if (exactMatch) {
        // For exact match, find the option with exact text
        const option = menuItems.filter({
            hasText: new RegExp(`^${searchValue}$`, "i"),
        });
        await option.first().click();
    } else {
        // For partial match, find option containing the text
        const option = menuItems.filter({
            hasText: new RegExp(searchValue, "i"),
        });
        await option.first().click();
    }

    await page.waitForTimeout(500); // Wait for selection
}

/**
 * Helper function to click hidden radio/checkbox via label
 */
async function clickHiddenInputByLabel(page, inputSelector, labelForId) {
    // Wait for potential overlays to disappear
    const overlay = page.locator(".loading-outer-container");
    if ((await overlay.count()) > 0) {
        try {
            await overlay.waitFor({ state: "hidden", timeout: 5000 });
        } catch (e) {
            console.log(
                "Overlay did not disappear in 5s, attempting to click anyway...",
            );
        }
    }

    const input = page.locator(inputSelector);
    await input.waitFor({ state: "attached", timeout: 10000 });
    const label = page.locator(`label[for="${labelForId}"]`);
    await label.waitFor({ state: "visible", timeout: 10000 });

    // Try clean click first, then force click if intercepted
    try {
        await label.click({ timeout: 5000 });
    } catch (e) {
        console.log(
            `Click intercepted for ${labelForId}, trying force click...`,
        );
        await label.click({ force: true });
    }
    await page.waitForTimeout(500);
}

/**
 * Helper function to handle checkbox groups - checks if value is "Yes", skips if null
 */
async function handleCheckboxGroup(page, fieldName, value, checkboxId) {
    if (value === null || value === undefined) {
        return; // Skip null values
    }

    if (value === "Yes") {
        const checkbox = page.locator(`#${checkboxId}`);
        await checkbox.waitFor({ state: "attached", timeout: 10000 });
        const isChecked = await checkbox.isChecked();
        if (!isChecked) {
            // Try finding label by 'for' attribute or as a parent wrapper
            const label = page
                .locator(
                    `label[for="${checkboxId}"], label:has(#${checkboxId})`,
                )
                .first();
            await label.waitFor({ state: "visible", timeout: 10000 });
            await label.click();
            console.log(`Checked: ${fieldName}`);
        }
        await page.waitForTimeout(300);
    }
    // If value is "No", we don't check it (leave unchecked)
}

/**
 * Helper function to handle radio buttons - selects Yes or No
 */
async function handleRadioButton(page, fieldName, value, radioName) {
    if (value === null || value === undefined) {
        return; // Skip null values
    }

    const radioValue = value === "Yes" ? "y" : "n";
    const radioId = value === "Yes" ? `${radioName}0` : `${radioName}1`;

    const radio = page.locator(
        `input[type="radio"][name="${radioName}"][value="${radioValue}"]`,
    );
    await radio.waitFor({ state: "attached", timeout: 10000 });

    // Try finding label by 'for' attribute or as a sibling span (common in this form)
    const label = page
        .locator(
            `label[for="${radioId}"], #${radioId} + span, #${radioId} ~ span`,
        )
        .first();
    await label.waitFor({ state: "visible", timeout: 10000 });
    await label.click();
    console.log(`Selected ${value} for: ${fieldName}`);
    await page.waitForTimeout(300);
}

/**
 * Extract premium term and sum assured from the selected plan card on the plan selection page.
 * Call before clicking Next (or before replaceNextWithSubmitButton if on same page).
 */
async function extractPlanSelectionData(page) {
    // Plan radios use class="hidden"; wait for attached, not visible
    await page
        .locator(".toggle-container input:checked")
        .first()
        .waitFor({ state: "attached", timeout: 15000 });
    const data = await page.evaluate(() => {
        const selectedContainer = document.querySelector(
            ".toggle-container input:checked",
        );
        if (!selectedContainer) return { premiumTerm: null, sumAssured: null };
        const card = selectedContainer.closest(".toggle-container")?.querySelector(".card-container");
        if (!card) return { premiumTerm: null, sumAssured: null };

        const getLabelValue = (labelText) => {
            const divs = [...card.querySelectorAll(".pb-4")];
            for (const div of divs) {
                const label = div.querySelector(".font-normal");
                if (label?.textContent?.includes(labelText)) {
                    const value = div.querySelector(".font-semibold");
                    return value?.textContent?.trim() ?? null;
                }
            }
            return null;
        };

        return {
            premiumTerm: getLabelValue("Premium term"),
            sumAssured: getLabelValue("Insured amount"),
        };
    });
    return data;
}

/**
 * Hide the red Next button and inject a blue Submit button. On Submit click, extracts
 * premiums, sends { premiumTerm, sumAssured, premiums } to the API, then resolves.
 * Call after navigating to the page with "Total to be paid today" and the Next button.
 * Resolves only after the user clicks Submit and data is sent (browser stays open until then).
 */
async function replaceNextWithSubmitButton(page, { premiumTerm, sumAssured }) {
    const apiUrl =
        process.env.APP_URL ||
        process.env.NEXT_PUBLIC_APP_URL ||
        (process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : "http://localhost:3000");

    let resolveSubmission;
    const submissionPromise = new Promise((resolve) => {
        resolveSubmission = resolve;
    });

    await page.exposeFunction("sendQuoteData", async (data) => {
        try {
            await fetch(`${apiUrl}/api/aia-quote-result`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
        } finally {
            resolveSubmission?.();
        }
    });

    await page
        .getByRole("button", { name: "Next" })
        .waitFor({ state: "visible", timeout: 10000 });

    const injected = await page.evaluate(
        ({ premiumTerm: pt, sumAssured: sa }) => {
            const nextBtn = document.querySelector(
                ".summary-content button[type='submit']",
            );
            if (!nextBtn) return false;
            nextBtn.style.display = "none";
            const wrapper = nextBtn.closest(".flex");
            const submitBtn = document.createElement("button");
            submitBtn.type = "button";
            submitBtn.className = nextBtn.className;
            submitBtn.style.backgroundColor = "#2563eb";
            submitBtn.style.color = "white";
            submitBtn.style.border = "1px solid #2563eb";
            submitBtn.innerHTML =
                '<span class="dds-button__label body-1 body-1__semibold dds-button__label--underline">Submit</span>';
            submitBtn.addEventListener("click", async () => {
                const summary = document.querySelector(".summary-content");
                const allDivs = summary ? [...summary.querySelectorAll("div")] : [];
                const totalLabel = allDivs.find((d) =>
                    d.textContent?.includes("Total to be paid today"),
                );
                if (totalLabel) totalLabel.click();

                await new Promise((r) => setTimeout(r, 1000));

                const getAmount = (label) => {
                    const s = document.querySelector(".summary-content");
                    if (!s) return null;
                    const divs = [...s.querySelectorAll("div")];
                    for (const d of divs) {
                        const txt = d.textContent?.trim();
                        if (txt === label || (txt && txt.startsWith(label))) {
                            const next = d.nextElementSibling;
                            const target = next || d.parentElement?.children[d.parentElement?.children?.indexOf(d) + 1];
                            if (target) {
                                const m = target.textContent?.match(/[0-9,.]+/);
                                return m ? m[0] : null;
                            }
                        }
                    }
                    return null;
                };

                const premiums = {
                    totalAmount: getAmount("Total to be paid today"),
                    basicPlanAmount: getAmount("AIA Ultimate Critical Cover"),
                    uccEnhancerAmount: getAmount("UCC Enhancer"),
                    ecpwpAmount: getAmount("ECPWP (II)"),
                    cpwpAmount: getAmount("CPWP (II)"),
                };

                if (typeof window.sendQuoteData === "function") {
                    await window.sendQuoteData({
                        premiumTerm: pt,
                        sumAssured: sa,
                        premiums,
                    });
                }
            });
            wrapper?.appendChild(submitBtn);
            return true;
        },
        { premiumTerm, sumAssured },
    );

    if (!injected) {
        throw new Error(
            "Could not inject Submit: Next button not found in .summary-content",
        );
    }

    // Block until user clicks Submit and sendQuoteData resolves
    await submissionPromise;
}

async function extractPremiums(page) {
    // Expand summary to see breakdown if it's a dropdown
    console.log("Expanding summary breakdown...");
    const summaryBox = page
        .locator('div:text-is("Total to be paid today")')
        .first();
    await summaryBox.click();
    await page.waitForTimeout(1000); // Wait for the breakdown to render

    // Helper to extract amount by label
    async function getAmountByLabel(label) {
        const locator = page
            .locator(`.summary-content div:text-is("${label}") + div`)
            .first();
        if ((await locator.count()) > 0) {
            try {
                await expect(locator).toBeVisible({ timeout: 5000 });
                const rawAmount = await locator.innerText();
                const amountMatch = rawAmount.match(/[0-9,.]+/);
                return amountMatch ? amountMatch[0] : null;
            } catch (e) {
                console.log(
                    `Could not extract amount for ${label}: ${e.message}`,
                );
                return null;
            }
        }
        return null;
    }

    // Extract amounts
    console.log("Extracting amounts from summary...");
    const totalAmount = await getAmountByLabel("Total to be paid today");
    const basicPlanAmount = await getAmountByLabel(
        "AIA Ultimate Critical Cover",
    );
    const uccEnhancerAmount = await getAmountByLabel("UCC Enhancer");
    const ecpwpAmount = await getAmountByLabel("ECPWP (II)");
    const cpwpAmount = await getAmountByLabel("CPWP (II)");

    const extractedAmounts = {
        totalAmount,
        basicPlanAmount,
        uccEnhancerAmount,
        ecpwpAmount,
        cpwpAmount,
    };

    // Emit structured result for API to parse from stdout (no file)
    console.log("__QUOTE_RESULTS__" + JSON.stringify(extractedAmounts));
}

export {
    fillTextField,
    fillRadioField,
    clickOnBtn,
    selectFromCustomDropdown,
    clickHiddenInputByLabel,
    handleCheckboxGroup,
    handleRadioButton,
    extractPlanSelectionData,
    replaceNextWithSubmitButton,
    extractPremiums,
};
