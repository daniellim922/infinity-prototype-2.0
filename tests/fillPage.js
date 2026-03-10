import { expect } from "@playwright/test";

import {
    fillTextField,
    fillRadioField,
    selectFromCustomDropdown,
    clickHiddenInputByLabel,
    handleCheckboxGroup,
    handleRadioButton,
    extractPremiums,
} from "./utilities.js";

/**
 * Fill the "Know You Better" form with provided data
 */
async function fillKnowYouBetterForm(page, formData) {
    // Wait for the form to appear after navigation
    await page.waitForSelector(
        'h3.dds-headline:has-text("Getting to know you better")',
        { timeout: 10000 },
    );
    console.log("Form page loaded successfully");

    console.log('Starting to fill "Know You Better" form...');
    await fillRadioField(page, formData.gender, "gender");
    await fillTextField(page, formData.dateOfBirth, "dd/mm/yyyy");
    await selectFromCustomDropdown(
        page,
        "occupationCode-dropdownButtonId",
        formData.occupation,
        true,
    );
    await selectFromCustomDropdown(
        page,
        "residentStatus-dropdownButtonId",
        formData.residentialStatus,
        true,
    );
    await fillRadioField(page, formData.smokingStatus, "isSmoker");
    // await selectFromCustomDropdown(
    //   page,
    //   "policyTerm-dropdownButtonId",
    //   formData.howLongDoYouwantYourCoverageFor,
    //   true,
    // );
    // await fillTextField(
    //   page,
    //   formData.whatIsYourPreferredInsuredAmount,
    //   "Sum assured",
    // );

    console.log('"Know You Better" form filled successfully');
}

async function fillNricField(page, nricData) {
    console.log("Waiting for NRIC page to load...");

    // Wait for the page heading to appear
    const pageHeading = page.getByText(
        "We need a little more information before proceeding to the application",
        { exact: false },
    );
    await expect(pageHeading).toBeVisible({ timeout: 30000 });
    await page.waitForTimeout(2000);

    fillTextField(page, nricData.nric, "NRIC/FIN");
}

/**
 * Fill payment frequency page formx
 */

async function fillPaymentFrequencyPage(page, formData) {
    console.log("Waiting for payment frequency page to load...");
    const paymentFrequencyHeading = page.getByText(
        "What is your preferred payment frequency?",
        { exact: false },
    );
    await expect(paymentFrequencyHeading).toBeVisible({ timeout: 30000 });
    await page.waitForTimeout(2000);

    // Fill Payment Frequency: Select payment frequency (checkbox/toggle)
    console.log(
        "Selecting payment frequency:",
        formData.preferredPaymentFrequencyPage,
    );
    const paymentFrequencyInput = page.locator(
        `input[type="checkbox"][value="${formData.preferredPaymentFrequencyPage}"]`,
    );
    await paymentFrequencyInput.waitFor({ state: "attached", timeout: 10000 });
    const inputId = await paymentFrequencyInput.getAttribute("id");
    const paymentFrequencyLabel = page.locator(`label[for="${inputId}"]`);
    await paymentFrequencyLabel.waitFor({ state: "visible", timeout: 10000 });
    const isChecked = await paymentFrequencyInput.isChecked();
    if (!isChecked) {
        await paymentFrequencyLabel.click();
    }
    await page.waitForTimeout(500);

    // Select Plan: "AIA Ultimate Critical Cover" (radio button)
    console.log("Selecting plan:", formData.selectPlan);
    await clickHiddenInputByLabel(
        page,
        'input[type="radio"][id="basic-plan1"][name="basic"]',
        "basic-plan1",
    );

    // UCC Enhancer: Select "Yes" (radio button)
    console.log("Selecting UCC Enhancer:", formData.doYouWantToAddUCCEnhancer);
    if (formData.doYouWantToAddUCCEnhancer === "Yes") {
        await clickHiddenInputByLabel(
            page,
            'input[type="radio"][id="CIR-UCCE"][name="CIR"]',
            "CIR-UCCE",
        );
    }

    // Premium Waiver Rider: Select ECPWP or CPWP based on data
    console.log("Selecting premium waiver rider options...");
    const riderOptions = formData.doYouWantToAddPremiumWaiverRider;

    if (riderOptions.ECPWP === "Yes") {
        console.log("Selecting ECPWP (II)");
        await clickHiddenInputByLabel(
            page,
            'input[type="radio"][id="PWR-ECPWP2"][name="PWR"]',
            "PWR-ECPWP2",
        );
    }

    if (riderOptions.CPWP === "Yes") {
        console.log("Selecting CPWP (II)");
        await clickHiddenInputByLabel(
            page,
            'input[type="radio"][id="PWR-CPWP2"][name="PWR"]',
            "PWR-CPWP2",
        );
    }

    console.log("Payment frequency page filled successfully");

    await page.waitForTimeout(1000);

    await extractPremiums(page);
}

