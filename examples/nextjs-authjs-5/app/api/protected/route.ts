import snipkit, { shield, tokenBucket } from "@snipkit/next";
import { auth } from "auth";

// The snipkit instance is created outside of the handler
const aj = snipkit({
  key: process.env.SNIPKIT_KEY!, // Get your site key from https://app-snipkit.khulnasoft.com
  characteristics: ["userId"], // Rate limit based on the Clerk userId
  rules: [
    // Protect against common attacks with Snipkit Shield
    shield({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
    }),
    // Create a token bucket rate limit. Other algorithms are supported.
    tokenBucket({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      refillRate: 5, // refill 5 tokens per interval
      interval: 10, // refill every 10 seconds
      capacity: 10, // bucket maximum capacity of 10 tokens
    }),
  ],
});

export const GET = auth(async (req) => {
  if (req.auth) {
    console.log("User:", req.auth.user);

    // If there is a user ID then use it, otherwise use the email
    let userId: string;
    if (req.auth.user?.id) {
      userId = req.auth.user.id;
    } else if (req.auth.user?.email) {
      // A very simple hash to avoid sending PII to Snipkit. You may wish to add a
      // unique salt prefix to protect against reverse lookups.
      const email = req.auth.user!.email;
      const emailHash = require("crypto")
        .createHash("sha256")
        .update(email)
        .digest("hex");

      userId = emailHash;
    } else {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Deduct 5 tokens from the token bucket
    const decision = await aj.protect(req, { userId, requested: 5 });
    console.log("Snipkit Decision:", decision);

    if (decision.isDenied()) {
      return Response.json(
        {
          error: "Too Many Requests",
          reason: decision.reason,
        },
        {
          status: 429,
        }
      );
    }

    return Response.json({ data: "Protected data" });
  }

  return Response.json({ message: "Not authenticated" }, { status: 401 });
}) as any; // TODO: Fix `auth()` return type