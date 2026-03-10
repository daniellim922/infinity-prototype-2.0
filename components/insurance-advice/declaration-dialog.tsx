"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";

interface DeclarationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCancel: () => void;
    onGenerateQuotation: () => void;
}

export function DeclarationDialog({
    open,
    onOpenChange,
    onCancel,
    onGenerateQuotation,
}: DeclarationDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={false}
                className="sm:max-w-3xl py-8 px-6"
                onPointerDownOutside={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}>
                <DialogTitle className="text-2xl font-bold">
                    Declaration Form and Quotation Submission Declaration
                </DialogTitle>
                <p className="text-base text-muted-foreground">
                    AIA Singapore Pte. Ltd. is requesting the following
                    information for the purpose of submitting a quotation on
                    Singlife&apos;s Ezsub system.
                </p>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Yourself Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 text-base">
                        <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">
                                First Name
                            </span>
                            <span className="ml-auto font-medium">
                                SAMUEL YANG EN
                            </span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">
                                Last Name
                            </span>
                            <span className="ml-auto font-medium">LIM</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">NRIC</span>
                            <span className="ml-auto font-medium">
                                T0014489J
                            </span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">
                                Date of Birth
                            </span>
                            <span className="ml-auto font-medium">
                                07/08/1996
                            </span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">
                                Gender
                            </span>
                            <span className="ml-auto font-medium">Male</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">
                                Nationality
                            </span>
                            <span className="ml-auto font-medium">
                                Singapore
                            </span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">
                                Smoker
                            </span>
                            <span className="ml-auto font-medium">No</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">
                                Occupation
                            </span>
                            <span className="ml-auto font-medium">
                                Technician
                            </span>
                        </div>
                    </CardContent>
                </Card>
                <Field orientation="horizontal" className="gap-2 items-start">
                    <Checkbox
                        id="declaration-consent"
                        className="size-5 border-[3px]"
                    />
                    <FieldLabel
                        htmlFor="declaration-consent"
                        className="font-normal text-base">
                        By checking this, you agree and confirm that you have
                        obtained consent from your client to allow the above
                        personal data to be transferred to AIA. The data will
                        not be used for any other purposes
                    </FieldLabel>
                </Field>
                <div className="flex justify-center gap-3 pt-4">
                    <Button
                        variant="secondary"
                        className="text-lg rounded-full px-6"
                        onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button
                        className="bg-blue-700 text-white hover:bg-blue-600 text-lg rounded-full px-6"
                        onClick={onGenerateQuotation}>
                        Generate Quotation
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
