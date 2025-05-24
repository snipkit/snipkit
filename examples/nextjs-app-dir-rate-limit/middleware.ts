import snipkit, { createMiddleware, shield } from "@snipkit/next";
import pino from "pino";

export const config = {
  runtime: "nodejs",
  // matcher tells Next.js which routes to run the middleware on
  matcher: ["/"],
};

const aj = snipkit({
  // Get your site key from https://app-snipkit.khulnasoft.com
  // and set it as an environment variable rather than hard coding.
  // See: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
  key: process.env.SNIPKIT_KEY!,
  rules: [
    // Protect against common attacks with Snipkit Shield
    shield({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
    }),
  ],
  log: pino({ level: "debug" })
});

export default createMiddleware(aj);
