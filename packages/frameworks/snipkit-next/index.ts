import type { NextApiResponse } from "next";
import { NextResponse } from "next/server.js";
import { headers, cookies } from "next/headers.js";
import type {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
} from "next/server.js";
import type { NextMiddlewareResult } from "next/dist/server/web/types.js";
import core from "snipkit";
import type {
  SnipkitDecision,
  SnipkitOptions as CoreOptions,
  Primitive,
  Product,
  SnipkitRequest,
  ExtraProps,
  Snipkit,
  CharacteristicProps,
} from "snipkit";
import findIP, { parseProxy } from "@snipkit/utils/ip";
import SnipkitHeaders from "@snipkit/utils/headers";
import { baseUrl, isDevelopment, logLevel, platform } from "@snipkit/utils/env";
import { Logger } from "@snipkit/utils/logger";
import { createClient } from "@snipkit/protocol/client.js";
import { createTransport } from "@snipkit/utils/transport";

// Re-export all named exports from the generic SDK
export * from "snipkit";

export async function request(): Promise<SnipkitNextRequest> {
  const hdrs = await headers();
  const cook = await cookies();

  const cookieEntries = cook
    .getAll()
    .map((cookie) => [cookie.name, cookie.value]);

  return {
    headers: hdrs,
    cookies: Object.fromEntries(cookieEntries),
  };
}

// TODO: Deduplicate with other packages
function errorMessage(err: unknown): string {
  if (err) {
    if (typeof err === "string") {
      return err;
    }

    if (
      typeof err === "object" &&
      "message" in err &&
      typeof err.message === "string"
    ) {
      return err.message;
    }
  }

  return "Unknown problem";
}

// Type helpers from https://github.com/sindresorhus/type-fest but adjusted for
// our use.
//
// Simplify:
// https://github.com/sindresorhus/type-fest/blob/964466c9d59c711da57a5297ad954c13132a0001/source/simplify.d.ts
// EmptyObject:
// https://github.com/sindresorhus/type-fest/blob/b9723d4785f01f8d2487c09ee5871a1f615781aa/source/empty-object.d.ts
//
// Licensed: MIT License Copyright (c) Sindre Sorhus <sindresorhus@gmail.com>
// (https://sindresorhus.com)
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions: The above copyright
// notice and this permission notice shall be included in all copies or
// substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {};
declare const emptyObjectSymbol: unique symbol;
type WithoutCustomProps = {
  [emptyObjectSymbol]?: never;
};

type PlainObject = {
  [key: string]: unknown;
};

export type RemoteClientOptions = {
  baseUrl?: string;
  timeout?: number;
};

export function createRemoteClient(options?: RemoteClientOptions) {
  // The base URL for the Snipkit API. Will default to the standard production
  // API unless environment variable `SNIPKIT_BASE_URL` is set.
  const url = options?.baseUrl ?? baseUrl(process.env);

  // The timeout for the Snipkit API in milliseconds. This is set to a low value
  // in production so calls fail open.
  const timeout = options?.timeout ?? (isDevelopment(process.env) ? 1000 : 500);

  // Transport is the HTTP client that the client uses to make requests.
  const transport = createTransport(url);

  const sdkStack = "NEXTJS";
  const sdkVersion = "__SNIPKIT_SDK_VERSION__";

  return createClient({
    transport,
    baseUrl: url,
    timeout,
    sdkStack,
    sdkVersion,
  });
}

// Interface of fields that the Snipkit Next.js SDK expects on `Request` objects.
// This is the minimum interface that can be supplied via `NextRequest` and `NextApiRequest`
// in order for only 1 API to exist no matter which runtime the end-user targets
export interface SnipkitNextRequest {
  headers?: Record<string, string | string[] | undefined> | Headers;

  socket?: Partial<{ remoteAddress: string; encrypted: boolean }>;

  info?: Partial<{ remoteAddress: string }>;

  requestContext?: Partial<{ identity: Partial<{ sourceIp: string }> }>;

  method?: string;

  httpVersion?: string;

  url?: string;

  ip?: string;

  nextUrl?: Partial<{ pathname: string; search: string; protocol: string }>;

  cookies?:
    | {
        [Symbol.iterator](): IterableIterator<
          [string, { name: string; value: string }]
        >;
      }
    | Partial<{ [key: string]: string }>;

  clone?: () => Request;
  body?: unknown;
}

