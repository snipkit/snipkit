// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import snipkit, { shield } from "@snipkit/next";
import type { NextApiRequest, NextApiResponse } from "next";

const aj = snipkit({
  // Get your site key from https://app-snipkit.khulnasoft.com
  // and set it as an environment variable rather than hard coding.
  // See: https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables
  key: process.env.SNIPKIT_KEY!,
  rules: [
    // Protect against common attacks with Snipkit Shield
    shield({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
    }),
  ],
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const decision = await aj.protect(req);

  // Only allow requests from a VPN for demo purposes.
  // In actual usage, you might deny requests when `isVpn()` returns `true`.
  if (!decision.ip.isVpn()) {
    return res.status(403).json({ error: "Forbidden" });
  }

  res.status(200).json({ name: "Hello world" });
}
