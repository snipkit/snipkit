import type {
  SnipkitContext,
  SnipkitEmailRule,
  SnipkitBotRule,
  SnipkitRule,
  SnipkitMode,
  SnipkitRequestDetails,
  SnipkitTokenBucketRateLimitRule,
  SnipkitFixedWindowRateLimitRule,
  SnipkitSlidingWindowRateLimitRule,
  SnipkitShieldRule,
  SnipkitLogger,
  SnipkitSensitiveInfoRule,
  SnipkitIdentifiedEntity,
  SnipkitWellKnownBot,
  SnipkitBotCategory,
  SnipkitEmailType,
  SnipkitSensitiveInfoType,
  SnipkitRateLimitRule,
} from "@snipkit/protocol";
import {
  SnipkitBotReason,
  SnipkitEmailReason,
  SnipkitErrorReason,
  SnipkitReason,
  SnipkitRuleResult,
  SnipkitSensitiveInfoReason,
  SnipkitDecision,
  SnipkitDenyDecision,
  SnipkitErrorDecision,
  SnipkitShieldReason,
  SnipkitRateLimitReason,
} from "@snipkit/protocol";
import type { Client } from "@snipkit/protocol/client.js";
import * as analyze from "@snipkit/analyze";
import type {
  DetectedSensitiveInfoEntity,
  SensitiveInfoEntity,
  BotConfig,
  EmailValidationConfig,
} from "@snipkit/analyze";
import * as duration from "@snipkit/duration";
import SnipkitHeaders from "@snipkit/headers";
import { runtime } from "@snipkit/runtime";
import * as hasher from "@snipkit/stable-hash";

export * from "@snipkit/protocol";

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(msg);
  }
}

function nowInSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

class Cache<T> {
  expires: Map<string, number>;
  data: Map<string, T>;

  constructor() {
    this.expires = new Map();
    this.data = new Map();
  }

  get(key: string) {
    const ttl = this.ttl(key);
    if (ttl > 0) {
      return this.data.get(key);
    } else {
      // Cleanup if expired
      this.expires.delete(key);
      this.data.delete(key);
    }
  }

  set(key: string, value: T, expiresAt: number) {
    this.expires.set(key, expiresAt);
    this.data.set(key, value);
  }

  ttl(key: string): number {
    const now = nowInSeconds();
    const expiresAt = this.expires.get(key) ?? now;
    return expiresAt - now;
  }
}

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
// UnionToIntersection:
// https://github.com/sindresorhus/type-fest/blob/017bf38ebb52df37c297324d97bcc693ec22e920/source/union-to-intersection.d.ts
// IsNever:
// https://github.com/sindresorhus/type-fest/blob/e02f228f6391bb2b26c32a55dfe1e3aa2386d515/source/primitive.d.ts
// LiteralCheck & IsStringLiteral:
// https://github.com/sindresorhus/type-fest/blob/e02f228f6391bb2b26c32a55dfe1e3aa2386d515/source/is-literal.d.ts
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
type UnionToIntersection<Union> =
  // `extends unknown` is always going to be the case and is used to convert the
  // `Union` into a [distributive conditional
  // type](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types).
  (
    Union extends unknown
      ? // The union type is used as the only argument to a function since the union
        // of function arguments is an intersection.
        (distributedUnion: Union) => void
      : // This won't happen.
        never
  ) extends // Infer the `Intersection` type since TypeScript represents the positional
  // arguments of unions of functions as an intersection of the union.
  (mergedIntersection: infer Intersection) => void
    ? // The `& Union` is to allow indexing by the resulting type
      Intersection & Union
    : never;
type IsNever<T> = [T] extends [never] ? true : false;
type LiteralCheck<
  T,
  LiteralType extends
    | null
    | undefined
    | string
    | number
    | boolean
    | symbol
    | bigint,
> =
  IsNever<T> extends false // Must be wider than `never`
    ? [T] extends [LiteralType] // Must be narrower than `LiteralType`
      ? [LiteralType] extends [T] // Cannot be wider than `LiteralType`
        ? false
        : true
      : false
    : false;
type IsStringLiteral<T> = LiteralCheck<T, string>;

const knownFields = [
  "ip",
  "method",
  "protocol",
  "host",
  "path",
  "headers",
  "body",
  "email",
  "cookies",
  "query",
];

function isUnknownRequestProperty(key: string) {
  return !knownFields.includes(key);
}

function isEmailType(type: string): type is SnipkitEmailType {
  return (
    type === "FREE" ||
    type === "DISPOSABLE" ||
    type === "NO_MX_RECORDS" ||
    type === "NO_GRAVATAR" ||
    type === "INVALID"
  );
}

class Performance {
  log: SnipkitLogger;

  constructor(logger: SnipkitLogger) {
    this.log = logger;
  }

  // TODO(#2020): We should no-op this if loglevel is not `debug` to do less work
  measure(label: string) {
    const start = performance.now();
    return () => {
      const end = performance.now();
      const diff = end - start;
      this.log.debug("LATENCY %s: %sms", label, diff.toFixed(3));
    };
  }
}

function toString(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return `${value}`;
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  return "<unsupported value>";
}

// This is the Symbol that Vercel defines in their infrastructure to access the
// Context (where available). The Context can contain the `waitUntil` function.
// https://github.com/vercel/vercel/blob/930d7fb892dc26f240f2b950d963931c45e1e661/packages/functions/src/get-context.ts#L6
const SYMBOL_FOR_REQ_CONTEXT = Symbol.for("@vercel/request-context");

type WaitUntil = (promise: Promise<unknown>) => void;

function lookupWaitUntil(): WaitUntil | undefined {
  const fromSymbol: typeof globalThis & {
    [SYMBOL_FOR_REQ_CONTEXT]?: unknown;
  } = globalThis;
  if (
    typeof fromSymbol[SYMBOL_FOR_REQ_CONTEXT] === "object" &&
    fromSymbol[SYMBOL_FOR_REQ_CONTEXT] !== null &&
    "get" in fromSymbol[SYMBOL_FOR_REQ_CONTEXT] &&
    typeof fromSymbol[SYMBOL_FOR_REQ_CONTEXT].get === "function"
  ) {
    const vercelCtx = fromSymbol[SYMBOL_FOR_REQ_CONTEXT].get();
    if (
      typeof vercelCtx === "object" &&
      vercelCtx !== null &&
      "waitUntil" in vercelCtx &&
      typeof vercelCtx.waitUntil === "function"
    ) {
      return vercelCtx.waitUntil;
    }
  }
}

function toAnalyzeRequest(request: Partial<SnipkitRequestDetails>) {
  const headers: Record<string, string> = {};
  if (typeof request.headers !== "undefined") {
    for (const [key, value] of request.headers.entries()) {
      headers[key] = value;
    }
  }

  return {
    ...request,
    headers,
  };
}

function extraProps<Props extends PlainObject>(
  details: SnipkitRequest<Props>,
): Record<string, string> {
  const extra: Map<string, string> = new Map();
  for (const [key, value] of Object.entries(details)) {
    if (isUnknownRequestProperty(key)) {
      extra.set(key, toString(value));
    }
  }
  return Object.fromEntries(extra.entries());
}

type Validator = (key: string, value: unknown) => void;

type ValidationSchema = {
  key: string;
  required: boolean;
  validate: Validator;
};

function createTypeValidator(
  ...types: Array<
    // These are the types we can compare via `typeof`
    | "string"
    | "number"
    | "bigint"
    | "boolean"
    | "symbol"
    | "undefined"
    | "object"
    | "function"
  >
): Validator {
  return (key, value) => {
    const typeOfValue = typeof value;
    if (!types.includes(typeOfValue)) {
      if (types.length === 1) {
        throw new Error(`invalid type for \`${key}\` - expected ${types[0]}`);
      } else {
        throw new Error(
          `invalid type for \`${key}\` - expected one of ${types.join(", ")}`,
        );
      }
    } else {
      return false;
    }
  };
}

function createValueValidator(
  // This uses types to ensure we have at least 2 values
  ...values: [string, string, ...string[]]
): Validator {
  return (key, value) => {
    // We cast the values to unknown because the optionValue isn't known but
    // we only want to use `values` on string enumerations
    if (!(values as unknown[]).includes(value)) {
      throw new Error(
        `invalid value for \`${key}\` - expected one of ${values.map((value) => `'${value}'`).join(", ")}`,
      );
    }
  };
}

function createArrayValidator(validate: Validator): Validator {
  return (key, value) => {
    if (Array.isArray(value)) {
      for (const [idx, item] of value.entries()) {
        validate(`${key}[${idx}]`, item);
      }
    } else {
      throw new Error(`invalid type for \`${key}\` - expected an array`);
    }
  };
}

function createValidator({
  rule,
  validations,
}: {
  rule: string;
  validations: ValidationSchema[];
}) {
  return (options: Record<string, unknown>) => {
    for (const { key, validate, required } of validations) {
      if (required && !Object.hasOwn(options, key)) {
        throw new Error(`\`${rule}\` options error: \`${key}\` is required`);
      }

      const value = options[key];

      // The `required` flag is checked above, so these should only be validated
      // if the value is not undefined.
      if (typeof value !== "undefined") {
        try {
          validate(key, value);
        } catch (err) {
          throw new Error(`\`${rule}\` options error: ${errorMessage(err)}`);
        }
      }
    }
  };
}

