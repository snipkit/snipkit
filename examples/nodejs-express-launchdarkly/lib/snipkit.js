import snipkit, { shield, slidingWindow } from "@snipkit/node";
import { getSnipkitConfig } from "./launchdarkly.js";

// Initialize Snipkit with your site key and rules
const aj = snipkit({
  // Get your site key from https://app-snipkit.khulnasoft.com
  // and set it as an environment variable rather than hard coding.
  // See: https://www.npmjs.com/package/dotenv
  key: process.env.SNIPKIT_KEY,
  rules: [],
});

// This function will return an Snipkit instance with the latest rules
export default async () => {
  // Get the latest configuration from LaunchDarkly
  const config = await getSnipkitConfig();

  // Return the Snipkit instance with the latest rules
  return aj.withRule(shield({ mode: config.shieldMode })).withRule(
    slidingWindow({
      mode: config.slidingWindowMode,
      max: config.slidingWindowMax,
      interval: config.slidingWindowInterval,
    })
  );
};