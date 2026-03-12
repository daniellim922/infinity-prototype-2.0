export const INTEGRATION_INSURERS = ["singlife", "fwd", "aia"] as const;

export const PREMIUM_FREQUENCY_OPTIONS = [
    "Monthly",
    "Quarterly",
    "Semi-Annual",
    "Annual",
    "Single Premium",
] as const;

export const FOR_WHOM_OPTIONS = [
    "Yourself",
    "Spouse",
    "Joint",
    "Child",
    "Parent",
] as const;

export const SETTLEMENT_MODE_OPTIONS = [
    "Cheque/CC/Bank Transfer",
    "SRS",
    "CPF OA",
    "CPF SA",
    "CPF MA",
] as const;
