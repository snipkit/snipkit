import snipkit, { fixedWindow, shield } from "@snipkit/next";
import { setRateLimitHeaders } from "@snipkit/decorate";
import { NextResponse } from "next/server";

const aj = snipkit({
  // Get your site key from https://app-snipkit.khulnasoft.com
  // and set it as an environment variable rather than hard coding.
  // See: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
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
      window: "2m", // 2 min fixed window
      max: 1, // allow a single request (for demo purposes)
    }),
  ],
});

export async function GET(req: Request) {
  const decision = await aj.protect(req);

  const headers = new Headers();

  setRateLimitHeaders(headers, decision);

  if (decision.isDenied()) {
    return NextResponse.json(
      {
        error: "Too Many Requests",
        reason: decision.reason,
      },
      {
        status: 429,
        headers
      },
    );
  }

  return NextResponse.json({ message: "Hello World" }, { headers });
}