const validateString = createTypeValidator("string");
const validateNumber = createTypeValidator("number");
const validateBoolean = createTypeValidator("boolean");
const validateFunction = createTypeValidator("function");
const validateStringOrNumber = createTypeValidator("string", "number");
const validateStringArray = createArrayValidator(validateString);
const validateMode = createValueValidator("LIVE", "DRY_RUN");
const validateEmailTypes = createArrayValidator(
  createValueValidator(
    "DISPOSABLE",
    "FREE",
    "NO_MX_RECORDS",
    "NO_GRAVATAR",
    "INVALID",
  ),
);

const validateTokenBucketOptions = createValidator({
  rule: "tokenBucket",
  validations: [
    {
      key: "mode",
      required: false,
      validate: validateMode,
    },
    {
      key: "characteristics",
      validate: validateStringArray,
      required: false,
    },
    { key: "refillRate", required: true, validate: validateNumber },
    { key: "interval", required: true, validate: validateStringOrNumber },
    { key: "capacity", required: true, validate: validateNumber },
  ],
});

const validateFixedWindowOptions = createValidator({
  rule: "fixedWindow",
  validations: [
    { key: "mode", required: false, validate: validateMode },
    {
      key: "characteristics",
      validate: validateStringArray,
      required: false,
    },
    { key: "max", required: true, validate: validateNumber },
    { key: "window", required: true, validate: validateStringOrNumber },
  ],
});

const validateSlidingWindowOptions = createValidator({
  rule: "slidingWindow",
  validations: [
    { key: "mode", required: false, validate: validateMode },
    {
      key: "characteristics",
      validate: validateStringArray,
      required: false,
    },
    { key: "max", required: true, validate: validateNumber },
    { key: "interval", required: true, validate: validateStringOrNumber },
  ],
});

const validateSensitiveInfoOptions = createValidator({
  rule: "sensitiveInfo",
  validations: [
    { key: "mode", required: false, validate: validateMode },
    { key: "allow", required: false, validate: validateStringArray },
    { key: "deny", required: false, validate: validateStringArray },
    { key: "contextWindowSize", required: false, validate: validateNumber },
    { key: "detect", required: false, validate: validateFunction },
  ],
});

const validateEmailOptions = createValidator({
  rule: "validateEmail",
  validations: [
    { key: "mode", required: false, validate: validateMode },
    { key: "block", required: false, validate: validateEmailTypes },
    { key: "allow", required: false, validate: validateEmailTypes },
    { key: "deny", required: false, validate: validateEmailTypes },
    {
      key: "requireTopLevelDomain",
      required: false,
      validate: validateBoolean,
    },
    { key: "allowDomainLiteral", required: false, validate: validateBoolean },
  ],
});

const validateBotOptions = createValidator({
  rule: "detectBot",
  validations: [
    { key: "mode", required: false, validate: validateMode },
    { key: "allow", required: false, validate: validateStringArray },
    { key: "deny", required: false, validate: validateStringArray },
  ],
});

const validateShieldOptions = createValidator({
  rule: "shield",
  validations: [{ key: "mode", required: false, validate: validateMode }],
});

export type TokenBucketRateLimitOptions<
  Characteristics extends readonly string[],
> = {
  mode?: SnipkitMode;
  characteristics?: Characteristics;
  refillRate: number;
  interval: string | number;
  capacity: number;
};

export type FixedWindowRateLimitOptions<
  Characteristics extends readonly string[],
> = {
  mode?: SnipkitMode;
  characteristics?: Characteristics;
  window: string | number;
  max: number;
};

export type SlidingWindowRateLimitOptions<
  Characteristics extends readonly string[],
> = {
  mode?: SnipkitMode;
  characteristics?: Characteristics;
  interval: string | number;
  max: number;
};

export type BotOptionsAllow = {
  mode?: SnipkitMode;
  allow: Array<SnipkitWellKnownBot | SnipkitBotCategory>;
  deny?: never;
};

export type BotOptionsDeny = {
  mode?: SnipkitMode;
  allow?: never;
  deny: Array<SnipkitWellKnownBot | SnipkitBotCategory>;
};

export type BotOptions = BotOptionsAllow | BotOptionsDeny;

export type EmailOptionsAllow = {
  mode?: SnipkitMode;
  allow: SnipkitEmailType[];
  block?: never;
  deny?: never;
  requireTopLevelDomain?: boolean;
  allowDomainLiteral?: boolean;
};

export type EmailOptionsDeny = {
  mode?: SnipkitMode;
  allow?: never;
  block?: never;
  deny: SnipkitEmailType[];
  requireTopLevelDomain?: boolean;
  allowDomainLiteral?: boolean;
};

type EmailOptionsBlock = {
  mode?: SnipkitMode;
  allow?: never;
  /** @deprecated use `deny` instead */
  block: SnipkitEmailType[];
  deny?: never;
  requireTopLevelDomain?: boolean;
  allowDomainLiteral?: boolean;
};

export type EmailOptions =
  | EmailOptionsAllow
  | EmailOptionsDeny
  | EmailOptionsBlock;

type DetectSensitiveInfoEntities<T> = (
  tokens: string[],
) => Array<SnipkitSensitiveInfoType | T | undefined>;

type ValidEntities<Detect> = Array<
  // Via https://www.reddit.com/r/typescript/comments/17up72w/comment/k958cb0/
  // Conditional types distribute over unions. If you have ((string | undefined)
  // extends undefined ? 1 : 0) it is evaluated separately for each member of
  // the union, then union-ed together again. The result is (string extends
  // undefined ? 1 : 0) | (undefined extends undefined ? 1 : 0) which simplifies
  // to 0 | 1
  undefined extends Detect
    ? SnipkitSensitiveInfoType
    : Detect extends DetectSensitiveInfoEntities<infer CustomEntities>
      ? SnipkitSensitiveInfoType | CustomEntities
      : never
>;

export type SensitiveInfoOptionsAllow<Detect> = {
  allow: ValidEntities<Detect>;
  deny?: never;
  contextWindowSize?: number;
  mode?: SnipkitMode;
  detect?: Detect;
};

export type SensitiveInfoOptionsDeny<Detect> = {
  allow?: never;
  deny: ValidEntities<Detect>;
  contextWindowSize?: number;
  mode?: SnipkitMode;
  detect?: Detect;
};

export type SensitiveInfoOptions<Detect> =
  | SensitiveInfoOptionsAllow<Detect>
  | SensitiveInfoOptionsDeny<Detect>;

const Priority = {
  SensitiveInfo: 1,
  Shield: 2,
  RateLimit: 3,
  BotDetection: 4,
  EmailValidation: 5,
};

type PlainObject = { [key: string]: unknown };

// Primitives and Products external names for Rules even though they are defined
// the same.
// See ExtraProps below for further explanation on why we define them like this.
export type Primitive<Props extends PlainObject = {}> = [SnipkitRule<Props>];
export type Product<Props extends PlainObject = {}> = SnipkitRule<Props>[];

// User-defined characteristics alter the required props of an SnipkitRequest
// Note: If a user doesn't provide the object literal to our primitives
// directly, we fallback to no required props. They can opt-in by adding the
// `as const` suffix to the characteristics array.
type PropsForCharacteristic<T> =
  IsStringLiteral<T> extends true
    ? T extends
        | "ip.src"
        | "http.host"
        | "http.method"
        | "http.request.uri.path"
        | `http.request.headers["${string}"]`
        | `http.request.cookie["${string}"]`
        | `http.request.uri.args["${string}"]`
      ? {}
      : T extends string
        ? Record<T, string | number | boolean>
        : never
    : {};
export type CharacteristicProps<Characteristics extends readonly string[]> =
  UnionToIntersection<PropsForCharacteristic<Characteristics[number]>>;
// Rules can specify they require specific props on an SnipkitRequest
type PropsForRule<R> = R extends SnipkitRule<infer Props> ? Props : {};
// We theoretically support an arbitrary amount of rule flattening,
// but one level seems to be easiest; however, this puts a constraint of
// the definition of `Product` such that they need to spread each `Primitive`
// they are re-exporting.
export type ExtraProps<Rules> = Rules extends []
  ? {}
  : Rules extends SnipkitRule[][]
    ? UnionToIntersection<PropsForRule<Rules[number][number]>>
    : Rules extends SnipkitRule[]
      ? UnionToIntersection<PropsForRule<Rules[number]>>
      : never;

/**
 * Additional context that can be provided by adapters.
 *
 * Among other things, this could include the Snipkit API Key if it were only
 * available in a runtime handler or IP details provided by a platform.
 */
export type SnipkitAdapterContext = {
  [key: string]: unknown;
  getBody(): Promise<string | undefined>;
  waitUntil?: (promise: Promise<unknown>) => void;
};

/**
 * @property {string} ip - The IP address of the client.
 * @property {string} method - The HTTP method of the request.
 * @property {string} protocol - The protocol of the request.
 * @property {string} host - The host of the request.
 * @property {string} path - The path of the request.
 * @property {Headers} headers - The headers of the request.
 * @property {string} cookies - The string representing semicolon-separated Cookies for a request.
 * @property {string} query - The `?`-prefixed string representing the Query for a request. Commonly referred to as a "querystring".
 * @property {string} email - An email address related to the request.
 * @property ...extra - Extra data that might be useful for Snipkit. For example, requested tokens are specified as the `requested` property.
 */
