"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { RocketIcon } from "lucide-react";
import {
    INTEGRATION_INSURERS,
    PREMIUM_FREQUENCY_OPTIONS,
    FOR_WHOM_OPTIONS,
    SETTLEMENT_MODE_OPTIONS,
} from "./constants";
import type { AiaQuoteResultPayload } from "./popup-redirection-modal";

interface InsuranceAdviceSheetProps {
    premiumFrequency: string | null;
    setPremiumFrequency: (v: string | null) => void;
    forWhom: string | null;
    setForWhom: (v: string | null) => void;
    settlementMode: string | null;
    setSettlementMode: (v: string | null) => void;
    insurer: string | null;
    integrationModeOn: boolean;
    onInsurerChange: (v: string) => void;
    onIntegrationSwitchChange: (checked: boolean) => void;
    onCreateQuotation: () => void;
    syncedQuoteData?: AiaQuoteResultPayload | null;
    onSaveAdvice?: () => void;
    notes?: string;
    onNotesChange?: (value: string) => void;
}

export function InsuranceAdviceSheet({
    premiumFrequency,
    setPremiumFrequency,
    forWhom,
    setForWhom,
    settlementMode,
    setSettlementMode,
    insurer,
    integrationModeOn,
    onInsurerChange,
    onIntegrationSwitchChange,
    onCreateQuotation,
    syncedQuoteData,
    onSaveAdvice,
    notes = "",
    onNotesChange,
}: InsuranceAdviceSheetProps) {
    const showIntegrationSwitch =
        insurer !== null &&
        INTEGRATION_INSURERS.includes(
            insurer as (typeof INTEGRATION_INSURERS)[number],
        );

    return (
        <>
            <div className="flex flex-1 min-h-0 flex-col">
                <div className="flex-1 overflow-y-auto min-h-0">
                    <SheetHeader>
                        <SheetTitle className="text-xl">
                            For insurance Advice
                        </SheetTitle>
                    </SheetHeader>
                    <FieldGroup className="gap-4 p-4">
                        <Field orientation="horizontal">
                            <Checkbox
                                id="ip-rider"
                                name="ip-rider"
                                className="size-5 border-[3px]"
                                disabled={integrationModeOn}
                            />
                            <FieldLabel
                                htmlFor="ip-rider"
                                className="font-normal text-lg">
                                Recommend IP Rider only
                            </FieldLabel>
                        </Field>
                        <div className="grid grid-cols-2 gap-4 items-end">
                            <Field>
                                <FieldLabel htmlFor="insurer">
                                    Insurer
                                </FieldLabel>
                                <Select
                                    value={insurer ?? undefined}
                                    onValueChange={onInsurerChange}
                                    disabled={integrationModeOn}>
                                    <SelectTrigger
                                        id="insurer"
                                        className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="hsbc-life">
                                            HSBC Life
                                        </SelectItem>
                                        <SelectItem value="singlife">
                                            Singlife
                                        </SelectItem>
                                        <SelectItem value="fwd">FWD</SelectItem>
                                        <SelectItem value="aia">AIA</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                            {showIntegrationSwitch ? (
                                <Field className="flex flex-col justify-end">
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            size="lg"
                                            thumbIcon={<RocketIcon />}
                                            checked={integrationModeOn}
                                            onCheckedChange={
                                                onIntegrationSwitchChange
                                            }
                                            className={
                                                integrationModeOn
                                                    ? "data-[state=checked]:bg-blue-500!"
                                                    : ""
                                            }
                                        />
                                        <span
                                            className={
                                                integrationModeOn
                                                    ? "text-blue-500"
                                                    : ""
                                            }>
                                            Integration mode available
                                        </span>
                                    </div>
                                </Field>
                            ) : (
                                <Field>
                                    <FieldLabel htmlFor="plan">
                                        Plan Recommended
                                    </FieldLabel>
                                    <Select
                                        value={
                                            syncedQuoteData
                                                ? "ultimate-critical-cover"
                                                : undefined
                                        }
                                        disabled={integrationModeOn}>
                                        <SelectTrigger
                                            id="plan"
                                            className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ultimate-critical-cover">
                                                Ultimate Critical Cover
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>
                            )}
                        </div>
                        {showIntegrationSwitch && (
                            <div className="grid grid-cols-2 gap-4 items-end">
                                <Field>
                                    <FieldLabel htmlFor="plan">
                                        Plan Recommended
                                    </FieldLabel>
                                    <Select
                                        value={
                                            syncedQuoteData
                                                ? "ultimate-critical-cover"
                                                : undefined
                                        }
                                        disabled={integrationModeOn}>
                                        <SelectTrigger
                                            id="plan"
                                            className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ultimate-critical-cover">
                                                Ultimate Critical Cover
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="sum-assured">
                                    Sum Assured
                                </FieldLabel>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="sum-assured"
                                        type="text"
                                        className="flex-1"
                                        disabled={integrationModeOn}
                                        value={
                                            syncedQuoteData?.planData
                                                ?.insuredAmount ?? ""
                                        }
                                        readOnly
                                    />
                                    <Checkbox
                                        aria-label="Sum Assured option"
                                        className="size-5 border-[3px]"
                                        disabled={integrationModeOn}
                                    />
                                    <span>N.A.</span>
                                </div>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="policy-term">
                                    Policy Term
                                </FieldLabel>
                                <Input
                                    id="policy-term"
                                    type="text"
                                    disabled={integrationModeOn}
                                    value={
                                        syncedQuoteData?.planData
                                            ?.coverageTerm ?? ""
                                    }
                                    readOnly
                                />
                            </Field>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="premium-term">
                                    Premium Term
                                </FieldLabel>
                                <Input
                                    id="premium-term"
                                    type="text"
                                    disabled={integrationModeOn}
                                    value={
                                        syncedQuoteData?.planData
                                            ?.premiumTerm ?? ""
                                    }
                                    readOnly
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="min-investment">
                                    Minimum Investment Period (For ILP)
                                </FieldLabel>
                                <Input
                                    id="min-investment"
                                    type="number"
                                    disabled={integrationModeOn}
                                />
                            </Field>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="currency">
                                    Currency
                                </FieldLabel>
                                <Select
                                    value="sgd"
                                    disabled={integrationModeOn}>
                                    <SelectTrigger
                                        id="currency"
                                        className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sgd">SGD</SelectItem>
                                        <SelectItem value="usd">USD</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="premium-amount">
                                    Premium Amount
                                </FieldLabel>
                                <Input
                                    id="premium-amount"
                                    type="text"
                                    disabled={integrationModeOn}
                                    value={
                                        syncedQuoteData?.premiums
                                            ?.totalAmount ??
                                        syncedQuoteData?.premiums
                                            ?.basicPlanAmount ??
                                        ""
                                    }
                                    readOnly
                                />
                            </Field>
                        </div>

                        <div className="flex flex-col gap-2 items-center">
                            <p className="text-sm font-medium self-start">
                                Additional add-on rider
                            </p>
                            <Button
                                className="rounded-full px-12 bg-blue-600 text-white hover:bg-blue-500"
                                disabled={integrationModeOn}>
                                + Additional add-on rider
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <Field>
                                <FieldLabel className="mb-2 block">
                                    Premium Frequency
                                </FieldLabel>
                                <div className="flex flex-col gap-3">
                                    {PREMIUM_FREQUENCY_OPTIONS.map((opt) => (
                                        <Field
                                            key={opt}
                                            orientation="horizontal">
                                            <Checkbox
                                                id={`freq-${opt.toLowerCase().replace(/\s+/g, "-")}`}
                                                name="premium-frequency"
                                                className="size-5 border-[3px]"
                                                checked={
                                                    premiumFrequency === opt
                                                }
                                                onCheckedChange={() =>
                                                    setPremiumFrequency(
                                                        premiumFrequency === opt
                                                            ? null
                                                            : opt,
                                                    )
                                                }
                                                disabled={integrationModeOn}
                                            />
                                            <FieldLabel
                                                htmlFor={`freq-${opt.toLowerCase().replace(/\s+/g, "-")}`}
                                                className="font-normal">
                                                {opt}
                                            </FieldLabel>
                                        </Field>
                                    ))}
                                </div>
                            </Field>
                            <Field>
                                <FieldLabel className="mb-2 block">
                                    For Whom
                                </FieldLabel>
                                <div className="flex flex-col gap-3">
                                    {FOR_WHOM_OPTIONS.map((opt) => (
                                        <Field
                                            key={opt}
                                            orientation="horizontal">
                                            <Checkbox
                                                id={`whom-${opt.toLowerCase()}`}
                                                name="for-whom"
                                                className="size-5 border-[3px]"
                                                checked={forWhom === opt}
                                                onCheckedChange={() =>
                                                    setForWhom(
                                                        forWhom === opt
                                                            ? null
                                                            : opt,
                                                    )
                                                }
                                            />
                                            <FieldLabel
                                                htmlFor={`whom-${opt.toLowerCase()}`}
                                                className="font-normal">
                                                {opt}
                                            </FieldLabel>
                                        </Field>
                                    ))}
                                </div>
                            </Field>
                        </div>

                        {integrationModeOn && (
                            <>
                                <div className="flex justify-center py-4">
                                    <Button
                                        className="rounded-full px-8 bg-blue-600 text-white hover:bg-blue-500"
                                        onClick={onCreateQuotation}>
                                        Create Quotation
                                    </Button>
                                </div>
                                <p className="text-sm text-muted-foreground text-center">
                                    * The above fields will be auto-populated
                                    from Ezsub system
                                </p>
                            </>
                        )}

                        <Field>
                            <FieldLabel className="mb-2 block">
                                Settlement Mode
                            </FieldLabel>
                            <div className="flex flex-col gap-3">
                                {SETTLEMENT_MODE_OPTIONS.map((opt) => (
                                    <Field key={opt} orientation="horizontal">
                                        <Checkbox
                                            id={`settlement-${opt.toLowerCase().replace(/[\/\s]+/g, "-")}`}
                                            name="settlement-mode"
                                            className="size-5 border-[3px]"
                                            checked={settlementMode === opt}
                                            onCheckedChange={() =>
                                                setSettlementMode(
                                                    settlementMode === opt
                                                        ? null
                                                        : opt,
                                                )
                                            }
                                        />
                                        <FieldLabel
                                            htmlFor={`settlement-${opt.toLowerCase().replace(/[\/\s]+/g, "-")}`}
                                            className="font-normal">
                                            {opt}
                                        </FieldLabel>
                                    </Field>
                                ))}
                            </div>
                        </Field>
                        <Field className="mt-5">
                            <FieldLabel htmlFor="notes" className="font-bold">
                                <span className="text-red-700">
                                    Basis of Recommendations & Benefits /
                                    Limitations:
                                </span>
                                <span className="text-sm ml-auto">
                                    Max length limit 0/5000 characters
                                </span>
                            </FieldLabel>
                            <Textarea
                                id="notes"
                                rows={12}
                                className="min-h-[300px]"
                                value={notes}
                                onChange={(e) =>
                                    onNotesChange?.(e.target.value)
                                }
                            />
                        </Field>
                    </FieldGroup>
                </div>
                <div className="shrink-0 border-t p-4 flex justify-center">
                    <Button
                        size="lg"
                        className="w-fit rounded-full bg-blue-700 text-white hover:bg-blue-600 px-24 py-6 text-base"
                        onClick={onSaveAdvice}>
                        Save Insurance Advice
                    </Button>
                </div>
            </div>
        </>
    );
}
