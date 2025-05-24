import _snipkit, { shield } from "@snipkit/next";

export const snipkit = _snipkit({
  // Get your site key from https://app-snipkit.khulnasoft.com
  // and set it as an environment variable rather than hard coding.
  // See: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
  key: process.env.SNIPKIT_KEY!,
  // Define a global characteristic that we can use to identify users
  characteristics: ["fingerprint"],
  // Define the global rules that we want to run on every request
  rules: [
    // Shield detects suspicious behavior, such as SQL injection and cross-site
    // scripting attacks. We want to run it on every request
    shield({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
    }),
  ],
});