function isIterable(val: any): val is Iterable<any> {
  return typeof val?.[Symbol.iterator] === "function";
}

function cookiesToArray(
  cookies?: SnipkitNextRequest["cookies"],
): { name: string; value: string }[] {
  if (typeof cookies === "undefined") {
    return [];
  }

  if (isIterable(cookies)) {
    return Array.from(cookies).map(([_, cookie]) => cookie);
  } else {
    return Object.entries(cookies).map(([name, value]) => ({
      name,
      value: value ?? "",
    }));
  }
}

function cookiesToString(cookies?: SnipkitNextRequest["cookies"]): string {
  // This is essentially the implementation of `RequestCookies#toString` in
  // Next.js but normalized for NextApiRequest cookies object
  return cookiesToArray(cookies)
    .map((v) => `${v.name}=${encodeURIComponent(v.value)}`)
    .join("; ");
}

/**
 * The options used to configure an {@link SnipkitNest} client.
 */
export type SnipkitOptions<
  Rules extends [...Array<Primitive | Product>],
  Characteristics extends readonly string[],
> = Simplify<
  CoreOptions<Rules, Characteristics> & {
    /**
     * One or more IP Address of trusted proxies in front of the application.
     * These addresses will be excluded when Snipkit detects a public IP address.
     */
    proxies?: Array<string>;
  }
>;

/**
 * The SnipkitNext client provides a public `protect()` method to
 * make a decision about how a Next.js request should be handled.
 */
export interface SnipkitNext<Props extends PlainObject> {
  /**
   * Makes a decision about the provided request using your configured rules.
   *
   * Snipkit can protect Next.js routes and pages that are server components (the
   * default). Client components cannot be protected because they run on the
   * client side and do not have access to the request object.
   *
   * Server actions are supported in both Next.js 14 and 15 for all features
   * except sensitive data detection. You need to call a utility function
   * `request()` that accesses the headers we need to analyze the request (see
   * example below).
   *
   * Calls to `protect()` will not throw an error. Snipkit is designed to fail
   * open so that a service issue or misconfiguration does not block all
   * requests. If there is an error condition when processing the rule, Snipkit
   * will label an `"ERROR"` result for that rule and you can check the message
   * property on the rule’s error result for more information.
   *
   * @param {SnipkitNextRequest} request - A `NextApiRequest` or `NextRequest`
   * provided to the request handler.
   * @param props - Any additional properties required for running rules against
   * a request. Whether this is required depends on the rules you've configured.
   * @returns {Promise<SnipkitDecision>} A decision indicating a high-level
   * conclusion and detailed explanations of the decision made by Snipkit. This
   * contains the following properties:
   *
   * - `id` (string) - The unique ID for the request. This can be used to look
   *   up the request in the Snipkit dashboard. It is prefixed with `req_` for
   *   decisions involving the Snipkit cloud API. For decisions taken locally,
   *   the prefix is `lreq_`.
   * - `conclusion` (`"ALLOW" | "DENY" | "CHALLENGE" | "ERROR"`) - The final
   *   conclusion based on evaluating each of the configured rules. If you wish
   *   to accept Snipkit’s recommended action based on the configured rules then
   *   you can use this property.
   * - `reason` (`SnipkitReason`) - An object containing more detailed
   *   information about the conclusion.
   * - `results` (`SnipkitRuleResult[]`) - An array of {@link SnipkitRuleResult} objects
   *   containing the results of each rule that was executed.
   * - `ttl` (number) - The time-to-live for the decision in seconds. This is
   *   the time that the decision is valid for. After this time, the decision
   *   will be re-evaluated. The SDK automatically caches DENY decisions for the
   *   length of the TTL.
   * - `ip` (`SnipkitIpDetails`) - An object containing Snipkit’s analysis of the
   *   client IP address. See
   *   https://docs-snipkit.khulnasoft.com/reference/nextjs#ip-analysis for more
   *   information.
   *
   * @example
   * Inside server components and API route handlers:
   *
   * ```ts
   * // /app/api/hello/route.ts
   * import snipkit, { shield } from "@snipkit/frameworks/snipkit-next";
   * import { NextResponse } from "next/server";
   *
   * const aj = snipkit({
   *   key: process.env.SNIPKIT_KEY!,
   *   rules: [
   *     // Protect against common attacks with Snipkit Shield
   *     shield({
   *      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
   *    }),
   *   ],
   * });
   *
   * export async function POST(req: Request) {
   *   const decision = await aj.protect(req);
   *
   *   if (decision.isDenied()) {
   *     return NextResponse.json({ error: "Forbidden" }, { status: 403 });
   *   }
   *
   *   return NextResponse.json({
   *     message: "Hello world",
   *   });
   * }
   * ```
   *
   * @example
   * Server action which can be passed as a prop to a client component. See https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#client-components
   *
   * ```ts
   * // /app/actions.ts
   * "use server";
   *
   * import snipkit, { detectBot, request } from "@snipkit/frameworks/snipkit-next";
   *
   * const aj = snipkit({
   * key: process.env.SNIPKIT_KEY!, // Get your site key from https://app-snipkit.khulnasoft.com
   * rules: [
   *    detectBot({
   *      mode: "LIVE",
   *      allow: [],
   *    }),
   *  ],
   *});
   *
   * export async function create() {
   *    const req = await request();
   *    const decision = await aj.protect(req);
   *    if (decision.isDenied()) {
   *      throw new Error("Forbidden");
   *    }
   *    // mutate data
   *}
   * ```
   * @link https://docs-snipkit.khulnasoft.com/reference/nextjs#protect
   * @link https://docs-snipkit.khulnasoft.com/reference/nextjs#error-handling
   * @link https://docs-snipkit.khulnasoft.com/reference/nextjs#decision
   * @link https://docs-snipkit.khulnasoft.com/reference/nextjs#server-actions
   * @link https://github.com/snipkit/example-nextjs
   */
  protect(
    request: SnipkitNextRequest,
    // We use this neat trick from https://stackoverflow.com/a/52318137 to make a single spread parameter
    // that is required if the ExtraProps aren't strictly an empty object
    ...props: Props extends WithoutCustomProps ? [] : [Props]
  ): Promise<SnipkitDecision>;

