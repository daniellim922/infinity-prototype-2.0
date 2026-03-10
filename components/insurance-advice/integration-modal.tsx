"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface IntegrationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onYes: () => void;
    onNo: () => void;
}

export function IntegrationModal({
    open,
    onOpenChange,
    onYes,
    onNo,
}: IntegrationModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={false}
                className="sm:max-w-2xl text-center flex flex-col items-center py-12"
                onPointerDownOutside={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader className="items-center">
                    <DialogTitle className="text-2xl">
                        Use Insurer&apos;s Integration?
                    </DialogTitle>
                </DialogHeader>
                <p className="text-lg">
                    By Clicking "Yes", you will be redirected to the insurer's
                    website, where you can generate the quotation and application
                    after clicking{" "}
                    <span className="font-bold">"Create Quotation."</span>
                </p>
                <div className="flex justify-center gap-2 pt-2">
                    <Button
                        className="rounded-full px-8 bg-blue-700 text-white hover:bg-blue-600 text-lg"
                        onClick={onYes}>
                        Yes
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={onNo}
                        className="rounded-full px-8 text-lg">
                        No
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