export type SnipkitRequest<Props extends PlainObject> = Simplify<
  {
    [key: string]: unknown;
    ip?: string;
    method?: string;
    protocol?: string;
    host?: string;
    path?: string;
    headers?: Headers | Record<string, string | string[] | undefined>;
    cookies?: string;
    query?: string;
  } & Props
>;

function isRateLimitRule<Props extends PlainObject>(
  rule: SnipkitRule<Props>,
): rule is SnipkitRateLimitRule<Props> {
  return rule.type === "RATE_LIMIT";
}

/**
 * Snipkit token bucket rate limiting rule. Applying this rule sets a token
 * bucket rate limit.
 *
 * This algorithm is based on a bucket filled with a specific number of tokens.
 * Each request withdraws some amount of tokens from the bucket and the bucket
 * is refilled at a fixed rate. Once the bucket is empty, the client is blocked
 * until the bucket refills.
 *
 * This algorithm is useful when you want to allow clients to make a burst of
 * requests and then still be able to make requests at a slower rate.
 *
 * @param {TokenBucketRateLimitOptions} options - The options for the token
 * bucket rate limiting rule.
 * @param {SnipkitMode} options.mode - The block mode of the rule, either
 * `"LIVE"` or `"DRY_RUN"`. `"LIVE"` will block requests when the rate limit is
 * exceeded, and `"DRY_RUN"` will allow all requests while still providing
 * access to the rule results. Defaults to `"DRY_RUN"` if not specified.
 * @param {number} options.refillRate - The number of tokens to add to the
 * bucket at each interval. For example, if you set the interval to 60 and the
 * refill rate to 10, the bucket will refill 10 tokens every 60 seconds.
 * @param {string | number} options.interval - The time interval for the refill
 * rate. This can be a string like `"60s"` for 60 seconds, `"1h45m"` for 1 hour
 * and 45 minutes, or a number like `60` for 60 seconds. Valid string time units
 * are:
 * - `s` for seconds.
 * - `m` for minutes.
 * - `h` for hours.
 * - `d` for days.
 * @param {number} options.capacity - The maximum number of tokens the bucket
 * can hold. The bucket starts at full capacity and will refill until it hits
 * the capacity.
 * @returns {Primitive} The token bucket rule to provide to the SDK in the
 * `rules` option.
 *
 * @example
 * ```ts
 * tokenBucket({ mode: "LIVE", refillRate: 10, interval: "60s", capacity: 100 });
 * ```
 * @example
 * ```ts
 * const aj = snipkit({
 *   key: process.env.SNIPKIT_KEY,
 *   rules: [
 *     tokenBucket({
 *       mode: "LIVE",
 *       refillRate: 10,
 *       interval: "60s",
 *       capacity: 100,
 *     })
 *   ],
 * });
 * ```
 * @link https://docs-snipkit.khulnasoft.com/rate-limiting/concepts
 * @link https://docs-snipkit.khulnasoft.com/rate-limiting/algorithms#token-bucket
 * @link https://docs-snipkit.khulnasoft.com/rate-limiting/reference
 */
export function tokenBucket<
  const Characteristics extends readonly string[] = [],
>(
  options: TokenBucketRateLimitOptions<Characteristics>,
): Primitive<
  Simplify<
    UnionToIntersection<
      { requested: number } | CharacteristicProps<Characteristics>
    >
  >
> {
  validateTokenBucketOptions(options);

  const type = "RATE_LIMIT";
  const version = 0;
  const mode = options.mode === "LIVE" ? "LIVE" : "DRY_RUN";
  // TODO(#4203): Rules need to receive characteristics via options while
  // falling back to characteristics defined on the client
  const characteristics = Array.isArray(options.characteristics)
    ? options.characteristics
    : undefined;

  const refillRate = options.refillRate;
  const interval = duration.parse(options.interval);
  const capacity = options.capacity;

  const id = hasher.hash(
    hasher.string("type", type),
    hasher.uint32("version", version),
    hasher.string("mode", mode),
    hasher.string("algorithm", "TOKEN_BUCKET"),
    hasher.stringSliceOrdered("characteristics", characteristics ?? []),
    // Match is deprecated so it is always an empty string in the newest SDKs
    hasher.string("match", ""),
    hasher.uint32("refillRate", refillRate),
    hasher.uint32("interval", interval),
    hasher.uint32("capacity", capacity),
  );

  const rule: SnipkitTokenBucketRateLimitRule<
    UnionToIntersection<
      { requested: number } | CharacteristicProps<Characteristics>
    >
  > = {
    type,
    version,
    priority: Priority.RateLimit,
    mode,
    characteristics,
    algorithm: "TOKEN_BUCKET",
    refillRate,
    interval,
    capacity,
    validate() {},
    async protect(ctx: SnipkitContext) {
      const ruleId = await id;

      const { fingerprint } = ctx;

      return new SnipkitRuleResult({
        ruleId,
        fingerprint,
        ttl: 0,
        state: "NOT_RUN",
        conclusion: "ALLOW",
        reason: new SnipkitRateLimitReason({
          max: 0,
          remaining: 0,
          reset: 0,
          window: 0,
        }),
      });
    },
  };

  return [rule];
}

/**
 * Snipkit fixed window rate limiting rule. Applying this rule sets a fixed
 * window rate limit which tracks the number of requests made by a client over a
 * fixed time window.
 *
 * This is the simplest algorithm. It tracks the number of requests made by a
 * client over a fixed time window e.g. 60 seconds. If the client exceeds the
 * limit, they are blocked until the window expires.
 *
 * This algorithm is useful when you want to apply a simple fixed limit in a
 * fixed time window. For example, a simple limit on the total number of
 * requests a client can make. However, it can be susceptible to the stampede
 * problem where a client makes a burst of requests at the start of a window and
 * then is blocked for the rest of the window. The sliding window algorithm can
 * be used to avoid this.
 *
 * @param {FixedWindowRateLimitOptions} options - The options for the fixed
 * window rate limiting rule.
 * @param {SnipkitMode} options.mode - The block mode of the rule, either
 * `"LIVE"` or `"DRY_RUN"`. `"LIVE"` will block requests when the rate limit is
 * exceeded, and `"DRY_RUN"` will allow all requests while still providing
 * access to the rule results. Defaults to `"DRY_RUN"` if not specified.
 * @param {string | number} options.window - The fixed time window. This can be
 * a string like `"60s"` for 60 seconds, `"1h45m"` for 1 hour and 45 minutes, or
 * a number like `60` for 60 seconds. Valid string time units are:
 * - `s` for seconds.
 * - `m` for minutes.
 * - `h` for hours.
 * - `d` for days.
 * @param {number} options.max - The maximum number of requests allowed in the
 * fixed time window.
 * @returns {Primitive} The fixed window rule to provide to the SDK in the
 * `rules` option.
 *
 * @example
 * ```ts
 * fixedWindow({ mode: "LIVE", window: "60s", max: 100 });
 * ```
 * @example
 * ```ts
 * const aj = snipkit({
 *    key: process.env.SNIPKIT_KEY,
 *   rules: [
 *     fixedWindow({
 *       mode: "LIVE",
 *       window: "60s",
 *       max: 100,
 *     })
 *   ],
 * });
 * ```
 * @link https://docs-snipkit.khulnasoft.com/rate-limiting/concepts
 * @link https://docs-snipkit.khulnasoft.com/rate-limiting/algorithms#fixed-window
 * @link https://docs-snipkit.khulnasoft.com/rate-limiting/reference
 */
export function fixedWindow<
  const Characteristics extends readonly string[] = [],
>(
  options: FixedWindowRateLimitOptions<Characteristics>,
): Primitive<Simplify<CharacteristicProps<Characteristics>>> {
  validateFixedWindowOptions(options);

  const type = "RATE_LIMIT";
  const version = 0;
  const mode = options.mode === "LIVE" ? "LIVE" : "DRY_RUN";
  const characteristics = Array.isArray(options.characteristics)
    ? options.characteristics
    : undefined;

  const max = options.max;
  const window = duration.parse(options.window);

  const id = hasher.hash(
    hasher.string("type", type),
    hasher.uint32("version", version),
    hasher.string("mode", mode),
    hasher.string("algorithm", "FIXED_WINDOW"),
    // TODO(#4203): Rules need to receive characteristics via options while
    // falling back to characteristics defined on the client
    hasher.stringSliceOrdered("characteristics", characteristics ?? []),
    // Match is deprecated so it is always an empty string in the newest SDKs
    hasher.string("match", ""),
    hasher.uint32("max", max),
    hasher.uint32("window", window),
  );

  const rule: SnipkitFixedWindowRateLimitRule<{}> = {
    type,
    version,
    priority: Priority.RateLimit,
    mode,
    characteristics,
    algorithm: "FIXED_WINDOW",
    max,
    window,
    validate() {},
    async protect(ctx: SnipkitContext) {
      const ruleId = await id;

      const { fingerprint } = ctx;

      return new SnipkitRuleResult({
        ruleId,
        fingerprint,
        ttl: 0,
        state: "NOT_RUN",
        conclusion: "ALLOW",
        reason: new SnipkitRateLimitReason({
          max: 0,
          remaining: 0,
          reset: 0,
          window: 0,
        }),
      });
    },
  };

  return [rule];
}