  /**
   * Augments the client with another rule. Useful for varying rules based on
   * criteria in your handler—e.g. different rate limit for logged in users.
   *
   * @param rule The rule to add to this execution.
   * @returns An augmented {@link SnipkitNext} client.
   *
   * @example
   * Create a base client in a separate file which sets a Shield base rule
   * and then use `withRule` to add a bot detection rule in a specific route
   * handler.
   *
   * ```ts
   * // /lib/snipkit.ts
   * import snipkit, { shield } from "@snipkit/frameworks/snipkit-next";
   *
   * // Create a base Snipkit instance for use by each handler
   * export default snipkit({
   *   key: process.env.SNIPKIT_KEY,
   *   rules: [
   *     shield({
   *       mode: "LIVE",
   *     }),
   *   ],
   * });
   * ```
   *
   * ```ts
   * // /app/api/hello/route.ts
   * import snipkit from "@lib/snipkit";
   * import { detectBot, fixedWindow } from "@snipkit/frameworks/snipkit-next";
   *
   * // Add rules to the base Snipkit instance outside of the handler function
   * const aj = snipkit
   *   .withRule(
   *     detectBot({
   *       mode: "LIVE",
   *       allow: [], // blocks all automated clients
   *     }),
   *   )
   *   // You can chain multiple rules, so we'll include a rate limit
   *   .withRule(
   *     fixedWindow({
   *       mode: "LIVE",
   *       max: 100,
   *       window: "60s",
   *     }),
   *   );
   *
   * export async function GET(req: NextRequest) {
   *   const decision = await aj.protect(req);
   *   if (decision.isDenied()) {
   *     throw new Error("Forbidden");
   *   }
   *   // continue with request processing
   * }
   * ```
   * @link https://docs-snipkit.khulnasoft.com/reference/nextjs#ad-hoc-rules
   * @link https://github.com/snipkit/example-nextjs
   */
  withRule<Rule extends Primitive | Product>(
    rule: Rule,
  ): SnipkitNext<Simplify<Props & ExtraProps<Rule>>>;
}

/**
 * Create a new {@link SnipkitNext} client. Always build your initial client
 * outside of a request handler so it persists across requests. If you need to
 * augment a client inside a handler, call the `withRule()` function on the base
 * client.
 *
 * @param options - Snipkit configuration options to apply to all requests.
 */
export default function snipkit<
  const Rules extends (Primitive | Product)[],
  const Characteristics extends readonly string[],
