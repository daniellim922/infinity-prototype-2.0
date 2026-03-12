"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SavedAdvice {
    id: string;
    insurer: string;
    planLabel?: string;
    sumAssured?: string | null;
    premiumAmount?: string | null;
    premiumTerm?: string | null;
    coverageTerm?: string | null;
    premiumFrequency?: string | null;
    forWhom?: string | null;
    settlementMode?: string | null;
    notes?: string;
    mip?: string | null;
}

interface SavedAdviceCardProps {
    advice: SavedAdvice;
    index: number;
    total: number;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

const INSURER_LABELS: Record<string, string> = {
    "hsbc-life": "HSBC Life",
    singlife: "Singlife",
    fwd: "FWD",
    aia: "AIA",
};

function formatCurrency(value: string | null | undefined): string {
    if (value == null || value === "") return "—";
    const trimmed = String(value).trim();
    const numMatch = trimmed.replace(/,/g, "").match(/[\d.]+/);
    if (numMatch) {
        const num = Number(numMatch[0]);
        if (!Number.isNaN(num))
            return `SGD $${num.toLocaleString("en-SG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return trimmed;
}

function formatTotalPremium(
    premiumAmount: string | null | undefined,
    premiumFrequency: string | null | undefined,
): string {
    const amount = formatCurrency(premiumAmount);
    if (amount === "—") return "—";
    const freq = premiumFrequency?.toLowerCase();
    if (freq === "annual" || freq === "yearly") return `${amount}/Yr`;
    if (freq === "monthly") return `${amount}/Mo`;
    if (freq === "quarterly") return `${amount}/Qtr`;
    if (freq === "semi-annual") return `${amount}/6Mo`;
    if (freq === "single premium") return amount;
    return amount;
}

export function SavedAdviceCard({
    advice,
    index,
    total,
    onEdit,
    onDelete,
}: SavedAdviceCardProps) {
    const [notesExpanded, setNotesExpanded] = useState(false);
    const insurerLabel =
        INSURER_LABELS[advice.insurer] ?? advice.insurer ?? "—";

    const row = (
        label: string,
        value: React.ReactNode,
        valueBlue?: boolean,
    ) => (
        <div className="flex justify-between items-baseline gap-4 py-1">
            <span className="text-sm text-neutral-900 shrink-0">{label}</span>
            <span
                className={cn(
                    "text-sm text-right shrink-0 min-w-0 truncate font-bold",
                    valueBlue ? "text-blue-600" : "text-neutral-900",
                )}>
                {value}
            </span>
        </div>
    );

    const totalPremium = formatTotalPremium(
        advice.premiumAmount,
        advice.premiumFrequency,
    );
    const notesSnippet =
        advice.notes != null && advice.notes !== ""
            ? notesExpanded
                ? advice.notes
                : advice.notes.slice(0, 80) +
                  (advice.notes.length > 80 ? "…" : "")
            : null;
    const hasMoreNotes =
        advice.notes != null && advice.notes.length > 80 && !notesExpanded;

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-neutral-900">
                    Insurance Advice {index}/{total}
                </h3>
                <div className="flex items-center gap-2">
                    {onEdit && (
                        <button
                            type="button"
                            onClick={() => onEdit(advice.id)}
                            className="p-1.5 rounded text-blue-600 hover:bg-blue-50"
                            aria-label="Edit">
                            <Pencil className="size-4" />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            type="button"
                            onClick={() => onDelete(advice.id)}
                            className="p-1.5 rounded text-red-600 hover:bg-red-50"
                            aria-label="Delete">
                            <Trash2 className="size-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Key-value details */}
            <div className="space-y-0 text-sm">
                {row("Insurer Recommended", insurerLabel)}
                {row("Plan Recommendation", advice.planLabel ?? "—")}
                {row(
                    "Sum Assured",
                    advice.sumAssured != null && advice.sumAssured !== ""
                        ? formatCurrency(advice.sumAssured)
                        : "—",
                )}
                {row("Policy Term", advice.coverageTerm ?? "—")}
                {row(
                    "Premium Amount",
                    formatCurrency(advice.premiumAmount),
                    true,
                )}
                {row("Premium Term", advice.premiumTerm ?? "—")}
                {row("MIP", advice.mip ?? "—")}
                {row("Premium Frequency", advice.premiumFrequency ?? "—")}
                {row("For whom?", advice.forWhom ?? "—")}
                {row("Settlement Mode", advice.settlementMode ?? "—")}
            </div>

            {/* Separator + Total Premium */}
            <div className="flex justify-between items-baseline">
                <span className="text-sm text-blue-600 font-bold">
                    Total Premium Amount
                </span>
                <span className="text-sm text-blue-600 font-bold text-right">
                    {totalPremium}
                </span>
            </div>
            <div className="border-t border-gray-200 my-4" />

            {/* Basis of Recommendations */}
            <div className="mt-4">
                <p className="text-sm font-bold text-neutral-900 mb-1">
                    Basis of Recommendations & Benefits / Limitations:
                </p>
                {notesSnippet != null && notesSnippet !== "" ? (
                    <>
                        <p className="text-sm text-neutral-700 whitespace-pre-wrap">
                            {notesSnippet}
                        </p>
                        {hasMoreNotes && (
                            <button
                                type="button"
                                onClick={() => setNotesExpanded(true)}
                                className="text-sm text-blue-600 hover:underline mt-1">
                                View more
                            </button>
                        )}
                    </>
                ) : (
                    <p className="text-sm text-neutral-500">—</p>
                )}
            </div>
        </div>
    );
}
