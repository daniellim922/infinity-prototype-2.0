import { expect } from "@playwright/test";

async function fillTextField(page, data, placeholder) {
    console.log(`Filling text field with "${placeholder}":`, data);
    const dobInput = page.locator(`input[placeholder="${placeholder}"]`);
    await dobInput.waitFor({ state: "visible" });
    await dobInput.clear();
    await dobInput.fill(data);
    await dobInput.press("Tab");
    console.log(`${placeholder} field filled successfully`);
}

async function fillRadioField(page, data, placeholder) {
    console.log(`Filling ${placeholder}:`, data);
    const genderRadio = page.locator(
        `input[name="${placeholder}"][type="radio"][value="${data}"]`,
    );
    await genderRadio.waitFor({ state: "visible" });
    await genderRadio.check();
    console.log(`${placeholder} field filled successfully`);
}

async function clickOnBtn(name, page) {
    console.log(`Clicking "${name}" button...`);
    const btn = page.getByRole("button", { name });
    await expect(btn).toBeVisible();
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
    await dropdownButton.waitFor({ state: "visible" });
    await dropdownButton.click();

    // Wait for dropdown menu to be visible
    const dropdownMenu = page.locator(`#${dropdownId} .dropdown-menu`);
    await dropdownMenu.waitFor({ state: "visible" });

    // If there's a search input, type the value
    const searchInput = page.locator(
        `#${dropdownId} .dds-dropdown__search-input__input`,
    );
    const searchInputCount = await searchInput.count();
    if (searchInputCount > 0) {
        await searchInput.clear();
        await searchInput.fill(searchValue);
    }

    // Find and click the matching option
    const menuItems = page.locator(`#${dropdownId} .dds-dropdown__menu__item`);
    await menuItems.first().waitFor({ state: "visible" });

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
}

/**
 * Helper function to click hidden radio/checkbox via label
 */
async function clickHiddenInputByLabel(page, inputSelector, labelForId) {
    // Wait for potential overlays to disappear
    const overlay = page.locator(".loading-outer-container");
    if ((await overlay.count()) > 0) {
        try {
            await overlay.waitFor({ state: "hidden" });
        } catch (e) {
            console.log(
                "Overlay did not disappear in 5s, attempting to click anyway...",
            );
        }
    }

    const input = page.locator(inputSelector);
    await input.waitFor({ state: "attached" });
    const label = page.locator(`label[for="${labelForId}"]`);
    await label.waitFor({ state: "visible" });

    // Try clean click first, then force click if intercepted
    try {
        await label.click();
    } catch (e) {
        console.log(
            `Click intercepted for ${labelForId}, trying force click...`,
        );
        await label.click({ force: true });
    }
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
        await checkbox.waitFor({ state: "attached" });
        const isChecked = await checkbox.isChecked();
        if (!isChecked) {
            // Try finding label by 'for' attribute or as a parent wrapper
            const label = page
                .locator(
                    `label[for="${checkboxId}"], label:has(#${checkboxId})`,
                )
                .first();
            await label.waitFor({ state: "visible" });
            await label.click();
            console.log(`Checked: ${fieldName}`);
        }
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
    await radio.waitFor({ state: "attached" });

    // Try finding label by 'for' attribute or as a sibling span (common in this form)
    const label = page
        .locator(
            `label[for="${radioId}"], #${radioId} + span, #${radioId} ~ span`,
        )
        .first();
    await label.waitFor({ state: "visible" });
    await label.click();
    console.log(`Selected ${value} for: ${fieldName}`);
}

/**
 * Extract premium term and sum assured from the selected plan card on the plan selection page.
 * Call before clicking Next (or before replaceNextWithSubmitButton if on same page).
 */
