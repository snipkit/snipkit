import snipkit, { shield, validateEmail } from "@snipkit/next";
import { NextResponse } from "next/server";

const aj = snipkit({
  // Get your site key from https://app-snipkit.khulnasoft.com
  // and set it as an environment variable rather than hard coding.
  // See: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
  key: process.env.SNIPKIT_KEY,
  rules: [
    // Protect against common attacks with Snipkit Shield
    shield({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
    }),
    validateEmail({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      deny: ["NO_MX_RECORDS"], // block email addresses with no MX records
      // Alternatively, you can specify a list of email types to allow.
      // This will block all others.
      // allow: ['FREE'],
    }),
  ],
});

export async function GET(req: Request) {
  const decision = await aj.protect(req, {
    email: "test@snipkit.co",
  });

  if (decision.isDenied()) {
    return NextResponse.json(
      {
        error: "Forbidden",
      },
      {
        status: 403,
      },
    );
  }

  return NextResponse.json({
    message: "Hello world",
  });
}
