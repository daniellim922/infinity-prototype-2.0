"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { IntegrationModal } from "@/components/insurance-advice/integration-modal";
import { DeclarationDialog } from "@/components/insurance-advice/declaration-dialog";
import { PopupRedirectionModal } from "@/components/insurance-advice/popup-redirection-modal";
import { InsuranceAdviceSheet } from "@/components/insurance-advice/insurance-advice-sheet";

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
                />
            </CardContent>
        </Card>
    );
}
