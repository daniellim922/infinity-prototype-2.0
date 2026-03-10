import { NextResponse } from "next/server";
import { spawn } from "child_process";
import { profilesTest } from "@/data/profilesTest";

export const maxDuration = 30;

export async function POST() {
  const profile = profilesTest[0];
  const testData = JSON.stringify(profile);

  const child = spawn(
    "npx",
    ["playwright", "test", "tests/aia-form.spec.js", "--project=chromium"],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        TEST_DATA: testData,
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
