export type Env = {
  [key: string]: unknown;
  FLY_APP_NAME?: string;
  VERCEL?: string;
  RENDER?: string;
  MODE?: string;
  NODE_ENV?: string;
  SNIPKIT_KEY?: string;
  SNIPKIT_ENV?: string;
  SNIPKIT_LOG_LEVEL?: string;
  SNIPKIT_BASE_URL?: string;
};

export function platform(env: Env) {
  if (typeof env["FLY_APP_NAME"] === "string" && env["FLY_APP_NAME"] !== "") {
    return "fly-io" as const;
  }

  if (typeof env["VERCEL"] === "string" && env["VERCEL"] === "1") {
    return "vercel" as const;
  }

  // https://render.com/docs/environment-variables
  if (typeof env["RENDER"] === "string" && env["RENDER"] === "true") {
    return "render" as const;
  }
}

export function isDevelopment(env: Env) {
  return (
    env.NODE_ENV === "development" ||
    env.MODE === "development" ||
    env.SNIPKIT_ENV === "development"
  );
}

export function logLevel(env: Env) {
  const level = env["SNIPKIT_LOG_LEVEL"];
  switch (level) {
    case "debug":
    case "info":
    case "warn":
    case "error":
      return level;
    default:
      // Default to warn if not set
      return "warn";
  }
}

const baseUrlAllowed = [
  "https://decide-snipkit.khulnasoft.com",
  "https://decide.snipkittest.com",
  "https://fly.decide-snipkit.khulnasoft.com",
  "https://fly.decide.snipkittest.com",
  "https://decide.snipkit.orb.local:4082",
];

export function baseUrl(env: Env) {
  // TODO(#90): Remove this conditional before 1.0.0
  if (isDevelopment(env)) {
    if (env["SNIPKIT_BASE_URL"]) {
      return env["SNIPKIT_BASE_URL"];
    }

    // If we're running on fly.io, use the Snipkit Decide Service hosted on fly
    // Ref: https://fly.io/docs/machines/runtime-environment/#environment-variables
    if (platform(env) === "fly-io") {
      return "https://fly.decide-snipkit.khulnasoft.com";
    }

    return "https://decide-snipkit.khulnasoft.com";
  } else {
    // Use SNIPKIT_BASE_URL if it is set and belongs to our allowlist; otherwise
    // use the hardcoded default.
    if (
      typeof env["SNIPKIT_BASE_URL"] === "string" &&
      baseUrlAllowed.includes(env["SNIPKIT_BASE_URL"])
    ) {
      return env["SNIPKIT_BASE_URL"];
    }

    // If we're running on fly.io, use the Snipkit Decide Service hosted on fly
    // Ref: https://fly.io/docs/machines/runtime-environment/#environment-variables
    if (platform(env) === "fly-io") {
      return "https://fly.decide-snipkit.khulnasoft.com";
    }

    return "https://decide-snipkit.khulnasoft.com";
  }
}

export function apiKey(env: Env) {
  const key = env["SNIPKIT_KEY"];
  if (typeof key === "string" && key.startsWith("ajkey_")) {
    return key;
  }
}
