"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
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

const PREMIUM_FREQUENCY_OPTIONS = [
    "Monthly",
    "Quarterly",
    "Semi-Annual",
    "Yearly",
    "Single Premium",
] as const;

const FOR_WHOM_OPTIONS = [
    "Yourself",
    "Spouse",
    "Joint",
    "Child",
    "Parent",
] as const;

const SETTLEMENT_MODE_OPTIONS = [
    "Cheque/CC/Bank Transfer",
    "SRS",
    "CPF OA",
    "CPF SA",
    "CPF MA",
] as const;

export function InsuranceAdviceCard() {
    const [premiumFrequency, setPremiumFrequency] = useState<string | null>(
        null,
    );
    const [forWhom, setForWhom] = useState<string | null>(null);
    const [settlementMode, setSettlementMode] = useState<string | null>(null);

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <h1 className="text-3xl font-bold text-neutral-900">
                        Insurance Advice
                    </h1>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button className="rounded-full bg-blue-500 text-white hover:bg-blue-600">
                            Add Insurance
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="flex flex-col data-[side=right]:sm:max-w-6xl">
                        <div className="flex flex-1 min-h-0 flex-col">
                            <div className="flex-1 overflow-y-auto min-h-0">
                                <SheetHeader>
                                    <SheetTitle className="text-xl">
                                        For insurance Advice
                                    </SheetTitle>
                                </SheetHeader>
                                <FieldGroup className="gap-4 p-4">
                                    {/* Row 1: Checkbox, Insurer, Plan Recommended */}
                                    <Field orientation="horizontal">
                                        <Checkbox
                                            id="ip-rider"
                                            name="ip-rider"
                                            className="size-5 border-[3px]"
                                        />
                                        <FieldLabel
                                            htmlFor="ip-rider"
                                            className="font-normal text-lg">
                                            Recommend IP Rider only
                                        </FieldLabel>
                                    </Field>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Field>
                                            <FieldLabel htmlFor="insurer">
                                                Insurer
                                            </FieldLabel>
                                            <Select>
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
                                                    <SelectItem value="fwd">
                                                        FWD
                                                    </SelectItem>
                                                    <SelectItem value="aia">
                                                        AIA
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="plan">
                                                Plan Recommended
                                            </FieldLabel>
                                            <Select>
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

                                    {/* Row 2: Sum Assured + checkbox, Policy Term */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <Field>
                                            <FieldLabel htmlFor="sum-assured">
                                                Sum Assured
                                            </FieldLabel>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    id="sum-assured"
                                                    type="number"
                                                    className="flex-1"
                                                />
                                                <Checkbox
                                                    aria-label="Sum Assured option"
                                                    className="size-5 border-[3px]"
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
                                                type="number"
                                            />
                                        </Field>
                                    </div>

                                    {/* Row 3: Premium Term, Minimum Investment Period */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <Field>
                                            <FieldLabel htmlFor="premium-term">
                                                Premium Term
                                            </FieldLabel>
                                            <Input
                                                id="premium-term"
                                                type="number"
                                            />
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="min-investment">
                                                Minimum Investment Period (For
                                                ILP)
                                            </FieldLabel>
                                            <Input
                                                id="min-investment"
                                                type="number"
                                            />
                                        </Field>
                                    </div>

                                    {/* Row 4: Currency, Premium Amount */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <Field>
                                            <FieldLabel htmlFor="currency">
                                                Currency
                                            </FieldLabel>
                                            <Select defaultValue="sgd">
                                                <SelectTrigger
                                                    id="currency"
                                                    className="w-full">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="sgd">
                                                        SGD
                                                    </SelectItem>
                                                    <SelectItem value="usd">
                                                        USD
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="premium-amount">
                                                Premium Amount
                                            </FieldLabel>
                                            <Input
                                                id="premium-amount"
                                                type="number"
                                            />
                                        </Field>
                                    </div>

                                    {/* Additional add-on rider */}
                                    <div className="flex flex-col gap-2 items-center">
                                        <p className="text-sm font-medium self-start">
                                            Additional add-on rider
                                        </p>
                                        <Button className="rounded-full px-12 bg-blue-600 text-white hover:bg-blue-500">
                                            + Additional add-on rider
                                        </Button>
                                    </div>

                                    {/* Row 5: Premium Frequency & For Whom - side by side */}
                                    <div className="grid grid-cols-2 gap-8">
                                        <Field>
                                            <FieldLabel className="mb-2 block">
                                                Premium Frequency
                                            </FieldLabel>
                                            <div className="flex flex-col gap-3">
                                                {PREMIUM_FREQUENCY_OPTIONS.map(
                                                    (opt) => (
                                                        <Field
                                                            key={opt}
                                                            orientation="horizontal">
                                                            <Checkbox
                                                                id={`freq-${opt.toLowerCase().replace(/\s+/g, "-")}`}
                                                                name="premium-frequency"
                                                                className="size-5 border-[3px]"
                                                                checked={
                                                                    premiumFrequency ===
                                                                    opt
                                                                }
                                                                onCheckedChange={() =>
                                                                    setPremiumFrequency(
                                                                        premiumFrequency ===
                                                                            opt
                                                                            ? null
                                                                            : opt,
                                                                    )
                                                                }
                                                            />
                                                            <FieldLabel
                                                                htmlFor={`freq-${opt.toLowerCase().replace(/\s+/g, "-")}`}
                                                                className="font-normal">
                                                                {opt}
                                                            </FieldLabel>
                                                        </Field>
                                                    ),
                                                )}
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
                                                            checked={
                                                                forWhom === opt
                                                            }
                                                            onCheckedChange={() =>
                                                                setForWhom(
                                                                    forWhom ===
                                                                        opt
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

                                    {/* Settlement Mode */}
                                    <Field>
                                        <FieldLabel className="mb-2 block">
                                            Settlement Mode
                                        </FieldLabel>
                                        <div className="flex flex-col gap-3">
                                            {SETTLEMENT_MODE_OPTIONS.map(
                                                (opt) => (
                                                    <Field
                                                        key={opt}
                                                        orientation="horizontal">
                                                        <Checkbox
                                                            id={`settlement-${opt.toLowerCase().replace(/[\/\s]+/g, "-")}`}
                                                            name="settlement-mode"
                                                            className="size-5 border-[3px]"
                                                            checked={
                                                                settlementMode ===
                                                                opt
                                                            }
                                                            onCheckedChange={() =>
                                                                setSettlementMode(
                                                                    settlementMode ===
                                                                        opt
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
                                                ),
                                            )}
                                        </div>
                                    </Field>
                                    <Field className="mt-5">
                                        <FieldLabel
                                            htmlFor="notes"
                                            className="font-bold">
                                            <span className="text-red-700">
                                                Basis of Recommendations &
                                                Benefits / Limitations:
                                            </span>
                                            <span className="text-sm ml-auto">
                                                Max length limit 0/5000
                                                characters
                                            </span>
                                        </FieldLabel>
                                        <Textarea
                                            id="notes"
                                            rows={12}
                                            className="min-h-[300px]"
                                        />
                                    </Field>
                                </FieldGroup>
                            </div>
                            <div className="shrink-0 border-t p-4 flex justify-center">
                                <Button
                                    size="lg"
                                    className="w-fit rounded-full bg-blue-600 text-white hover:bg-blue-500 px-24 py-6 text-base">
                                    Save Insurance Advice
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </CardContent>
        </Card>
    );
}