async function extractPlanSelectionData(page) {
    // #region agent log
    const entryState = await page.evaluate(() => {
        const bodyText = document.body?.innerText ?? "";
        return {
            hasViewPlans: bodyText.includes("View plans"),
            hasSelectPlan: bodyText.includes("Select plan"),
            toggleCount: document.querySelectorAll(".toggle-container").length,
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
                location: "utilities.js:extractPlanSelectionData:entry",
                message: "page state at extractPlanSelectionData entry",
                data: entryState,
                timestamp: Date.now(),
                hypothesisId: "H2",
            }),
        },
    ).catch(() => {});
    // #endregion
    // Plan radios use class="hidden"; wait for attached, not visible
    await page
        .locator(".toggle-container input:checked")
        .first()
        .waitFor({ state: "attached" });
    const data = await page.evaluate(() => {
        const selectedContainer = document.querySelector(
            ".toggle-container input:checked",
        );
        if (!selectedContainer)
            return { premiumTerm: null, sumAssured: null, toAge: null };
        const card = selectedContainer
            .closest(".toggle-container")
            ?.querySelector(".card-container");
        if (!card) return { premiumTerm: null, sumAssured: null, toAge: null };

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
            premiumFrequency: getLabelValue("Premium frequency"),
            coverageTerm: getLabelValue("Coverage term"),
            insuredAmount: getLabelValue("Insured amount"),
        };
    });
    return data;
}
async function extractPremiums(page) {
    // Match expanded card: .summary-content has rows with "flex justify-between", label div + amount div (sibling).
    // Fix 2: only click if breakdown not already visible (avoid collapsing on recheck).
    const breakdownRow = page
        .locator('.summary-content div:text-is("AIA Ultimate Critical Cover")')
        .first();
    const breakdownVisible =
        (await breakdownRow.count()) > 0 && (await breakdownRow.isVisible());
    if (!breakdownVisible) {
        console.log("Expanding summary breakdown...");
        const summaryBox = page
            .locator('.summary-content div:text-is("Total to be paid today")')
            .first();
        await summaryBox.click();
        // Fix 1: wait for expanded breakdown (first row) before reading amounts.
        await breakdownRow.waitFor({ state: "visible", timeout: 5000 });
    }

    // Helper: amount is in the next sibling div of the label (reference: xl:min-w-1/2 card with flex justify-between rows).
    async function getAmountByLabel(label) {
        const locator = page
            .locator(`.summary-content div:text-is("${label}") + div`)
            .first();
        if ((await locator.count()) > 0) {
            try {
                await expect(locator).toBeVisible();
                const rawAmount = (await locator.innerText())?.trim() ?? "";
                const sgdMatch = rawAmount.match(/SGD\s*([\d,.]+)/);
                if (sgdMatch) return sgdMatch[1];
                const fallback = rawAmount.match(/[\d,.]+/);
                return fallback ? fallback[0] : null;
            } catch (e) {
                console.log(
                    `Could not extract amount for ${label}: ${e.message}`,
                );
                return null;
            }
        }
        return null;
    }

    // Extract amounts (Fix 3: CPWP (II) is optional — not shown when not selected; null is expected).
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
    return extractedAmounts;
}
/**
 * Hide the red Next button and inject a blue Submit button. On Submit click, sends
 * { planData, premiums } to the API, then resolves. Re-runs whenever the summary
 * DOM changes (MutationObserver) so a newly shown Next button is replaced and payload stays current.
 * Call after navigating to the page with "Total to be paid today" and the Next button.
 * Resolves only after the user clicks Submit and data is sent (browser stays open until then).
 */
async function replaceNextWithSubmitButton(page) {
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
        .waitFor({ state: "visible" });

    const applyReplacement = (payload) => {
        const existing = document.querySelector("[data-injected-submit]");
        if (existing) existing.remove();
        const nextBtn = document.querySelector(
            ".summary-content button[type='submit']",
        );
        if (!nextBtn) return false;
        const planData = payload.planData;
        const premiums = payload.premiums;
        nextBtn.style.display = "none";
        const wrapper = nextBtn.closest(".flex");
        const submitBtn = document.createElement("button");
        submitBtn.type = "button";
        submitBtn.setAttribute("data-injected-submit", "true");
        submitBtn.className = nextBtn.className;
        submitBtn.style.backgroundColor = "#2563eb";
        submitBtn.style.color = "white";
        submitBtn.style.border = "1px solid #2563eb";
        submitBtn.innerHTML =
            '<span class="dds-button__label body-1 body-1__semibold dds-button__label--underline">Submit</span>';
        submitBtn.addEventListener("click", async () => {
            const summary = document.querySelector(".summary-content");
            const allDivs = summary
                ? [...summary.querySelectorAll("div")]
                : [];
            const totalLabel = allDivs.find((d) =>
                d.textContent?.includes("Total to be paid today"),
            );
            if (totalLabel) totalLabel.click();
            await new Promise((r) => setTimeout(r));
            if (typeof window.sendQuoteData === "function") {
                await window.sendQuoteData({ planData, premiums });
            }
        });
        wrapper?.appendChild(submitBtn);
        return true;
    };

    const planData = await extractPlanSelectionData(page);
    const premiums = await extractPremiums(page);
    console.log(planData, premiums);

    const injected = await page.evaluate(applyReplacement, {
        planData,
        premiums,
    });

    if (!injected) {
        throw new Error(
            "Could not inject Submit: Next button not found in .summary-content",
        );
    }

    await page.exposeFunction("__recheckAndReplace", async () => {
        try {
            await page
                .getByRole("button", { name: "Next" })
                .waitFor({ state: "visible", timeout: 10000 });
            const newPlanData = await extractPlanSelectionData(page);
            const newPremiums = await extractPremiums(page);
            await page.evaluate(applyReplacement, {
                planData: newPlanData,
                premiums: newPremiums,
            });
        } catch {
            // Next not present or extract failed; no-op
        }
    });

    await page.evaluate(() => {
        const DEBOUNCE_MS = 400;
        let timeoutId = null;
        const isOurMutation = (nodes) =>
            Array.from(nodes).some(
                (n) =>
                    n.nodeType === 1 &&
                    (n.hasAttribute?.("data-injected-submit") ||
                        n.querySelector?.("[data-injected-submit]")),
            );
        const observer = new MutationObserver((mutationsList) => {
            const causedByUs = mutationsList.some(
                (m) =>
                    isOurMutation(m.addedNodes) || isOurMutation(m.removedNodes),
            );
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                timeoutId = null;
                if (
                    !causedByUs &&
                    typeof window.__recheckAndReplace === "function"
                ) {
                    window.__recheckAndReplace();
                }
            }, DEBOUNCE_MS);
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });

    await submissionPromise;
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
};
