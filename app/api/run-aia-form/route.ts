import { NextResponse } from "next/server";
import { spawn } from "child_process";
import { profilesTest } from "@/data/profilesTest";

export const maxDuration = 30;

export async function POST(request: Request) {
  const profile = profilesTest[0];
  const testData = JSON.stringify(profile);

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : null) ||
    request.headers.get("origin") ||
    "http://localhost:3000";

  const child = spawn(
    "npx",
    ["playwright", "test", "tests/aia-form.spec.js", "--project=chromium"],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        TEST_DATA: testData,
        APP_URL: appUrl,
      },
      stdio: "ignore",
      detached: true,
    },
  );

  child.unref();

  child.on("error", (err) => {
    console.error("Failed to spawn Playwright:", err);
  });

  return NextResponse.json({
    success: true,
    message: "AIA form automation started. A browser window will open.",
  });
}
