"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs } from "radix-ui";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AiaQuoteResultPayload {
    planData?: {
        premiumTerm?: string | null;
        premiumFrequency?: string | null;
        coverageTerm?: string | null;
        insuredAmount?: string | null;
    };
    premiums?: {
        totalAmount?: string | null;
        basicPlanAmount?: string | null;
        uccEnhancerAmount?: string | null;
        ecpwpAmount?: string | null;
        cpwpAmount?: string | null;
    };
}

interface PopupRedirectionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onQuoteReceived?: (data: AiaQuoteResultPayload) => void;
}

export function PopupRedirectionModal({
    open,
    onOpenChange,
    onQuoteReceived,
}: PopupRedirectionModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        return () => {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        };
    }, []);

    async function handleOkClick() {
        setIsLoading(true);
        setError(null);
        try {
            await fetch("/api/aia-quote-result", { method: "DELETE" });
            const res = await fetch("/api/run-aia-form", { method: "POST" });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.details || data.error || "Failed to run");
            }
            await pollForQuoteResult();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Something went wrong");
        }
    }

    async function pollForQuoteResult() {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = setInterval(async () => {
            try {
                const res = await fetch("/api/aia-quote-result");
                const data = await res.json();
                console.log("data", data);
                const hasResult =
                    data?.planData != null || data?.premiums != null;
                if (hasResult) {
                    if (pollIntervalRef.current) {
                        clearInterval(pollIntervalRef.current);
                        pollIntervalRef.current = null;
                    }
                    setIsLoading(false);
                    onQuoteReceived?.(data);
                    onOpenChange(false);
                }
            } catch {
                // ignore poll errors
            }
        }, 2000);
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-3xl py-8 px-6"
                showCloseButton={false}
                onPointerDownOutside={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        Digital FR uses Pop-ups for Insurer Portal Redirection
                    </DialogTitle>
                </DialogHeader>
                <p className="text-base font-bold">
                    Your browser may block pop-ups by default. When this
                    happens, a &apos;Pop-up blocked&apos; icon will appear in
                    the address bar. Follow these steps to enable pop-ups for
                    Digital FR on your device
                </p>
                <Tabs.Root defaultValue="chrome" className="w-full">
                    <Tabs.List
                        className={cn(
                            "inline-flex h-10 w-full items-center justify-start gap-6",
                            "border-b border-gray-200 pb-0",
                        )}>
                        <Tabs.Trigger
                            value="chrome"
                            className={cn(
                                "rounded-none border-b-2 border-transparent px-0 pb-3 pt-0",
                                "text-base font-bold text-gray-600",
                                "data-[state=active]:border-blue-700 data-[state=active]:text-blue-700",
                            )}>
                            Google Chrome
                        </Tabs.Trigger>
                        <Tabs.Trigger
                            value="firefox"
                            className={cn(
                                "rounded-none border-b-2 border-transparent px-0 pb-3 pt-0",
                                "text-base font-bold text-gray-600",
                                "data-[state=active]:border-blue-700 data-[state=active]:text-blue-700",
                            )}>
                            Mozilla Firefox
                        </Tabs.Trigger>
                        <Tabs.Trigger
                            value="safari"
                            className={cn(
                                "rounded-none border-b-2 border-transparent px-0 pb-3 pt-0",
                                "text-base font-bold text-gray-600",
                                "data-[state=active]:border-blue-700 data-[state=active]:text-blue-700",
                            )}>
                            Safari (iOS/iPadOS)
                        </Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content
                        value="chrome"
                        className="mt-4 space-y-3 text-base">
                        <p>
                            1. Go to Settings &gt; Site settings &gt; Pop-ups
                            and redirects and enable it
                        </p>
                        <p>
                            <span className="font-bold">Note:</span> Upon
                            clicking the &quot;OK&quot; button, you will be
                            automatically redirected to AIA &apos;s Ezsub system
                            to complete the quotation process.
                        </p>
                    </Tabs.Content>
                    <Tabs.Content
                        value="firefox"
                        className="mt-4 text-base text-muted-foreground">
                        Instructions coming soon
                    </Tabs.Content>
                    <Tabs.Content
                        value="safari"
                        className="mt-4 text-base text-muted-foreground">
                        Instructions coming soon
                    </Tabs.Content>
                </Tabs.Root>
                <div className="flex flex-col items-center gap-3 pt-6">
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <Button
                        className="rounded-full bg-blue-700 px-8 text-white hover:bg-blue-600 text-lg disabled:opacity-70"
                        onClick={handleOkClick}
                        disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 size-5 animate-spin" />
                                Syncing AIA form...
                            </>
                        ) : (
                            "OK"
                        )}
                    </Button>
                    {isLoading && (
                        <p className="text-sm text-muted-foreground">
                            A new browser window will open with the form
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
