import {
    fillTextField,
    fillRadioField,
    selectFromCustomDropdown,
} from "./utilities.js";

/**
 * Fill the "Know You Better" form with provided data
 */
async function fillKnowYouBetterForm(page, formData) {
    // Wait for the form to appear after navigation
    await page.waitForSelector(
        'h3.dds-headline:has-text("Getting to know you better")',
        { timeout: 600000 },
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

    console.log('"Know You Better" form filled successfully');
}

export { fillKnowYouBetterForm };