>(
  options: SnipkitOptions<Rules, Characteristics>,
): SnipkitNext<
  Simplify<ExtraProps<Rules> & CharacteristicProps<Characteristics>>
> {
  const client = options.client ?? createRemoteClient();

  const log = options.log
    ? options.log
    : new Logger({
        level: logLevel(process.env),
      });

  const proxies = Array.isArray(options.proxies)
    ? options.proxies.map(parseProxy)
    : undefined;

  if (isDevelopment(process.env)) {
    log.warn(
      "Snipkit will use 127.0.0.1 when missing public IP address in development mode",
    );
  }

  function toSnipkitRequest<Props extends PlainObject>(
    request: SnipkitNextRequest,
    props: Props,
  ): SnipkitRequest<Props> {
    // We construct an SnipkitHeaders to normalize over Headers
    const headers = new SnipkitHeaders(request.headers);

    let ip = findIP(
      {
        ip: request.ip,
        socket: request.socket,
        info: request.info,
        requestContext: request.requestContext,
        headers,
      },
      { platform: platform(process.env), proxies },
    );
    if (ip === "") {
      // If the `ip` is empty but we're in development mode, we default the IP
      // so the request doesn't fail.
      if (isDevelopment(process.env)) {
        ip = "127.0.0.1";
      } else {
        log.warn(
          `Client IP address is missing. If this is a dev environment set the SNIPKIT_ENV env var to "development"`,
        );
      }
    }
    const method = request.method ?? "";
    const host = headers.get("host") ?? "";
    let path = "";
    let query = "";
    let protocol = "";
    // TODO(#36): nextUrl has formatting logic when you `toString` but
    // we don't account for that here
    if (typeof request.nextUrl !== "undefined") {
      path = request.nextUrl.pathname ?? "";
      if (typeof request.nextUrl.search !== "undefined") {
        query = request.nextUrl.search;
      }
      if (typeof request.nextUrl.protocol !== "undefined") {
        protocol = request.nextUrl.protocol;
      }
    } else {
      if (typeof request.socket?.encrypted !== "undefined") {
        protocol = request.socket.encrypted ? "https:" : "http:";
      } else {
        protocol = "http:";
      }
      // Do some very simple validation, but also try/catch around URL parsing
      if (
        typeof request.url !== "undefined" &&
        request.url !== "" &&
        host !== ""
      ) {
        try {
          const url = new URL(request.url, `${protocol}//${host}`);
          path = url.pathname;
          query = url.search;
          protocol = url.protocol;
        } catch {
          // If the parsing above fails, just set the path as whatever url we
          // received.
          path = request.url ?? "";
          log.warn('Unable to parse URL. Using "%s" as `path`.', path);
        }
      } else {
        path = request.url ?? "";
      }
    }
    const cookies = cookiesToString(request.cookies);

    const extra: { [key: string]: string } = {};

    // If we're running on Vercel, we can add some extra information
    if (process.env["VERCEL"]) {
      // Vercel ID https://vercel.com/docs/concepts/edge-network/headers
      extra["vercel-id"] = headers.get("x-vercel-id") ?? "";
      // Vercel deployment URL
      // https://vercel.com/docs/concepts/edge-network/headers
      extra["vercel-deployment-url"] =
        headers.get("x-vercel-deployment-url") ?? "";
      // Vercel git commit SHA
      // https://vercel.com/docs/concepts/projects/environment-variables/system-environment-variables
      extra["vercel-git-commit-sha"] =
        process.env["VERCEL_GIT_COMMIT_SHA"] ?? "";
      extra["vercel-git-commit-sha"] =
        process.env["VERCEL_GIT_COMMIT_SHA"] ?? "";
    }
    return {
      ...props,
      ...extra,
      ip,
      method,
      protocol,
      host,
      path,
      headers,
      cookies,
      query,
    };
  }

  function withClient<const Rules extends (Primitive | Product)[]>(
    aj: Snipkit<ExtraProps<Rules>>,
  ): SnipkitNext<ExtraProps<Rules>> {
    return Object.freeze({
      withRule(rule: Primitive | Product) {
        const client = aj.withRule(rule);
        return withClient(client);
      },
      async protect(
        request: SnipkitNextRequest,
        ...[props]: ExtraProps<Rules> extends WithoutCustomProps
          ? []
          : [ExtraProps<Rules>]
      ): Promise<SnipkitDecision> {
        // TODO(#220): The generic manipulations get really mad here, so we cast
        // Further investigation makes it seem like it has something to do with
        // the definition of `props` in the signature but it's hard to track down
        const req = toSnipkitRequest(request, props ?? {}) as SnipkitRequest<
          ExtraProps<Rules>
        >;

        const getBody = async () => {
          try {
            if (typeof request.clone === "function") {
              const cloned = request.clone();
              // Awaited to throw if it rejects and we'll just return undefined
              const body = await cloned.text();
              return body;
            } else if (typeof request.body === "string") {
              return request.body;
            } else if (
              typeof request.body !== "undefined" &&
              // BigInt cannot be serialized with JSON.stringify
              typeof request.body !== "bigint" &&
              // The body will be null if there was no body with the request.
              // Reference:
              // https://nextjs.org/docs/pages/building-your-application/routing/api-routes#request-helpers
              request.body !== null
            ) {
              return JSON.stringify(request.body);
            } else {
              log.warn("no body available");
              return;
            }
          } catch (e) {
            log.error("failed to get request body: %s", errorMessage(e));
            return;
          }
        };

        return aj.protect({ getBody }, req);
      },
    });
  }

  const aj = core({ ...options, client, log });

  return withClient(aj);
}

