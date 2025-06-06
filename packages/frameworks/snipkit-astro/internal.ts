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
import findIP, { parseProxy } from "@snipkit/ip";
import SnipkitHeaders from "@snipkit/headers";
import { baseUrl, isDevelopment, logLevel, platform } from "@snipkit/env";
import { Logger } from "@snipkit/logger";
import { createClient } from "@snipkit/protocol";
import { createTransport } from "@snipkit/transport";

import {
  SNIPKIT_BASE_URL,
  SNIPKIT_ENV,
  SNIPKIT_KEY,
  SNIPKIT_LOG_LEVEL,
  FLY_APP_NAME,
  VERCEL,
} from "astro:env/server";

// We use a middleware to store the IP address on a `Request` with this symbol.
// This is due to Astro inconsistently using `Symbol.for("astro.clientAddress")`
// to store the client address and not exporting it from their module.
const ipSymbol = Symbol.for("snipkit.ip");

const env = {
  SNIPKIT_BASE_URL,
  SNIPKIT_ENV,
  SNIPKIT_KEY,
  SNIPKIT_LOG_LEVEL,
  FLY_APP_NAME,
  VERCEL,
  // `MODE` is only set on `import.meta.env`.
  MODE: import.meta.env.MODE,
};

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

  const sdkStack = "ASTRO";
  const sdkVersion = "__SNIPKIT_SDK_VERSION__";

  return createClient({
    transport,
    baseUrl: url,
    timeout,
    sdkStack,
    sdkVersion,
  });
}

/**
 * The options used to configure an {@link SnipkitAstro} client.
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
 * The SnipkitAstro client provides a public `protect()` method to
 * make a decision about how an Astro request should be handled.
 */
export interface SnipkitAstro<Props extends PlainObject> {
  /**
   * Runs a request through the configured protections. The request is
   * analyzed and then a decision made on whether to allow, deny, or challenge
   * the request.
   *
   * @param request - A `Request` provided to the fetch handler.
   * @param props - Additonal properties required for running rules against a request.
   * @returns An {@link SnipkitDecision} indicating Snipkit's decision about the request.
   */
  protect(
    request: Request,
    // We use this neat trick from https://stackoverflow.com/a/52318137 to make a single spread parameter
    // that is required if the ExtraProps aren't strictly an empty object
    ...props: Props extends WithoutCustomProps ? [] : [Props]
  ): Promise<SnipkitDecision>;

  /**
   * Augments the client with another rule. Useful for varying rules based on
   * criteria in your handler—e.g. different rate limit for logged in users.
   *
   * @param rule The rule to add to this execution.
   * @returns An augmented {@link SnipkitAstro} client.
   */
  withRule<Rule extends Primitive | Product>(
    rule: Rule,
  ): SnipkitAstro<Simplify<Props & ExtraProps<Rule>>>;
}

/**
 * Create a new {@link SnipkitAstro} client. Always build your initial client
 * outside of a request handler so it persists across requests. If you need to
 * augment a client inside a handler, call the `withRule()` function on the base
 * client.
 *
 * @param options - Snipkit configuration options to apply to all requests.
 */
export function createSnipkitClient<
  const Rules extends (Primitive | Product)[],
  const Characteristics extends readonly string[],
>(
  options: SnipkitOptions<Rules, Characteristics>,
): SnipkitAstro<
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
    request: Request,
    props: Props,
  ): SnipkitRequest<Props> {
    const clientAddress = Reflect.get(request, ipSymbol);
    if (!clientAddress) {
      throw new Error("`protect()` cannot be used in prerendered pages");
    }

    const cookies = request.headers.get("cookie") ?? undefined;

    // We construct an SnipkitHeaders to normalize over Headers
    const headers = new SnipkitHeaders(request.headers);

    const url = new URL(request.url);
    let ip = findIP(
      {
        ip: clientAddress,
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

    return {
      ...props,
      ip,
      method: request.method,
      protocol: url.protocol,
      host: url.host,
      path: url.pathname,
      headers,
      cookies,
      query: url.search,
    };
  }

  function withClient<const Rules extends (Primitive | Product)[]>(
    aj: Snipkit<ExtraProps<Rules>>,
  ): SnipkitAstro<ExtraProps<Rules>> {
    return Object.freeze({
      withRule(rule: Primitive | Product) {
        const client = aj.withRule(rule);
        return withClient(client);
      },
      async protect(
        request: Request,
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
            const clonedRequest = request.clone();
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
