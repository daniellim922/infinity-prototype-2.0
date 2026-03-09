"use client";

import React from "react";
import { Check, FileText } from "lucide-react";

import { cn } from "@/lib/utils";

export type StepStatus = "completed" | "current" | "pending";

export type Step = {
    id: string;
    label: string;
    status: StepStatus;
    icon?: "number" | "document";
    value?: string; // e.g. "9a", "9b", "10", "11" for number steps
};

type StepperProps = {
    steps: Step[];
    className?: string;
};

function Connector({ toStatus }: { toStatus: StepStatus }) {
    return (
        <div className="flex min-w-4 flex-1" aria-hidden>
            <div
                className={cn(
                    "h-0.5 w-full",
                    toStatus === "pending"
                        ? "bg-stepper-pending"
                        : "bg-stepper-line-completed",
                )}
            />
        </div>
    );
}

export function Stepper({ steps, className }: StepperProps) {
    return (
        <div
            aria-label="Progress"
            className={cn("flex w-full flex-col", className)}
            role="group">
            {/* Row 1: circles + connectors */}
            <ol className="flex w-full items-center">
                {steps
                    .flatMap((step, index) => [
                        <li
                            key={step.id}
                            className="flex w-10 shrink-0 justify-center"
                            aria-current={
                                step.status === "current" ? "step" : undefined
                            }>
                            <div
                                className={cn(
                                    "flex size-10 shrink-0 items-center justify-center text-sm font-semibold text-white",
                                    step.icon === "document"
                                        ? "rounded-full bg-stepper-completed"
                                        : step.status === "completed" &&
                                              "rounded-full bg-stepper-completed",
                                    step.status === "current" &&
                                        step.icon !== "document" &&
                                        "rounded-full bg-stepper-current",
                                    step.status === "pending" &&
                                        "rounded-full border-2 border-stepper-pending bg-transparent",
                                )}>
                                {step.icon === "document" ? (
                                    <FileText className="size-5 text-white" />
                                ) : step.status === "pending" ? (
                                    <Check className="size-4 text-stepper-text-pending" />
                                ) : (
                                    (step.value ?? "")
                                )}
                            </div>
                        </li>,
                        index < steps.length - 1 ? (
                            <Connector
                                key={`connector-${step.id}`}
                                toStatus={steps[index + 1]!.status}
                            />
                        ) : null,
                    ])
                    .filter(Boolean)}
            </ol>
            {/* Row 2: labels + spacers */}
            <div className="flex w-full">
                {steps
                    .flatMap((step, index) => [
                        <div
                            key={`label-${step.id}`}
                            className="mt-1 flex w-10 shrink-0 justify-center">
                            <span
                                className={cn(
                                    "inline-flex max-w-[110px] gap-1.5 text-xs font-normal leading-tight",
                                    step.status === "completed" &&
                                        "text-stepper-text-completed",
                                    step.status === "current" &&
                                        "text-stepper-text-current",
                                    step.status === "pending" &&
                                        "text-stepper-text-pending",
                                )}>
                                {(step.status === "completed" ||
                                    step.status === "current") && (
                                    <Check
                                        className="size-4 shrink-0 text-stepper-completed"
                                        aria-hidden
                                    />
                                )}
                                {step.label}
                            </span>
                        </div>,
                        index < steps.length - 1 ? (
                            <div
                                key={`spacer-${step.id}`}
                                className="min-w-4 flex-1"
                                aria-hidden
                            />
                        ) : null,
                    ])
                    .filter(Boolean)}
            </div>
        </div>
    );
}
