import { NextResponse } from "next/server";

let latestQuoteResult: any = null;

export async function POST(request: Request) {
    try {
        const body = await request.json();

        latestQuoteResult = { ...body };
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

export async function DELETE() {
    latestQuoteResult = null;
    return NextResponse.json({ success: true });
}