/**
 * Fill health page with provided health data
 */
async function fillHealthPage(page, healthData) {
    console.log("Waiting for health page to load...");

    // Wait for the page heading to appear
    const pageHeading = page.getByText(
        "We need a little more information before proceeding to the application",
        { exact: false },
    );
    await expect(pageHeading).toBeVisible({ timeout: 30000 });
    await page.waitForTimeout(2000);

    // Fill Height (cm)
    if (healthData.height) {
        console.log("Filling height:", healthData.height);
        const heightInput = page.locator('input[placeholder="Height (cm)"]');
        await heightInput.waitFor({ state: "visible", timeout: 10000 });
        await heightInput.fill(healthData.height);
        await page.waitForTimeout(300);
    }

    // Fill Weight (kg)
    if (healthData.weight) {
        console.log("Filling weight:", healthData.weight);
        const weightInput = page.locator('input[placeholder="Weight (kg)"]');
        await weightInput.waitFor({ state: "visible", timeout: 10000 });
        await weightInput.fill(healthData.weight);
        await page.waitForTimeout(300);
    }

    // Calculate BMI if both height and weight are filled
    if (healthData.height && healthData.weight) {
        console.log('Clicking "Calculate BMI" button...');
        const calculateBMIButton = page.getByRole("button", {
            name: "Calculate BMI",
        });
        await expect(calculateBMIButton).toBeVisible({ timeout: 10000 });
        await calculateBMIButton.click();
        await page.waitForTimeout(1000); // Wait for calculation
    }

    // Fill Cigarettes per day
    if (healthData.ciggarettes != "0") {
        console.log("Filling cigarettes:", healthData.ciggarettes);
        const cigarettesInput = page.locator(
            'input[placeholder="No. of cigarette sticks per day"]',
        );
        await cigarettesInput.waitFor({ state: "visible", timeout: 10000 });
        await cigarettesInput.fill(healthData.ciggarettes);
        await page.waitForTimeout(300);
    }

    // Fill Cigars per month
    if (healthData.cigars != "0") {
        console.log("Filling cigars:", healthData.cigars);
        const cigarsInput = page.locator(
            'input[placeholder="No. of cigars sticks per month"]',
        );
        await cigarsInput.waitFor({ state: "visible", timeout: 10000 });
        await cigarsInput.fill(healthData.cigars);
        await page.waitForTimeout(300);
    }

    // Alcohol consumption - Radio button
    if (healthData.alcoholConsumption) {
        await handleRadioButton(
            page,
            "Alcohol consumption",
            healthData.alcoholConsumption,
            "consumeDrinks",
        );
    }

    // Treated for alcoholism - Radio button
    if (healthData.treatedForAlcoholism) {
        await handleRadioButton(
            page,
            "Treated for alcoholism",
            healthData.treatedForAlcoholism,
            "hasAlchoholism",
        );
    }

    // Have you ever had - Checkbox group
    if (healthData.haveYouEverHad && healthData.haveYouEverHad[0]) {
        const conditions = healthData.haveYouEverHad[0];
        const conditionMap = {
            diabetesOrRaisedBloodSugar: "illnessDisease0",
            highBloodPressure: "illnessDisease1",
            raisedCholesterol: "illnessDisease2",
            cancer: "illnessDisease3",
            carcinomaInSitu: "illnessDisease4",
            kidneyFailure: "illnessDisease5",
            hepatitis: "illnessDisease6",
            hivAids: "illnessDisease7",
            strokeIncludingTransientIschaemicAttack: "illnessDisease8",
            anyConditionAffectingYourHeart: "illnessDisease9",
            mentalHealthDisorders: "illnessDisease10",
            noneOfTheAbove: "illnessDisease11",
        };

        for (const [key, checkboxId] of Object.entries(conditionMap)) {
            await handleCheckboxGroup(page, key, conditions[key], checkboxId);
        }
    }

    // Last 5 years conditions ongoing - Checkbox group
    if (
        healthData.last5yearsConditionsOngoing &&
        healthData.last5yearsConditionsOngoing[0]
    ) {
        const conditions = healthData.last5yearsConditionsOngoing[0];
        const conditionMap = {
            asthma: "illnessPastOngoing0",
            thyroidDisorder: "illnessPastOngoing1",
            spinalDisorders: "illnessPastOngoing2",
            cystLumpGrowthOrAbnormalSwelling: "illnessPastOngoing3",
            blackoutsOrSyncope: "illnessPastOngoing4",
            noneOfTheAbove: "illnessPastOngoing5",
        };

        for (const [key, checkboxId] of Object.entries(conditionMap)) {
            await handleCheckboxGroup(page, key, conditions[key], checkboxId);
        }
    }

    // Last 5 years conditions required - Radio button
    if (healthData.last5yearsConditionsRequired) {
        await handleRadioButton(
            page,
            "Last 5 years conditions required",
            healthData.last5yearsConditionsRequired,
            "illnessMedical",
        );
    }

    // Last 5 years hospitalization - Checkbox group
    if (
        healthData.last5yearsHospitalization &&
        healthData.last5yearsHospitalization[0]
    ) {
        const conditions = healthData.last5yearsHospitalization[0];
        const conditionMap = {
            blindness: "illnessPhysicalDisability0",
            deafness: "illnessPhysicalDisability1",
            paralysis: "illnessPhysicalDisability2",
            others: "illnessPhysicalDisability3",
            noneOfTheAbove: "illnessPhysicalDisability4",
        };

        for (const [key, checkboxId] of Object.entries(conditionMap)) {
            await handleCheckboxGroup(page, key, conditions[key], checkboxId);
        }
    }

    // Are you currently - Radio button
    if (healthData.areYouCurrently) {
        await handleRadioButton(
            page,
            "Are you currently",
            healthData.areYouCurrently,
            "illnessCurrently",
        );
    }

    // Had biopsy or abnormal - Radio button
    if (healthData.hadBiopsyOrAbnormal) {
        await handleRadioButton(
            page,
            "Had biopsy or abnormal",
            healthData.hadBiopsyOrAbnormal,
            "illnessAbnormal",
        );
    }

    // Parents/bro/sis condition - Radio button
    if (healthData.parentsBroSisCondition) {
        await handleRadioButton(
            page,
            "Parents/bro/sis condition",
            healthData.parentsBroSisCondition,
            "illnessFamily",
        );
    }

    // Exciting sport - Checkbox group (Note: The data shows "excitingSport" but HTML has multiple checkboxes)
    // Since the data shows "excitingSport":"No", we'll skip all sport checkboxes
    // If needed in future, we can add mapping for individual sports

    // Reside in another country - Radio button
    if (healthData.resideInAnotherCountry) {
        await handleRadioButton(
            page,
            "Reside in another country",
            healthData.resideInAnotherCountry,
            "planTravel",
        );
    }

    // Declined/postponed/accepted - Radio button
    if (healthData.declinedPostponedAccepted) {
        await handleRadioButton(
            page,
            "Declined/postponed/accepted",
            healthData.declinedPostponedAccepted,
            "isDeclinedByInsurer",
        );
    }

    // Confirmation checkbox
    if (healthData.confirmation === "Yes") {
        const confirmCheckbox = page.locator("#confirmTrue0");
        await confirmCheckbox.waitFor({ state: "attached", timeout: 10000 });
        const isChecked = await confirmCheckbox.isChecked();
        if (!isChecked) {
            // Use label:has() selector for robust finding of wrapper labels
            const label = page
                .locator(`label[for="confirmTrue0"], label:has(#confirmTrue0)`)
                .first();
            await label.waitFor({ state: "visible", timeout: 10000 });
            await label.click();
            console.log("Checked confirmation checkbox");
        }
        await page.waitForTimeout(300);
    }

    console.log("Health page filled successfully");
}

export {
    fillKnowYouBetterForm,
    fillPaymentFrequencyPage,
    fillHealthPage,
    fillNricField,
};
