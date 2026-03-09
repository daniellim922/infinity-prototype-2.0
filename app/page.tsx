import type { Step } from "@/components/ui/stepper";
import { Stepper } from "@/components/ui/stepper";
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
        <>
            <header className="bg-neutral-100 px-48 py-12 mx-auto flex max-w-8xl flex-col gap-4">
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
            <section className="px-48 py-12 mx-auto flex max-w-8xl flex-col gap-4">
                <InsuranceAdviceCard />
            </section>
        </>
    );
}
