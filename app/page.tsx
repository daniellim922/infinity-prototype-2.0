import type { Step } from "@/components/ui/stepper";
import { Stepper } from "@/components/ui/stepper";
import { Button } from "@/components/ui/button";
import { InsuranceAdviceCard } from "@/components/insurance-advice-card";

const STEP_DATA: Step[] = [
    {
        id: "9a",
        value: "9a",
        label: "Needs Analysis (Protection)",
        status: "completed",
    },
    {
        id: "9b",
        value: "9b",
        label: "Needs Analysis (Accumulation)",
        status: "completed",
    },
    { id: "10", value: "10", label: "Affordability", status: "completed" },
    {
        id: "11",
        value: "11",
        label: "Advice and Recommendations",
        status: "current",
    },
    {
        id: "12",
        value: "12",
        label: "Switching / Replacement of Policy",
        status: "completed",
    },
    {
        id: "13",
        value: "13",
        label: "Client Acknowledgement & Declaration",
        status: "completed",
    },
    {
        id: "14",
        value: "14",
        label: "ECDD (If Applicable)",
        status: "completed",
    },
    {
        id: "nftf",
        label: "NFTF & Upload mandatory documents",
        status: "completed",
        icon: "document",
    },
    { id: "complete", label: "Complete", status: "pending" },
];

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="bg-neutral-100 px-48 py-12 flex max-w-8xl flex-col gap-4">
                <Stepper steps={STEP_DATA} />
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900">
                        Advice and Recommendations (Insurance / Investment)
                    </h2>
                    <p className="mt-2 text-base text-neutral-500">
                        Please indicate the amount that is within your
                        affordability to set aside for your objectives and
                        whether the amount is a substantial portion of your
                        assets and income.
                    </p>
                </div>
            </header>
            <section className="flex-1 px-48 py-12 flex max-w-8xl flex-col gap-4">
                <InsuranceAdviceCard />
            </section>
            <footer className="mt-auto border-t border-neutral-200 bg-white px-48 py-4 mx-auto flex max-w-8xl items-center justify-between gap-4 w-full">
                <div className="flex items-center gap-4">
                    <Button
                        variant="default"
                        className="rounded-full bg-blue-700 text-white hover:bg-blue-600">
                        Prev Page
                    </Button>
                    <span className="text-lg text-neutral-800">
                        Case ID: #30612
                    </span>
                </div>
                <div className="flex gap-5">
                    <Button
                        variant="secondary"
                        className="rounded-full bg-neutral-200 text-neutral-900 hover:bg-neutral-100">
                        Save as Draft
                    </Button>
                    <Button
                        variant="default"
                        className="rounded-full bg-blue-700 text-white hover:bg-blue-600">
                        Complete
                    </Button>
                </div>
            </footer>
        </div>
    );
}