/**
 * Snipkit sliding window rate limiting rule. Applying this rule sets a sliding
 * window rate limit which tracks the number of requests made by a client over a
 * sliding window so that the window moves with time.
 *
 * This algorithm is useful to avoid the stampede problem of the fixed window.
 * It provides smoother rate limiting over time and can prevent a client from
 * making a burst of requests at the start of a window and then being blocked
 * for the rest of the window.
 *
 * @param {SlidingWindowRateLimitOptions} options - The options for the sliding
 * window rate limiting rule.
 * @param {SnipkitMode} options.mode - The block mode of the rule, either
 * `"LIVE"` or `"DRY_RUN"`. `"LIVE"` will block requests when the rate limit is
 * exceeded, and `"DRY_RUN"` will allow all requests while still providing
 * access to the rule results. Defaults to `"DRY_RUN"` if not specified.
 * @param {string | number} options.interval - The time interval for the rate
 * limit. This can be a string like `"60s"` for 60 seconds, `"1h45m"` for 1 hour
 * and 45 minutes, or a number like `60` for 60 seconds. Valid string time units
 * are:
 * - `s` for seconds.
 * - `m` for minutes.
 * - `h` for hours.
 * - `d` for days.
 * @param {number} options.max - The maximum number of requests allowed in the
 * sliding time window.
 * @returns {Primitive} The sliding window rule to provide to the SDK in the
 * `rules` option.
 *
 * @example
 * ```ts
 * slidingWindow({ mode: "LIVE", interval: "60s", max: 100 });
 * ```
 * @example
 * ```ts
 * const aj = snipkit({
 *   key: process.env.SNIPKIT_KEY,
 *   rules: [
 *     slidingWindow({
 *       mode: "LIVE",
 *       interval: "60s",
 *       max: 100,
 *     })
 *   ],
 * });
 * ```
 * @link https://docs-snipkit.khulnasoft.com/rate-limiting/concepts
 * @link https://docs-snipkit.khulnasoft.com/rate-limiting/algorithms#sliding-window
 * @link https://docs-snipkit.khulnasoft.com/rate-limiting/reference
 */
export function slidingWindow<
  const Characteristics extends readonly string[] = [],
>(
  options: SlidingWindowRateLimitOptions<Characteristics>,
): Primitive<Simplify<CharacteristicProps<Characteristics>>> {
  validateSlidingWindowOptions(options);

  const type = "RATE_LIMIT";
  const version = 0;
  const mode = options.mode === "LIVE" ? "LIVE" : "DRY_RUN";
  const characteristics = Array.isArray(options.characteristics)
    ? options.characteristics
    : undefined;

  const max = options.max;
  const interval = duration.parse(options.interval);

  const id = hasher.hash(
    hasher.string("type", type),
    hasher.uint32("version", version),
    hasher.string("mode", mode),
    hasher.string("algorithm", "SLIDING_WINDOW"),
    // TODO(#4203): Rules need to receive characteristics via options while
    // falling back to characteristics defined on the client
    hasher.stringSliceOrdered("characteristics", characteristics ?? []),
    // Match is deprecated so it is always an empty string in the newest SDKs
    hasher.string("match", ""),
    hasher.uint32("max", max),
    hasher.uint32("interval", interval),
  );

  const rule: SnipkitSlidingWindowRateLimitRule<{}> = {
    type,
    version,
    priority: Priority.RateLimit,
    mode,
    characteristics,
    algorithm: "SLIDING_WINDOW",
    max,
    interval,
    validate() {},
    async protect(ctx: SnipkitContext) {
      const ruleId = await id;

      const { fingerprint } = ctx;

      return new SnipkitRuleResult({
        ruleId,
        fingerprint,
        ttl: 0,
        state: "NOT_RUN",
        conclusion: "ALLOW",
        reason: new SnipkitRateLimitReason({
          max: 0,
          remaining: 0,
          reset: 0,
          window: 0,
        }),
      });
    },
  };

  return [rule];
}

function protocolSensitiveInfoEntitiesToAnalyze<Custom extends string>(
  entity: SnipkitSensitiveInfoType | Custom,
) {
  if (typeof entity !== "string") {
    throw new Error("invalid entity type");
  }

  if (entity === "EMAIL") {
    return { tag: "email" as const };
  }

  if (entity === "PHONE_NUMBER") {
    return { tag: "phone-number" as const };
  }

  if (entity === "IP_ADDRESS") {
    return { tag: "ip-address" as const };
  }

  if (entity === "CREDIT_CARD_NUMBER") {
    return { tag: "credit-card-number" as const };
  }

  return {
    tag: "custom" as const,
    val: entity,
  };
}

function analyzeSensitiveInfoEntitiesToString(
  entity: SensitiveInfoEntity,
): string {
  if (entity.tag === "email") {
    return "EMAIL";
  }

  if (entity.tag === "ip-address") {
    return "IP_ADDRESS";
  }

  if (entity.tag === "credit-card-number") {
    return "CREDIT_CARD_NUMBER";
  }

  if (entity.tag === "phone-number") {
    return "PHONE_NUMBER";
  }

  return entity.val;
}

function convertAnalyzeDetectedSensitiveInfoEntity(
  detectedEntities: DetectedSensitiveInfoEntity[],
): SnipkitIdentifiedEntity[] {
  return detectedEntities.map((detectedEntity) => {
    return {
      ...detectedEntity,
      identifiedType: analyzeSensitiveInfoEntitiesToString(
        detectedEntity.identifiedType,
      ),
    };
  });
}

/**
 * Snipkit sensitive information detection rule. Applying this rule protects
 * against clients sending you sensitive information such as personally
 * identifiable information (PII) that you do not wish to handle. The rule runs
 * entirely locally so no data ever leaves your environment.
 *
 * This rule includes built-in detections for email addresses, credit/debit card
 * numbers, IP addresses, and phone numbers. You can also provide a custom
 * detection function to identify additional sensitive information.
 *
 * @param {SensitiveInfoOptions} options - The options for the sensitive
 * information detection rule.
 * @param {SnipkitMode} options.mode - The block mode of the rule, either
 * `"LIVE"` or `"DRY_RUN"`. `"LIVE"` will block requests when any of the
 * configured sensitive information types are detected, and `"DRY_RUN"` will
 * allow all requests while still providing access to the rule results. Defaults
 * to `"DRY_RUN"` if not specified.
 * @param {Array<SnipkitSensitiveInfoType>} options.deny - The list of sensitive
 * information types to deny. If provided, the sensitive information types in
 * this list will be denied. You may only provide either `allow` or `deny`, not
 * both. Specify one or more of the following:
 *
 * - `"EMAIL"`
 * - `"PHONE_NUMBER"`
 * - `"IP_ADDRESS"`
 * - `"CREDIT_CARD_NUMBER"`
 * @param {Array<SnipkitSensitiveInfoType>} options.allow - The list of sensitive
 * information types to allow. If provided, types in this list will be allowed
 * and all others will be denied. You may only provide either `allow` or `deny`,
 * not both. The same options apply as for `deny`.
 * @param {DetectSensitiveInfoEntities} options.detect - A custom detection
 * function. The function will take a list of tokens and must return a list of
 * either `undefined`, if the corresponding token in the input list is not
 * sensitive, or the name of the entity if it does match. The number of tokens
 * that are provided to the function is controlled by the `contextWindowSize`
 * option, which defaults to `1`. If you need additional context to perform
 * detections then you can increase this value.
 * @param {number} options.contextWindowSize - The number of tokens to provide
 * to the custom detection function. This defaults to 1 if not specified.
 * @returns {Primitive} The sensitive information rule to provide to the SDK in
 * the `rules` option.
 *
 * @example
 * ```ts
 * sensitiveInfo({ mode: "LIVE", deny: ["EMAIL"] });
 * ```
 * @example
 * ```ts
 * const aj = snipkit({
 *   key: process.env.SNIPKIT_KEY,
 *   rules: [
 *     sensitiveInfo({
 *       mode: "LIVE",
 *       deny: ["EMAIL"],
 *     })
 *   ],
 * });
 * ```
 * @example
 * Custom detection function:
 * ```ts
 * function detectDash(tokens: string[]): Array<"CONTAINS_DASH" | undefined> {
 *   return tokens.map((token) => {
 *     if (token.includes("-")) {
 *       return "CONTAINS_DASH";
 *     }
 *   });
 * }
 *
 * const aj = snipkit({
 *   key: process.env.SNIPKIT_KEY,
 *   rules: [
 *     sensitiveInfo({
 *       mode: "LIVE",
 *       deny: ["EMAIL", "CONTAINS_DASH"],
 *       detect: detectDash,
 *       contextWindowSize: 2,
 *     })
 *   ],
 * });
 * ```
 * @link https://docs-snipkit.khulnasoft.com/sensitive-info/concepts
 * @link https://docs-snipkit.khulnasoft.com/sensitive-info/reference
 */
export function sensitiveInfo<
  const Detect extends DetectSensitiveInfoEntities<CustomEntities> | undefined,
  const CustomEntities extends string,
