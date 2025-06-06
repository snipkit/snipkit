import snipkit, { fixedWindow } from "@snipkit/next";
import { setRateLimitHeaders } from "@snipkit/decorate";
import { NextApiRequest, NextApiResponse } from "next";

const aj = snipkit({
  // Get your site key from https://app-snipkit.khulnasoft.com
  // and set it as an environment variable rather than hard coding.
  // See: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
  key: process.env.SNIPKIT_KEY!,
  // Limiting by ip.src is the default if not specified
  //characteristics: ["ip.src"],
  rules: [
    // Fixed window rate limit. Snipkit also supports sliding window and token
    // bucket.
    fixedWindow({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      window: "1m", // 1 min fixed window
      max: 1, // allow a single request (for demo purposes)
    }),
  ],
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const decision = await aj.protect(req);

  setRateLimitHeaders(res, decision);

  if (decision.isDenied()) {
    return res.status(429).json({
      error: "Too Many Requests",
      reason: decision.reason,
    })
  }

  res.status(200).json({ name: "Hello world" });
}