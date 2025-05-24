// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import snipkit, { fixedWindow, shield, withSnipkit } from "@snipkit/next";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: "edge",
};

const aj = snipkit({
  // Get your site key from https://app-snipkit.khulnasoft.com
  // and set it as an environment variable rather than hard coding.
  // See: https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables
  key: process.env.SNIPKIT_KEY!,
  // Limiting by ip.src is the default if not specified
  //characteristics: ["ip.src"],
  rules: [
    // Protect against common attacks with Snipkit Shield
    shield({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
    }),
    // Fixed window rate limit. Snipkit also supports sliding window and token
    // bucket.
    fixedWindow({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only      
      window: "1m", // 1 min fixed window
      max: 1, // allow a single request (for demo purposes)
    }),
  ],
});

export default withSnipkit(aj, async function handler(req: NextRequest) {
  return NextResponse.json({
    message: "Hello world",
  });
});