>(options: SensitiveInfoOptions<Detect>): Primitive<{}> {
  validateSensitiveInfoOptions(options);

  if (
    typeof options.allow !== "undefined" &&
    typeof options.deny !== "undefined"
  ) {
    throw new Error(
      "`sensitiveInfo` options error: `allow` and `deny` cannot be provided together",
    );
  }
  if (
    typeof options.allow === "undefined" &&
    typeof options.deny === "undefined"
  ) {
    throw new Error(
      "`sensitiveInfo` options error: either `allow` or `deny` must be specified",
    );
  }

  const type = "SENSITIVE_INFO";
  const version = 0;
  const mode = options.mode === "LIVE" ? "LIVE" : "DRY_RUN";
  const allow = options.allow || [];
  const deny = options.deny || [];

  const id = hasher.hash(
    hasher.string("type", type),
    hasher.uint32("version", version),
    hasher.string("mode", mode),
    hasher.stringSliceOrdered("allow", allow),
    hasher.stringSliceOrdered("deny", deny),
  );

  const rule: SnipkitSensitiveInfoRule<{}> = {
    version,
    priority: Priority.SensitiveInfo,
    type,
    mode,
    allow,
    deny,

    validate(
      context: SnipkitContext,
      details: SnipkitRequestDetails,
    ): asserts details is SnipkitRequestDetails {},

    async protect(
      context: SnipkitContext,
      details: SnipkitRequestDetails,
    ): Promise<SnipkitRuleResult> {
      const ruleId = await id;

      const { fingerprint } = context;

      const body = await context.getBody();
      if (typeof body === "undefined") {
        return new SnipkitRuleResult({
          ruleId,
          fingerprint,
          ttl: 0,
          state: "NOT_RUN",
          conclusion: "ERROR",
          reason: new SnipkitErrorReason(
            "Couldn't read the body of the request to perform sensitive info identification.",
          ),
        });
      }

      let convertedDetect = undefined;
      if (typeof options.detect !== "undefined") {
        const detect = options.detect;
        convertedDetect = (tokens: string[]) => {
          return detect(tokens)
            .filter((e) => typeof e !== "undefined")
            .map(protocolSensitiveInfoEntitiesToAnalyze);
        };
      }

      let entitiesTag: "allow" | "deny" = "allow";
      let entitiesVal: Array<
        ReturnType<typeof protocolSensitiveInfoEntitiesToAnalyze>
      > = [];

      if (Array.isArray(options.allow)) {
        entitiesTag = "allow";
        entitiesVal = options.allow
          .filter((e) => typeof e !== "undefined")
          .map(protocolSensitiveInfoEntitiesToAnalyze);
      }

      if (Array.isArray(options.deny)) {
        entitiesTag = "deny";
        entitiesVal = options.deny
          .filter((e) => typeof e !== "undefined")
          .map(protocolSensitiveInfoEntitiesToAnalyze);
      }

      const entities = {
        tag: entitiesTag,
        val: entitiesVal,
      };

      const result = await analyze.detectSensitiveInfo(
        context,
        body,
        entities,
        options.contextWindowSize || 1,
        convertedDetect,
      );

      const state = mode === "LIVE" ? "RUN" : "DRY_RUN";

      const reason = new SnipkitSensitiveInfoReason({
        denied: convertAnalyzeDetectedSensitiveInfoEntity(result.denied),
        allowed: convertAnalyzeDetectedSensitiveInfoEntity(result.allowed),
      });

      if (result.denied.length === 0) {
        return new SnipkitRuleResult({
          ruleId,
          fingerprint,
          ttl: 0,
          state,
          conclusion: "ALLOW",
          reason,
        });
      } else {
        return new SnipkitRuleResult({
          ruleId,
          fingerprint,
          ttl: 0,
          state,
          conclusion: "DENY",
          reason,
        });
      }
    },
  };

  return [rule];
}

/**
 * Snipkit email validation rule. Applying this rule allows you to validate &
 * verify an email address.
 *
 * The first step of the analysis is to validate the email address syntax. This
 * runs locally within the SDK and validates the email address is in the correct
 * format. If the email syntax is valid, the SDK will pass the email address to
 * the Snipkit cloud API to verify the email address. This performs several
 * checks, depending on the rule configuration.
 *
 * @param {EmailOptions} options - The options for the email validation rule.
 * @param {SnipkitMode} options.mode - The block mode of the rule, either
 * `"LIVE"` or `"DRY_RUN"`. `"LIVE"` will block email addresses based on the
 * configuration, and `"DRY_RUN"` will allow all requests while still providing
 * access to the rule results. Defaults to `"DRY_RUN"` if not specified.
 * @param {Array<SnipkitEmailType>} options.deny - The list of email types to
 * deny. If provided, the email types in this list will be denied. You may only
 * provide either `allow` or `deny`, not both. Specify one or more of the
 * following:
 *
 * - `"DISPOSABLE"` - Disposable email addresses.
 * - `"FREE"` - Free email addresses.
 * - `"NO_MX_RECORDS"` - Email addresses with no MX records.
 * - `"NO_GRAVATAR"` - Email addresses with no Gravatar.
 * - `"INVALID"` - Invalid email addresses.
 *
 * @param {Array<SnipkitEmailType>} options.allow - The list of email types to
 * allow. If provided, email addresses in this list will be allowed and all
 * others will be denied. You may only provide either `allow` or `deny`, not
 * both. The same options apply as for `deny`.
 * @returns {Primitive} The email rule to provide to the SDK in the `rules`
 * option.
 *
 * @example
 * ```ts
 * validateEmail({ mode: "LIVE", deny: ["DISPOSABLE", "INVALID"] });
 * ```
 * @example
 * ```ts
 * const aj = snipkit({
 *   key: process.env.SNIPKIT_KEY,
 *   rules: [
 *     validateEmail({
 *       mode: "LIVE",
 *       deny: ["DISPOSABLE", "INVALID"]
 *     })
 *   ],
 * });
 * ```
 * @link https://docs-snipkit.khulnasoft.com/email-validation/concepts
 * @link https://docs-snipkit.khulnasoft.com/email-validation/reference
 */
export function validateEmail(
  options: EmailOptions,
): Primitive<{ email: string }> {
  validateEmailOptions(options);

  if (
    typeof options.allow !== "undefined" &&
    typeof options.deny !== "undefined"
  ) {
    throw new Error(
      "`validateEmail` options error: `allow` and `deny` cannot be provided together",
    );
  }
  if (
    typeof options.allow !== "undefined" &&
    typeof options.block !== "undefined"
  ) {
    throw new Error(
      "`validateEmail` options error: `allow` and `block` cannot be provided together",
    );
  }
  if (
    typeof options.deny !== "undefined" &&
    typeof options.block !== "undefined"
  ) {
    throw new Error(
      "`validateEmail` options error: `deny` and `block` cannot be provided together, `block` is now deprecated so `deny` should be preferred.",
    );
  }
  if (
    typeof options.allow === "undefined" &&
    typeof options.deny === "undefined" &&
    typeof options.block === "undefined"
  ) {
    throw new Error(
      "`validateEmail` options error: either `allow` or `deny` must be specified",
    );
  }

  const type = "EMAIL";
  const version = 0;
  const mode = options.mode === "LIVE" ? "LIVE" : "DRY_RUN";
  const allow = options.allow ?? [];
  const deny = options.deny ?? options.block ?? [];
  const requireTopLevelDomain = options.requireTopLevelDomain ?? true;
  const allowDomainLiteral = options.allowDomainLiteral ?? false;

  const id = hasher.hash(
    hasher.string("type", type),
    hasher.uint32("version", version),
    hasher.string("mode", mode),
    hasher.stringSliceOrdered("allow", allow),
    hasher.stringSliceOrdered("deny", deny),
    hasher.bool("requireTopLevelDomain", requireTopLevelDomain),
    hasher.bool("allowDomainLiteral", allowDomainLiteral),
  );

  let config: EmailValidationConfig = {
    tag: "deny-email-validation-config",
    val: {
      requireTopLevelDomain,
      allowDomainLiteral,
      deny: [],
    },
  };

  if (typeof options.allow !== "undefined") {
    config = {
      tag: "allow-email-validation-config",
      val: {
        requireTopLevelDomain,
        allowDomainLiteral,
        allow: options.allow,
      },
    };
  }

  if (typeof options.deny !== "undefined") {
    config = {
      tag: "deny-email-validation-config",
      val: {
        requireTopLevelDomain,
        allowDomainLiteral,
        deny: options.deny,
      },
    };
  }

  if (typeof options.block !== "undefined") {
    config = {
      tag: "deny-email-validation-config",
      val: {
        requireTopLevelDomain,
        allowDomainLiteral,
        deny: options.block,
      },
    };
  }

  const rule: SnipkitEmailRule<{ email: string }> = {
    version,
    priority: Priority.EmailValidation,

    type,
    mode,
    allow,
    deny,
    requireTopLevelDomain,
    allowDomainLiteral,

    validate(
      context: SnipkitContext,
      details: Partial<SnipkitRequestDetails & { email: string }>,
    ): asserts details is SnipkitRequestDetails & { email: string } {
      assert(
        typeof details.email !== "undefined",
        "ValidateEmail requires `email` to be set.",
      );
    },

    async protect(
      context: SnipkitContext,
      { email }: SnipkitRequestDetails & { email: string },
    ): Promise<SnipkitRuleResult> {
      const ruleId = await id;

      const { fingerprint } = context;

      const result = await analyze.isValidEmail(context, email, config);
      const state = mode === "LIVE" ? "RUN" : "DRY_RUN";
      if (result.validity === "valid") {
        return new SnipkitRuleResult({
          ruleId,
          fingerprint,
          ttl: 0,
          state,
          conclusion: "ALLOW",
          reason: new SnipkitEmailReason({ emailTypes: [] }),
        });
      } else {
        const typedEmailTypes = result.blocked.filter(isEmailType);

        return new SnipkitRuleResult({
          ruleId,
          fingerprint,
          ttl: 0,
          state,
          conclusion: "DENY",
          reason: new SnipkitEmailReason({
            emailTypes: typedEmailTypes,
          }),
        });
      }
    },
  };

  return [rule];
}

