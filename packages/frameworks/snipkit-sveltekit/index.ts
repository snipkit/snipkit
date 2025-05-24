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
import { env } from "node:process";

// Re-export all named exports from the generic SDK
export * from "snipkit";

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
  const url = options?.baseUrl ?? baseUrl(env);

  // The timeout for the Snipkit API in milliseconds. This is set to a low value
  // in production so calls fail open.
  const timeout = options?.timeout ?? (isDevelopment(env) ? 1000 : 500);

  // Transport is the HTTP client that the client uses to make requests.
  const transport = createTransport(url);

  const sdkStack = "SVELTEKIT";
  const sdkVersion = "__SNIPKIT_SDK_VERSION__";

  return createClient({
    transport,
    baseUrl: url,
    timeout,
    sdkStack,
    sdkVersion,
  });
}

interface Cookies {
  getAll(opts?: unknown): Array<{ name: string; value: string }>;
}

// Interface of fields that the Snipkit SvelteKit SDK expects on `RequestEvent`
// objects.
export interface SnipkitSvelteKitRequestEvent {
  cookies: Cookies;
  getClientAddress(): string;
  request: Request;
  url: URL;
}

function cookiesToString(
  cookies: Array<{ name: string; value: string }> = [],
): string {
  return cookies
    .map((v) => `${v.name}=${encodeURIComponent(v.value)}`)
    .join("; ");
}

/**
 * The options used to configure an {@link SnipkitSvelteKit} client.
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
 * The SnipkitSvelteKit client provides a public `protect()` method to
 * make a decision about how a SvelteKit request should be handled.
 */
export interface SnipkitSvelteKit<Props extends PlainObject> {
  /**
   * Runs a `RequestEvent` through the configured protections. The request is
   * analyzed and then a decision made on whether to allow, deny, or challenge
   * the request.
   *
   * @param event - A `RequestEvent` provided to the handler.
   * @param props - Additonal properties required for running rules against a request.
   * @returns An {@link SnipkitDecision} indicating Snipkit's decision about the request.
   */
  protect(
    event: SnipkitSvelteKitRequestEvent,
    // We use this neat trick from https://stackoverflow.com/a/52318137 to make a single spread parameter
    // that is required if the ExtraProps aren't strictly an empty object
    ...props: Props extends WithoutCustomProps ? [] : [Props]
  ): Promise<SnipkitDecision>;

  /**
   * Augments the client with another rule. Useful for varying rules based on
   * criteria in your handler—e.g. different rate limit for logged in users.
   *
   * @param rule The rule to add to this execution.
   * @returns An augmented {@link SnipkitSvelteKit} client.
   */
  withRule<Rule extends Primitive | Product>(
    rule: Rule,
  ): SnipkitSvelteKit<Simplify<Props & ExtraProps<Rule>>>;
}

/**
 * Create a new {@link SnipkitSvelteKit} client. Always build your initial client
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
): SnipkitSvelteKit<
  Simplify<ExtraProps<Rules> & CharacteristicProps<Characteristics>>
> {
  const client = options.client ?? createRemoteClient();

  const log = options.log
    ? options.log
    : new Logger({
        level: logLevel(env),
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
    event: SnipkitSvelteKitRequestEvent,
    props: Props,
  ): SnipkitRequest<Props> {
    const cookies = cookiesToString(event.cookies.getAll());

    // We construct an SnipkitHeaders to normalize over Headers
    const headers = new SnipkitHeaders(event.request.headers);

    let ip = findIP(
      {
        ip: event.getClientAddress(),
        headers,
      },
      { platform: platform(env), proxies },
    );
    if (ip === "") {
      // If the `ip` is empty but we're in development mode, we default the IP
      // so the request doesn't fail.
      if (isDevelopment(env)) {
        ip = "127.0.0.1";
      } else {
        log.warn(
          `Client IP address is missing. If this is a dev environment set the SNIPKIT_ENV env var to "development"`,
        );
      }
    }
    const method = event.request.method;
    const host = headers.get("host") ?? "";
    const path = event.url.pathname;
    const query = event.url.search;
    const protocol = event.url.protocol;

    return {
      ...props,
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
  ): SnipkitSvelteKit<ExtraProps<Rules>> {
    return Object.freeze({
      withRule(rule: Primitive | Product) {
        const client = aj.withRule(rule);
        return withClient(client);
      },
      async protect(
        request: SnipkitSvelteKitRequestEvent,
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
            const clonedRequest = request.request.clone();
            // Awaited to throw if it rejects and we'll just return undefined
            const body = await clonedRequest.text();
            return body;
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
