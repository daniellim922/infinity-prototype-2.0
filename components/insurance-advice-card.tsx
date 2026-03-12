"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { IntegrationModal } from "@/components/insurance-advice/integration-modal";
import { DeclarationDialog } from "@/components/insurance-advice/declaration-dialog";
import {
    PopupRedirectionModal,
    type AiaQuoteResultPayload,
} from "@/components/insurance-advice/popup-redirection-modal";
import { InsuranceAdviceSheet } from "@/components/insurance-advice/insurance-advice-sheet";
import {
    SavedAdviceCard,
    type SavedAdvice,
} from "@/components/insurance-advice/saved-advice-card";
import { PREMIUM_FREQUENCY_OPTIONS } from "@/components/insurance-advice/constants";

function nextSavedAdviceId() {
    return `saved-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function InsuranceAdviceCard() {
    const [premiumFrequency, setPremiumFrequency] = useState<string | null>(
        null,
    );
    const [forWhom, setForWhom] = useState<string | null>(null);
    const [settlementMode, setSettlementMode] = useState<string | null>(null);
    const [insurer, setInsurer] = useState<string | null>(null);
    const [integrationModeOn, setIntegrationModeOn] = useState(false);
    const [showIntegrationModal, setShowIntegrationModal] = useState(false);
    const [showDeclarationDialog, setShowDeclarationDialog] = useState(false);
    const [showPopupRedirectionModal, setShowPopupRedirectionModal] =
        useState(false);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [aiaQuoteResult, setAiaQuoteResult] =
        useState<AiaQuoteResultPayload | null>(null);
    const [savedAdvices, setSavedAdvices] = useState<SavedAdvice[]>([]);
    const [notes, setNotes] = useState("");
    const [editingAdviceId, setEditingAdviceId] = useState<string | null>(null);

    const handleEditAdvice = useCallback((advice: SavedAdvice) => {
        setInsurer(advice.insurer);
        setPremiumFrequency(advice.premiumFrequency ?? null);
        setForWhom(advice.forWhom ?? null);
        setSettlementMode(advice.settlementMode ?? null);
        setNotes(advice.notes ?? "");
        setAiaQuoteResult({
            planData: {
                insuredAmount: advice.sumAssured ?? undefined,
                coverageTerm: advice.coverageTerm ?? undefined,
                premiumTerm: advice.premiumTerm ?? undefined,
                premiumFrequency: advice.premiumFrequency ?? undefined,
            },
            premiums: {
                totalAmount: advice.premiumAmount ?? undefined,
                basicPlanAmount: advice.premiumAmount ?? undefined,
            },
        });
        setIntegrationModeOn(true);
        setEditingAdviceId(advice.id);
        setSheetOpen(true);
    }, []);

    const handleQuoteReceived = useCallback((data: AiaQuoteResultPayload) => {
        setAiaQuoteResult(data);
        const freqRaw = data?.planData?.premiumFrequency;
        if (freqRaw != null && String(freqRaw).trim() !== "") {
            const normalized = (
                PREMIUM_FREQUENCY_OPTIONS as readonly string[]
            ).find(
                (opt) =>
                    opt.toLowerCase().trim() ===
                    String(freqRaw).toLowerCase().trim(),
            );
            if (normalized) setPremiumFrequency(normalized);
        }
        setNotes(
            "This is an example text that is prefilled based of the policy that is chosen",
        );
        setSheetOpen(true);
    }, []);

    const handleSaveAdvice = useCallback(() => {
        const planData = aiaQuoteResult?.planData;
        const premiums = aiaQuoteResult?.premiums;
        const saved: SavedAdvice = {
            id: editingAdviceId ?? nextSavedAdviceId(),
            insurer: insurer ?? "aia",
            planLabel: "Ultimate Critical Cover",
            sumAssured: planData?.insuredAmount ?? null,
            premiumAmount:
                premiums?.totalAmount ?? premiums?.basicPlanAmount ?? null,
            premiumTerm: planData?.premiumTerm ?? null,
            coverageTerm: planData?.coverageTerm ?? null,
            premiumFrequency:
                premiumFrequency ?? planData?.premiumFrequency ?? null,
            forWhom: forWhom ?? null,
            settlementMode: settlementMode ?? null,
            notes: notes || undefined,
        };
        setSavedAdvices((prev) =>
            editingAdviceId
                ? prev.map((a) => (a.id === editingAdviceId ? saved : a))
                : [...prev, saved],
        );
        setSheetOpen(false);
        setAiaQuoteResult(null);
        setEditingAdviceId(null);
    }, [
        aiaQuoteResult,
        insurer,
        premiumFrequency,
        forWhom,
        settlementMode,
        notes,
        editingAdviceId,
    ]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <h1 className="text-3xl font-bold text-neutral-900">
                        Insurance Advice
                    </h1>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {savedAdvices.length > 0 && (
                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold text-neutral-700">
                            Saved advice
                        </h2>
                        <ul className="grid grid-cols-2 gap-4">
                            {savedAdvices.map((advice, i) => (
                                <li key={advice.id}>
                                    <SavedAdviceCard
                                        advice={advice}
                                        index={i + 1}
                                        total={savedAdvices.length}
                                        onEdit={() => handleEditAdvice(advice)}
                                        onDelete={() =>
                                            setSavedAdvices((prev) =>
                                                prev.filter(
                                                    (a) => a.id !== advice.id,
                                                ),
                                            )
                                        }
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <Sheet
                    open={sheetOpen}
                    onOpenChange={(open) => {
                        if (open) setSheetOpen(true);
                        else if (!showPopupRedirectionModal)
                            setSheetOpen(false);
                    }}>
                    <SheetTrigger asChild>
                        <Button
                            className="rounded-full bg-blue-700 text-white hover:bg-blue-600"
                            onClick={() => {
                                setEditingAdviceId(null);
                                setPremiumFrequency(null);
                                setForWhom(null);
                                setSettlementMode(null);
                                setInsurer(null);
                                setIntegrationModeOn(false);
                                setAiaQuoteResult(null);
                                setNotes("");
                                setSheetOpen(true);
                            }}>
                            Add Insurance
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="flex flex-col data-[side=right]:sm:max-w-6xl">
                        <InsuranceAdviceSheet
                            premiumFrequency={premiumFrequency}
                            setPremiumFrequency={setPremiumFrequency}
                            forWhom={forWhom}
                            setForWhom={setForWhom}
                            settlementMode={settlementMode}
                            setSettlementMode={setSettlementMode}
                            insurer={insurer}
                            integrationModeOn={integrationModeOn}
                            onInsurerChange={(v) => {
                                setInsurer(v);
                                setIntegrationModeOn(false);
                            }}
                            onIntegrationSwitchChange={(checked) => {
                                if (checked) {
                                    setShowIntegrationModal(true);
                                } else {
                                    setIntegrationModeOn(false);
                                }
                            }}
                            onCreateQuotation={() =>
                                setShowDeclarationDialog(true)
                            }
                            syncedQuoteData={aiaQuoteResult}
                            onSaveAdvice={handleSaveAdvice}
                            notes={notes}
                            onNotesChange={setNotes}
                        />
                    </SheetContent>
                </Sheet>
                <IntegrationModal
                    open={showIntegrationModal}
                    onOpenChange={setShowIntegrationModal}
                    onYes={() => {
                        setShowIntegrationModal(false);
                        setIntegrationModeOn(true);
                    }}
                    onNo={() => {
                        setShowIntegrationModal(false);
                        setIntegrationModeOn(false);
                    }}
                />
                <DeclarationDialog
                    open={showDeclarationDialog}
                    onOpenChange={setShowDeclarationDialog}
                    onCancel={() => setShowDeclarationDialog(false)}
                    onGenerateQuotation={() => {
                        setShowDeclarationDialog(false);
                        setShowPopupRedirectionModal(true);
                    }}
                />
                <PopupRedirectionModal
                    open={showPopupRedirectionModal}
                    onOpenChange={setShowPopupRedirectionModal}
                    onQuoteReceived={handleQuoteReceived}
                />
            </CardContent>
        </Card>
    );
}