/**
 * Snipkit bot detection rule. Applying this rule allows you to manage traffic by
 * automated clients and bots.
 *
 * Bots can be good (such as search engine crawlers or monitoring agents) or bad
 * (such as scrapers or automated scripts). Snipkit allows you to configure which
 * bots you want to allow or deny by specific bot names e.g. curl, as well as by
 * category e.g. search engine bots.
 *
 * Bots are detected based on various signals such as the user agent, IP
 * address, DNS records, and more.
 *
 * @param {BotOptions} options - The options for the bot rule.
 * @param {SnipkitMode} options.mode - The block mode of the rule, either
 * `"LIVE"` or `"DRY_RUN"`. `"LIVE"` will block detected bots, and `"DRY_RUN"`
 * will allow all requests while still providing access to the rule results.
 * Defaults to `"DRY_RUN"` if not specified.
 * @param {Array<SnipkitWellKnownBot | SnipkitBotCategory>} options.allow - The
 * list of bots to allow. If provided, only the bots in this list will be
 * allowed and any other detected bot will be denied. If empty, all bots will be
 * denied. You may only provide either `allow` or `deny`, not both. You can use
 * specific bots e.g. `"CURL"` will allow the default user-agent of the `curl`
 * tool. You can also use categories e.g. `"CATEGORY:SEARCH_ENGINE"` will allow
 * all search engine bots. See
 * https://docs-snipkit.khulnasoft.com/bot-protection/identifying-bots for the full list of
 * bots and categories.
 * @param {Array<SnipkitWellKnownBot | SnipkitBotCategory>} options.deny - The
 * list of bots to deny. If provided, the bots in this list will be denied and
 * all other detected bots will be allowed. You may only provide either `allow`
 * or `deny`, not both. The same options apply as for `allow`.
 * @returns {Primitive} The bot rule to provide to the SDK in the `rules`
 * option.
 *
 * @example
 * Allows search engine bots and curl, denies all other bots
 *
 * ```ts
 * detectBot({ mode: "LIVE", allow: ["CATEGORY:SEARCH_ENGINE", "CURL"] });
 * ```
 * @example
 * Allows search engine bots and curl, denies all other bots
 *
 * ```ts
 * const aj = snipkit({
 *   key: process.env.SNIPKIT_KEY,
 *   rules: [
 *     detectBot({
 *       mode: "LIVE",
 *       allow: ["CATEGORY:SEARCH_ENGINE", "CURL"]
 *     })
 *   ],
 * });
 * ```
 * @example
 * Denies AI crawlers, allows all other bots
 *
 * ```ts
 * detectBot({ mode: "LIVE", deny: ["CATEGORY:AI"] });
 * ```
 * @example
 * Denies AI crawlers, allows all other bots
 * ```ts
 * const aj = snipkit({
 *   key: process.env.SNIPKIT_KEY,
 *   rules: [
 *     detectBot({
 *       mode: "LIVE",
 *       deny: ["CATEGORY:AI"]
 *     })
 *   ],
 * });
 * ```
 * @link https://docs-snipkit.khulnasoft.com/bot-protection/concepts
 * @link https://docs-snipkit.khulnasoft.com/bot-protection/identifying-bots
 * @link https://docs-snipkit.khulnasoft.com/bot-protection/reference
 */
export function detectBot(options: BotOptions): Primitive<{}> {
  validateBotOptions(options);

  if (
    typeof options.allow !== "undefined" &&
    typeof options.deny !== "undefined"
  ) {
    throw new Error(
      "`detectBot` options error: `allow` and `deny` cannot be provided together",
    );
  }
  if (
    typeof options.allow === "undefined" &&
    typeof options.deny === "undefined"
  ) {
    throw new Error(
      "`detectBot` options error: either `allow` or `deny` must be specified",
    );
  }

  const type = "BOT";
  const version = 0;
  const mode = options.mode === "LIVE" ? "LIVE" : "DRY_RUN";
  const allow = options.allow ?? [];
  const deny = options.deny ?? [];

  const id = hasher.hash(
    hasher.string("type", type),
    hasher.uint32("version", version),
    hasher.string("mode", mode),
    hasher.stringSliceOrdered("allow", allow),
    hasher.stringSliceOrdered("deny", deny),
  );

  let config: BotConfig = {
    tag: "allowed-bot-config",
    val: {
      entities: [],
      skipCustomDetect: true,
    },
  };
  if (typeof options.allow !== "undefined") {
    config = {
      tag: "allowed-bot-config",
      val: {
        entities: options.allow,
        skipCustomDetect: true,
      },
    };
  }

  if (typeof options.deny !== "undefined") {
    config = {
      tag: "denied-bot-config",
      val: {
        entities: options.deny,
        skipCustomDetect: true,
      },
    };
  }

  const rule: SnipkitBotRule<{}> = {
    version,
    priority: Priority.BotDetection,

    type,
    mode,
    allow,
    deny,

    validate(
      context: SnipkitContext,
      details: Partial<SnipkitRequestDetails>,
    ): asserts details is SnipkitRequestDetails {
      if (typeof details.headers === "undefined") {
        throw new Error("bot detection requires `headers` to be set");
      }
      if (typeof details.headers.has !== "function") {
        throw new Error("bot detection requires `headers` to extend `Headers`");
      }
      if (!details.headers.has("user-agent")) {
        throw new Error("bot detection requires user-agent header");
      }
    },

    /**
     * Attempts to call the bot detection on the headers.
     */
    async protect(
      context: SnipkitContext,
      request: SnipkitRequestDetails,
    ): Promise<SnipkitRuleResult> {
      const ruleId = await id;

      const { fingerprint } = context;

      const result = await analyze.detectBot(
        context,
        toAnalyzeRequest(request),
        config,
      );

      const state = mode === "LIVE" ? "RUN" : "DRY_RUN";

      // If this is a bot and of a type that we want to block, then block!
      if (result.denied.length > 0) {
        return new SnipkitRuleResult({
          ruleId,
          fingerprint,
          ttl: 60,
          state,
          conclusion: "DENY",
          reason: new SnipkitBotReason({
            allowed: result.allowed,
            denied: result.denied,
            verified: result.verified,
            spoofed: result.spoofed,
          }),
        });
      } else {
        return new SnipkitRuleResult({
          ruleId,
          fingerprint,
          ttl: 0,
          state,
          conclusion: "ALLOW",
          reason: new SnipkitBotReason({
            allowed: result.allowed,
            denied: result.denied,
            verified: result.verified,
            spoofed: result.spoofed,
          }),
        });
      }
    },
  };

  return [rule];
}

export type ShieldOptions = {
  mode?: SnipkitMode;
};

/**
 * Snipkit Shield WAF rule. Applying this rule protects your application against
 * common attacks, including the OWASP Top 10.
 *
 * The Snipkit Shield WAF analyzes every request to your application to detect
 * suspicious activity. Once a certain suspicion threshold is reached,
 * subsequent requests from that client are blocked for a period of time.
 *
 * @param {ShieldOptions} options - The options for the Shield rule.
 * @param {SnipkitMode} options.mode - The block mode of the rule, either
 * `"LIVE"` or `"DRY_RUN"`. `"LIVE"` will block suspicious requests, and
 * `"DRY_RUN"` will allow all requests while still providing access to the rule
 * results. Defaults to `"DRY_RUN"` if not specified.
 * @returns {Primitive} The Shield rule to provide to the SDK in the `rules`
 * option.
 *
 * @example
 * ```ts
 * shield({ mode: "LIVE" });
 * ```
 * @example
 * ```ts
 * const aj = snipkit({
 *   key: process.env.SNIPKIT_KEY,
 *   rules: [shield({ mode: "LIVE" })],
 * });
 * ```
 * @link https://docs-snipkit.khulnasoft.com/shield/concepts
 * @link https://docs-snipkit.khulnasoft.com/shield/reference
 */
export function shield(options: ShieldOptions): Primitive<{}> {
  validateShieldOptions(options);

  const type = "SHIELD";
  const version = 0;
  const mode = options.mode === "LIVE" ? "LIVE" : "DRY_RUN";

  const id = hasher.hash(
    hasher.string("type", type),
    hasher.uint32("version", version),
    hasher.string("mode", mode),
    // TODO(#4203): Rules need to receive characteristics via options while
    // falling back to characteristics defined on the client
    hasher.stringSliceOrdered("characteristics", []),
  );

  const rule: SnipkitShieldRule<{}> = {
    type,
    version,
    priority: Priority.Shield,
    mode,
    validate() {},
    async protect(ctx: SnipkitContext) {
      const ruleId = await id;

      const { fingerprint } = ctx;

      return new SnipkitRuleResult({
        ruleId,
        fingerprint,
        ttl: 0,
        state: "NOT_RUN",
        conclusion: "ALLOW",
        reason: new SnipkitShieldReason({
          shieldTriggered: false,
        }),
      });
    },
  };

  return [rule];
}

