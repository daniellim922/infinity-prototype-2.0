import { NextResponse } from "next/server";

let latestQuoteResult: {
    premiumTerm: string | null;
    sumAssured: string | null;
    premiums: {
        totalAmount: string | null;
        basicPlanAmount: string | null;
        uccEnhancerAmount: string | null;
        ecpwpAmount: string | null;
        cpwpAmount: string | null;
    };
} | null = null;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { premiumTerm, sumAssured, premiums } = body;
        latestQuoteResult = {
            premiumTerm: premiumTerm ?? null,
            sumAssured: sumAssured ?? null,
            premiums: {
                totalAmount: premiums?.totalAmount ?? null,
                basicPlanAmount: premiums?.basicPlanAmount ?? null,
                uccEnhancerAmount: premiums?.uccEnhancerAmount ?? null,
                ecpwpAmount: premiums?.ecpwpAmount ?? null,
                cpwpAmount: premiums?.cpwpAmount ?? null,
            },
        };
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json(
            { error: "Invalid request body" },
            { status: 400 },
        );
    }
}

export async function GET() {
    return NextResponse.json(latestQuoteResult ?? { data: null });
}