/**
 * Protects your Next.js application using Snipkit middleware.
 *
 * @param snipkit An instantiated Snipkit SDK
 * @param middleware Any existing middleware you'd like to be called after
 * Snipkit decides a request is allowed.
 * @returns If the request is allowed, the next middleware or handler will be
 * called. If the request is denied, a `Response` will be returned immediately
 * and the no further middleware or handlers will be called.
 */
export function createMiddleware(
  snipkit: SnipkitNext<WithoutCustomProps>,
  existingMiddleware?: NextMiddleware,
): NextMiddleware {
  return async function middleware(
    request: NextRequest,
    event: NextFetchEvent,
  ): Promise<NextMiddlewareResult> {
    const decision = await snipkit.protect(request);

    if (decision.isDenied()) {
      // TODO(#222): Content type negotiation using `Accept` header
      if (decision.reason.isRateLimit()) {
        return NextResponse.json(
          { code: 429, message: "Too Many Requests" },
          { status: 429 },
        );
      } else {
        return NextResponse.json(
          { code: 403, message: "Forbidden" },
          { status: 403 },
        );
      }
    } else {
      if (typeof existingMiddleware === "function") {
        return existingMiddleware(request, event);
      } else {
        return NextResponse.next();
      }
    }
  };
}

function isNextApiResponse(val: unknown): val is NextApiResponse {
  if (val === null) {
    return false;
  }

  if (typeof val !== "object") {
    return false;
  }

  if (!("status" in val)) {
    return false;
  }

  if (!("json" in val)) {
    return false;
  }

  if (typeof val.status !== "function" || typeof val.json !== "function") {
    return false;
  }

  return true;
}

/**
 * Wraps a Next.js page route, edge middleware, or an API route running on the
 * Edge Runtime.
 *
 * @param snipkit An instantiated Snipkit SDK
 * @param handler The request handler to wrap
 * @returns If the request is allowed, the wrapped `handler` will be called. If
 * the request is denied, a `Response` will be returned based immediately and
 * the wrapped `handler` will never be called.
 */
export function withSnipkit<Args extends [SnipkitNextRequest, ...unknown[]], Res>(
  snipkit: SnipkitNext<WithoutCustomProps>,
  handler: (...args: Args) => Promise<Res>,
) {
  return async (...args: Args) => {
    const request = args[0];
    const response = args[1];
    const decision = await snipkit.protect(request);
    if (decision.isDenied()) {
      if (isNextApiResponse(response)) {
        // TODO(#222): Content type negotiation using `Accept` header
        if (decision.reason.isRateLimit()) {
          return response
            .status(429)
            .json({ code: 429, message: "Too Many Requests" });
        } else {
          return response.status(403).json({ code: 403, message: "Forbidden" });
        }
      } else {
        // TODO(#222): Content type negotiation using `Accept` header
        if (decision.reason.isRateLimit()) {
          return NextResponse.json(
            { code: 429, message: "Too Many Requests" },
            { status: 429 },
          );
        } else {
          return NextResponse.json(
            { code: 403, message: "Forbidden" },
            { status: 403 },
          );
        }
      }
    } else {
      return handler(...args);
    }
  };
}