export type ProtectSignupOptions<Characteristics extends readonly string[]> = {
  rateLimit: SlidingWindowRateLimitOptions<Characteristics>;
  bots: BotOptions;
  email: EmailOptions;
};

/**
 * Snipkit signup form protection rule. Applying this rule combines rate
 * limiting, bot protection, and email validation to protect your signup forms
 * from abuse. Using this rule will configure the following:
 *
 * - Rate limiting - signup forms are a common target for bots. Snipkit’s rate
 *   limiting helps to prevent bots and other automated or malicious clients
 *   from submitting your signup form too many times in a short period of time.
 * - Bot protection - signup forms are usually exclusively used by humans, which
 *   means that any automated submissions to the form are likely to be
 *   fraudulent.
 * - Email validation - email addresses should be validated to ensure the signup
 *   is coming from a legitimate user with a real email address that can
 *   actually receive messages.
 *
 * @param {ProtectSignupOptions} options - The options for the signup form
 * protection rule.
 * @param {SnipkitMode} options.email.mode - The block mode of the rule, either
 * `"LIVE"` or `"DRY_RUN"`. `"LIVE"` will block email addresses based on the
 * configuration, and `"DRY_RUN"` will allow all requests while still providing
 * access to the rule results. Defaults to `"DRY_RUN"` if not specified.
 * @param {Array<SnipkitEmailType>} options.email.deny - The list of email types
 * to deny. If provided, the email types in this list will be denied. You may
 * only provide either `allow` or `deny`, not both. Specify one or more of the
 * following:
 *
 * - `"DISPOSABLE"` - Disposable email addresses.
 * - `"FREE"` - Free email addresses.
 * - `"NO_MX_RECORDS"` - Email addresses with no MX records.
 * - `"NO_GRAVATAR"` - Email addresses with no Gravatar.
 * - `"INVALID"` - Invalid email addresses.
 *
 * @param {Array<SnipkitEmailType>} options.email.allow - The list of email types
 * to allow. If provided, email addresses in this list will be allowed and all
 * others will be denied. You may only provide either `allow` or `deny`, not
 * both. The same options apply as for `deny`.
 * @param {SnipkitMode} options.bots.mode - The block mode of the rule, either
 * `"LIVE"` or `"DRY_RUN"`. `"LIVE"` will block detected bots, and `"DRY_RUN"`
 * will allow all requests while still providing access to the rule results.
 * Defaults to `"DRY_RUN"` if not specified.
 * @param {Array<SnipkitWellKnownBot | SnipkitBotCategory>} options.bots.allow -
 * The list of bots to allow. If provided, only the bots in this list will be
 * allowed and any other detected bot will be denied. If empty, all bots will be
 * denied. You may only provide either `allow` or `deny`, not both. You can use
 * specific bots e.g. `"CURL"` will allow the default user-agent of the `curl`
 * tool. You can also use categories e.g. `"CATEGORY:SEARCH_ENGINE"` will allow
 * all search engine bots. See
 * https://docs-snipkit.khulnasoft.com/bot-protection/identifying-bots for the full list of
 * bots and categories.
 * @param {Array<SnipkitWellKnownBot | SnipkitBotCategory>} options.bots.deny -
 * The list of bots to deny. If provided, the bots in this list will be denied
 * and all other detected bots will be allowed. You may only provide either
 * `allow` or `deny`, not both. The same options apply as for `allow`.
 * @param {SlidingWindowRateLimitOptions} options.rateLimit - The options for
 * the sliding window rate limiting rule.
 * @param {SnipkitMode} options.rateLimit.mode - The block mode of the rule,
 * either `"LIVE"` or `"DRY_RUN"`. `"LIVE"` will block requests when the rate
 * limit is exceeded, and `"DRY_RUN"` will allow all requests while still
 * providing access to the rule results. Defaults to `"DRY_RUN"` if not
 * specified.
 * @param {string | number} options.rateLimit.interval - The time interval for
 * the rate limit. This can be a string like `"60s"` for 60 seconds, `"1h45m"`
 * for 1 hour and 45 minutes, or a number like `60` for 60 seconds. Valid string
 * time units are:
 * - `s` for seconds.
 * - `m` for minutes.
 * - `h` for hours.
 * - `d` for days.
 * @param {number} options.rateLimit.max - The maximum number of requests
 * allowed in the sliding time window.
 * @returns {Primitive} The signup form protection rule to provide to the SDK in
 * the `rules` option.
 *
 * @example
 * Our recommended configuration for most signup forms is:
 *
 * - Block emails with invalid syntax, that are from disposable email providers,
 *   or do not have valid MX records configured.
 * - Block all bots.
 * - Apply a rate limit of 5 submissions per 10 minutes from a single IP
 *   address.
 *
 * ```ts
 * const aj = snipkit({
 *   key: process.env.SNIPKIT_KEY,
 *   rules: [
 *    protectSignup({
 *      email: {
 *        mode: "LIVE",
 *        block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
 *      },
 *      bots: {
 *        mode: "LIVE",
 *        allow: [], // block all detected bots
 *      },
 *      rateLimit: {
 *        mode: "LIVE",
 *        interval: "10m",
 *        max: 5,
 *      },
 *    }),
 *  ],
 * });
 * ```
 * @link https://docs-snipkit.khulnasoft.com/signup-protection/concepts
 * @link https://docs-snipkit.khulnasoft.com/signup-protection/reference
 */
export function protectSignup<const Characteristics extends string[] = []>(
  options: ProtectSignupOptions<Characteristics>,
): Product<
  Simplify<
    UnionToIntersection<
      { email: string } | CharacteristicProps<Characteristics>
    >
  >
> {
  return [
    ...slidingWindow(options.rateLimit),
    ...detectBot(options.bots),
    ...validateEmail(options.email),
  ];
}

export interface SnipkitOptions<
  Rules extends [...(Primitive | Product)[]],
  Characteristics extends readonly string[],
> {
  /**
   * The API key to identify the site in Snipkit.
   */
  key: string;
  /**
   * Rules to apply when protecting a request.
   */
  rules: readonly [...Rules];
  /**
   * Characteristics to be used to uniquely identify clients.
   */
  characteristics?: Characteristics;
  /**
   * The client used to make requests to the Snipkit API. This must be set
   * when creating the SDK, such as inside @snipkit/next or mocked in tests.
   */
  client?: Client;
  /**
   * The logger used to emit useful information from the SDK.
   */
  log?: SnipkitLogger;
}

/**
 * The Snipkit client provides a public `protect()` method to
 * make a decision about how a request should be handled.
 */
export interface Snipkit<Props extends PlainObject> {
  /**
   * Make a decision about how to handle a request. This will analyze the
   * request locally where possible and call the Snipkit decision API.
   *
   * @param {SnipkitAdapterContext} ctx - Additional context for this function call.
   * @param {SnipkitRequest} request - Details about the {@link SnipkitRequest} that Snipkit needs to make a decision.
   * @returns An {@link SnipkitDecision} indicating Snipkit's decision about the request.
   */
  protect(
    ctx: SnipkitAdapterContext,
    request: SnipkitRequest<Props>,
  ): Promise<SnipkitDecision>;

  /**
   * Augments the client with another rule. Useful for varying rules based on
   * criteria in your handler—e.g. different rate limit for logged in users.
   *
   * @param rule The rule to add to this execution.
   * @returns An augmented {@link Snipkit} client.
   */
  withRule<Rule extends Primitive | Product>(
    rule: Rule,
  ): Snipkit<Simplify<Props & ExtraProps<Rule>>>;
}

/**
 * Create a new Snipkit client with the specified {@link SnipkitOptions}.
 *
 * @param options {SnipkitOptions} Snipkit configuration options.
 */
export default function snipkit<
  const Rules extends [...(Primitive | Product)[]] = [],
  const Characteristics extends readonly string[] = [],
>(
  options: SnipkitOptions<Rules, Characteristics>,
): Snipkit<Simplify<ExtraProps<Rules> & CharacteristicProps<Characteristics>>> {
  // We destructure here to make the function signature neat when viewed by consumers
  const { key, rules } = options;

  const rt = runtime();

  // TODO: Separate the SnipkitOptions from the SDK Options
  // It is currently optional in the options so users can override it via an SDK
  if (typeof options.log === "undefined") {
    throw new Error("Log is required");
  }
  const log = options.log;

  const perf = new Performance(log);

  // TODO(#207): Remove this when we can default the transport so client is not required
  // It is currently optional in the options so the Next SDK can override it for the user
  if (typeof options.client === "undefined") {
    throw new Error("Client is required");
  }
  const client = options.client;

  // A local cache of block decisions. Might be emphemeral per request,
  // depending on the way the runtime works, but it's worth a try.
  // TODO(#132): Support configurable caching
  const blockCache = new Cache<SnipkitReason>();

  const rootRules: SnipkitRule[] = rules
    .flat(1)
    .sort((a, b) => a.priority - b.priority);

  async function protect<Props extends PlainObject>(
    rules: SnipkitRule[],
    ctx: SnipkitAdapterContext,
    request: SnipkitRequest<Props>,
  ) {
    // This goes against the type definition above, but users might call
    // `protect()` with no value and we don't want to crash
    if (typeof request === "undefined") {
      request = {} as typeof request;
    }

    const details: Partial<SnipkitRequestDetails> = Object.freeze({
      ip: request.ip,
      method: request.method,
      protocol: request.protocol,
      host: request.host,
      path: request.path,
      headers: new SnipkitHeaders(request.headers),
      cookies: request.cookies,
      query: request.query,
      // TODO(#208): Re-add body
      // body: request.body,
      extra: extraProps(request),
      email: typeof request.email === "string" ? request.email : undefined,
    });

    const characteristics = options.characteristics
      ? [...options.characteristics]
      : [];

    const waitUntil = lookupWaitUntil();

    const baseContext = {
      key,
      log,
      characteristics,
      waitUntil,
      ...ctx,
    };

    let fingerprint = "";

    const logFingerprintPerf = perf.measure("fingerprint");
    try {
      fingerprint = await analyze.generateFingerprint(
        baseContext,
        toAnalyzeRequest(details),
      );
      log.debug("fingerprint (%s): %s", rt, fingerprint);
    } catch (error) {
      log.error(
        { error },
        "Failed to build fingerprint. Please verify your Characteristics.",
      );

      const decision = new SnipkitErrorDecision({
        ttl: 0,
        reason: new SnipkitErrorReason(
          `Failed to build fingerprint - ${errorMessage(error)}`,
        ),
        // No results because we couldn't create a fingerprint
        results: [],
      });

      // TODO: Consider sending this to Report when we have an infallible fingerprint

      return decision;
    } finally {
      logFingerprintPerf();
    }

    const context: SnipkitContext = Object.freeze({
      ...baseContext,
      fingerprint,
      runtime: rt,
    });

    if (rules.length < 1) {
      log.warn(
        "Calling `protect()` with no rules is deprecated. Did you mean to configure the Shield rule?",
      );
    }

    if (rules.length > 10) {
      log.error("Failure running rules. Only 10 rules may be specified.");

      const decision = new SnipkitErrorDecision({
        ttl: 0,
        reason: new SnipkitErrorReason("Only 10 rules may be specified"),
        // No results because the sorted rules were too long and we don't want
        // to instantiate a ton of NOT_RUN results
        results: [],
      });

      client.report(
        context,
        details,
        decision,
        // No rules because we've determined they were too long and we don't
        // want to try to send them to the server
        [],
      );

      return decision;
    }

    const results: SnipkitRuleResult[] = [];
    for (let idx = 0; idx < rules.length; idx++) {
      // Default all rules to NOT_RUN/ALLOW before doing anything
      results[idx] = new SnipkitRuleResult({
        // TODO(#4030): Figure out if we can get each Rule ID before they are run
        ruleId: "",
        fingerprint,
        ttl: 0,
        state: "NOT_RUN",
        conclusion: "ALLOW",
        reason: new SnipkitReason(),
      });

      // Add top-level characteristics to all Rate Limit rules that don't already have
      // their own set of characteristics.
      const candidate_rule = rules[idx];
      if (isRateLimitRule(candidate_rule)) {
        if (typeof candidate_rule.characteristics === "undefined") {
          candidate_rule.characteristics = characteristics;
          rules[idx] = candidate_rule;
        }
      }
    }

    const logLocalPerf = perf.measure("local");
    try {
      // We have our own local cache which we check first. This doesn't work in
      // serverless environments where every request is isolated, but there may be
      // some instances where the instance is not recycled immediately. If so, we
      // can take advantage of that.
      const logCachePerf = perf.measure("cache");
      const existingBlockReason = blockCache.get(fingerprint);
      logCachePerf();

      // If already blocked then we can async log to the API and return the
      // decision immediately.
      if (existingBlockReason) {
        const decision = new SnipkitDenyDecision({
          ttl: blockCache.ttl(fingerprint),
          reason: existingBlockReason,
          // All results will be NOT_RUN because we used a cached decision
          results,
        });

        client.report(context, details, decision, rules);

        log.debug(
          {
            id: decision.id,
            conclusion: decision.conclusion,
            fingerprint,
            reason: existingBlockReason,
            runtime: rt,
          },
          "decide: already blocked",
        );

        return decision;
      }

      for (const [idx, rule] of rules.entries()) {
        // This re-assignment is a workaround to a TypeScript error with
        // assertions where the name was introduced via a destructure
        const localRule: SnipkitRule = rule;

        const logRulePerf = perf.measure(rule.type);
        try {
          if (typeof localRule.validate !== "function") {
            throw new Error("rule must have a `validate` function");
          }
          localRule.validate(context, details);

          if (typeof localRule.protect !== "function") {
            throw new Error("rule must have a `protect` function");
          }
          results[idx] = await localRule.protect(context, details);

          // If a rule didn't return a rule result, we need to stub it to avoid
          // crashing. This should only happen if a user writes a custom local
          // rule incorrectly.
          if (typeof results[idx] === "undefined") {
            results[idx] = new SnipkitRuleResult({
              // TODO(#4030): If we can get the Rule ID before running rules,
              // this can use it
              ruleId: "",
              fingerprint,
              ttl: 0,
              state: "RUN",
              conclusion: "ERROR",
              reason: new SnipkitErrorReason("rule result missing"),
            });
          }

          log.debug(
            {
              id: results[idx].ruleId,
              rule: rule.type,
              fingerprint,
              path: details.path,
              runtime: rt,
              ttl: results[idx].ttl,
              conclusion: results[idx].conclusion,
              reason: results[idx].reason,
            },
            "Local rule result:",
          );
        } catch (err) {
          log.error(
            "Failure running rule: %s due to %s",
            rule.type,
            errorMessage(err),
          );

          results[idx] = new SnipkitRuleResult({
            // TODO(#4030): Figure out if we can get a Rule ID in this error case
            ruleId: "",
            fingerprint,
            ttl: 0,
            state: "RUN",
            conclusion: "ERROR",
            reason: new SnipkitErrorReason(err),
          });
        } finally {
          logRulePerf();
        }

        if (results[idx].isDenied()) {
          // If the rule is not a DRY_RUN, we want to cache non-zero TTL results
          // and return a DENY decision.
          if (results[idx].state !== "DRY_RUN") {
            const decision = new SnipkitDenyDecision({
              ttl: results[idx].ttl,
              reason: results[idx].reason,
              results,
            });

            // Only a DENY decision is reported to avoid creating 2 entries for
            // a request. Upon ALLOW, the `decide` call will create an entry for
            // the request.
            client.report(context, details, decision, rules);

            if (results[idx].ttl > 0) {
              log.debug(
                {
                  fingerprint,
                  conclusion: decision.conclusion,
                  reason: decision.reason,
                },
                "Caching decision for %d seconds",
                decision.ttl,
              );

              blockCache.set(
                fingerprint,
                decision.reason,
                nowInSeconds() + decision.ttl,
              );
            }

            return decision;
          }

          log.warn(
            `Dry run mode is enabled for "%s" rule. Overriding decision. Decision was: DENY`,
            rule.type,
          );
        }
      }
    } finally {
      logLocalPerf();
    }

    // With no cached values, we take a decision remotely. We use a timeout to
    // fail open.
    const logRemotePerf = perf.measure("remote");
    try {
      const logDediceApiPerf = perf.measure("decideApi");
      const decision = await client
        .decide(context, details, rules)
        .finally(() => {
          logDediceApiPerf();
        });

      // If the decision is to block and we have a non-zero TTL, we cache the
      // block locally
      if (decision.isDenied() && decision.ttl > 0) {
        log.debug("decide: Caching block locally for %d seconds", decision.ttl);

        blockCache.set(
          fingerprint,
          decision.reason,
          nowInSeconds() + decision.ttl,
        );
      }

      return decision;
    } catch (err) {
      log.error(
        "Encountered problem getting remote decision: %s",
        errorMessage(err),
      );
      const decision = new SnipkitErrorDecision({
        ttl: 0,
        reason: new SnipkitErrorReason(err),
        results,
      });

      client.report(context, details, decision, rules);

      return decision;
    } finally {
      logRemotePerf();
    }
  }

  // This is a separate function so it can be called recursively
  function withRule<Rule extends Primitive | Product>(
    baseRules: SnipkitRule[],
    rule: Rule,
  ) {
    const rules = [...baseRules, ...rule].sort(
      (a, b) => a.priority - b.priority,
    );

    return Object.freeze({
      withRule(rule: Primitive | Product) {
        return withRule(rules, rule);
      },
      async protect(
        ctx: SnipkitAdapterContext,
        request: SnipkitRequest<ExtraProps<typeof rules>>,
      ): Promise<SnipkitDecision> {
        return protect(rules, ctx, request);
      },
    });
  }

  return Object.freeze({
    withRule(rule: Primitive | Product) {
      return withRule(rootRules, rule);
    },
    async protect(
      ctx: SnipkitAdapterContext,
      request: SnipkitRequest<ExtraProps<typeof rootRules>>,
    ): Promise<SnipkitDecision> {
      return protect(rootRules, ctx, request);
    },
  });
}
