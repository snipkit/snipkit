import { describe, mock, test } from "node:test";
import { expect } from "expect";
import { createClient } from "../client.js";
import { createRouterTransport } from "@connectrpc/connect";
import { DecideService } from "../proto/decide/v1alpha1/decide_connect.js";
import {
  Conclusion,
  DecideRequest,
  DecideResponse,
  Reason,
  ReportRequest,
  ReportResponse,
  Rule,
  RuleResult,
  RuleState,
  SDKStack,
} from "../proto/decide/v1alpha1/decide_pb.js";
import type { SnipkitConclusion, SnipkitRule } from "../index.js";
import {
  SnipkitAllowDecision,
  SnipkitChallengeDecision,
  SnipkitDecision,
  SnipkitDenyDecision,
  SnipkitErrorDecision,
  SnipkitErrorReason,
  SnipkitReason,
  SnipkitRuleResult,
} from "../index.js";

function deferred(): [Promise<void>, () => void, (reason?: unknown) => void] {
  let resolve: () => void;
  let reject: (reason?: unknown) => void;
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  // @ts-expect-error
  return [promise, resolve, reject];
}

class SnipkitTestReason extends SnipkitReason {}

class SnipkitInvalidDecision extends SnipkitDecision {
  reason: SnipkitReason;
  conclusion: SnipkitConclusion;

  constructor() {
    super({ ttl: 0, results: [] });
    // @ts-expect-error
    this.conclusion = "INVALID";
    this.reason = new SnipkitTestReason();
  }
}

describe("createClient", () => {
  const log = {
    debug() {},
    info() {},
    warn() {},
    error() {},
  };

  const defaultRemoteClientOptions = {
    baseUrl: "",
    timeout: 0,
    sdkStack: "NODEJS" as const,
    sdkVersion: "__SNIPKIT_SDK_VERSION__",
  };

  test("can be called with only a transport", () => {
    const client = createClient({
      ...defaultRemoteClientOptions,
      transport: createRouterTransport(() => {}),
    });
    expect(typeof client.decide).toEqual("function");
    expect(typeof client.report).toEqual("function");
  });

  test("allows overriding the default timeout", async () => {
    // TODO(#32): createRouterTransport doesn't seem to handle timeouts/promises correctly
    const client = createClient({
      ...defaultRemoteClientOptions,
      transport: createRouterTransport(({ service }) => {
        service(DecideService, {});
      }),
      timeout: 300,
    });
    expect(typeof client.decide).toEqual("function");
    expect(typeof client.report).toEqual("function");
  });

  test("allows overriding the sdkStack", async () => {
    const key = "test-key";
    const fingerprint =
      "fp_1_ac8547705f1f45c5050f1424700dfa3f6f2f681b550ca4f3c19571585aea7a2c";
    const context = {
      key,
      fingerprint,
      runtime: "test",
      log,
      characteristics: [],
      getBody: () => Promise.resolve(undefined),
    };
    const details = {
      ip: "172.100.1.1",
      method: "GET",
      protocol: "http",
      host: "example.com",
      path: "/",
      headers: new Headers([["User-Agent", "curl/8.1.2"]]),
      extra: {
        "extra-test": "extra-test-value",
      },
    };

    const router = {
      decide: mock.fn((args) => {
        return new DecideResponse({
          decision: {
            conclusion: Conclusion.ALLOW,
          },
        });
      }),
    };

    const client = createClient({
      ...defaultRemoteClientOptions,
      transport: createRouterTransport(({ service }) => {
        service(DecideService, router);
      }),
      sdkStack: "NEXTJS",
    });
    const _ = await client.decide(context, details, []);

    expect(router.decide.mock.callCount()).toEqual(1);
    expect(router.decide.mock.calls[0].arguments).toEqual([
      new DecideRequest({
        details: {
          ...details,
          headers: { "user-agent": "curl/8.1.2" },
        },
        rules: [],
        sdkStack: SDKStack.SDK_STACK_NEXTJS,
        sdkVersion: "__SNIPKIT_SDK_VERSION__",
      }),
      expect.anything(),
    ]);
  });

  test("sets the sdkStack as UNSPECIFIED if invalid", async () => {
    const key = "test-key";
    const fingerprint =
      "fp_1_ac8547705f1f45c5050f1424700dfa3f6f2f681b550ca4f3c19571585aea7a2c";
    const context = {
      key,
      fingerprint,
      runtime: "test",
      log,
      characteristics: [],
      getBody: () => Promise.resolve(undefined),
    };
    const details = {
      ip: "172.100.1.1",
      method: "GET",
      protocol: "http",
      host: "example.com",
      path: "/",
      headers: new Headers([["User-Agent", "curl/8.1.2"]]),
      extra: {
        "extra-test": "extra-test-value",
      },
    };

    const router = {
      decide: mock.fn((args) => {
        return new DecideResponse({
          decision: {
            conclusion: Conclusion.ALLOW,
          },
        });
      }),
    };

    const client = createClient({
      ...defaultRemoteClientOptions,
      transport: createRouterTransport(({ service }) => {
        service(DecideService, router);
      }),
      // @ts-expect-error
      sdkStack: "SOMETHING_INVALID",
    });
    const _ = await client.decide(context, details, []);

    expect(router.decide.mock.callCount()).toEqual(1);
    expect(router.decide.mock.calls[0].arguments).toEqual([
      new DecideRequest({
        details: {
          ...details,
          headers: { "user-agent": "curl/8.1.2" },
        },
        rules: [],
        sdkStack: SDKStack.SDK_STACK_UNSPECIFIED,
        sdkVersion: "__SNIPKIT_SDK_VERSION__",
      }),
      expect.anything(),
    ]);
  });

  test("calling `decide` will make RPC call with correct message", async () => {
    const key = "test-key";
    const fingerprint =
      "fp_1_ac8547705f1f45c5050f1424700dfa3f6f2f681b550ca4f3c19571585aea7a2c";
    const context = {
      key,
      fingerprint,
      runtime: "test",
      log,
      characteristics: [],
      getBody: () => Promise.resolve(undefined),
    };
    const details = {
      ip: "172.100.1.1",
      method: "GET",
      protocol: "http",
      host: "example.com",
      path: "/",
      headers: new Headers([["User-Agent", "curl/8.1.2"]]),
      extra: {
        "extra-test": "extra-test-value",
      },
    };

    const router = {
      decide: mock.fn((args) => {
        return new DecideResponse({
          decision: {
            conclusion: Conclusion.ALLOW,
          },
        });
      }),
    };

    const client = createClient({
      ...defaultRemoteClientOptions,
      transport: createRouterTransport(({ service }) => {
        service(DecideService, router);
      }),
    });
    const _ = await client.decide(context, details, []);

    expect(router.decide.mock.callCount()).toEqual(1);
    expect(router.decide.mock.calls[0].arguments).toEqual([
      new DecideRequest({
        details: {
          ...details,
          headers: { "user-agent": "curl/8.1.2" },
        },
        rules: [],
        sdkStack: SDKStack.SDK_STACK_NODEJS,
        sdkVersion: "__SNIPKIT_SDK_VERSION__",
      }),
      expect.anything(),
    ]);
  });

  test("calling `decide` will make RPC with email included", async () => {
    const key = "test-key";
    const fingerprint =
      "fp_1_ac8547705f1f45c5050f1424700dfa3f6f2f681b550ca4f3c19571585aea7a2c";
    const context = {
      key,
      fingerprint,
      runtime: "test",
      log,
      characteristics: [],
      getBody: () => Promise.resolve(undefined),
    };
    const details = {
      ip: "172.100.1.1",
      method: "GET",
      protocol: "http",
      host: "example.com",
      path: "/",
      headers: new Headers([["User-Agent", "curl/8.1.2"]]),
      extra: {
        "extra-test": "extra-test-value",
      },
      email: "abc@example.com",
    };

    const router = {
      decide: mock.fn((args) => {
        return new DecideResponse({
          decision: {
            conclusion: Conclusion.ALLOW,
          },
        });
      }),
    };

    const client = createClient({
      ...defaultRemoteClientOptions,
      transport: createRouterTransport(({ service }) => {
        service(DecideService, router);
      }),
    });
    const _ = await client.decide(context, details, []);

    expect(router.decide.mock.callCount()).toEqual(1);
    expect(router.decide.mock.calls[0].arguments).toEqual([
      new DecideRequest({
        details: {
          ...details,
          headers: { "user-agent": "curl/8.1.2" },
        },
        rules: [],
        sdkStack: SDKStack.SDK_STACK_NODEJS,
        sdkVersion: "__SNIPKIT_SDK_VERSION__",
      }),
      expect.anything(),
    ]);
  });

  test("calling `decide` will make RPC with rules included", async () => {
    const key = "test-key";
    const fingerprint =
      "fp_1_ac8547705f1f45c5050f1424700dfa3f6f2f681b550ca4f3c19571585aea7a2c";
    const context = {
      key,
      fingerprint,
      runtime: "test",
      log,
      characteristics: [],
      getBody: () => Promise.resolve(undefined),
    };
    const details = {
      ip: "172.100.1.1",
      method: "GET",
      protocol: "http",
      host: "example.com",
      path: "/",
      headers: new Headers([["User-Agent", "curl/8.1.2"]]),
      extra: {
        "extra-test": "extra-test-value",
      },
      email: "abc@example.com",
    };

    const router = {
      decide: mock.fn((args) => {
        return new DecideResponse({
          decision: {
            conclusion: Conclusion.ALLOW,
          },
        });
      }),
    };

    const client = createClient({
      ...defaultRemoteClientOptions,
      transport: createRouterTransport(({ service }) => {
        service(DecideService, router);
      }),
    });
    const rule: SnipkitRule = {
      version: 0,
      type: "TEST_RULE",
      mode: "DRY_RUN",
      priority: 1,
      validate: mock.fn(),
      protect: mock.fn(),
    };
    const _ = await client.decide(context, details, [rule]);

    expect(router.decide.mock.callCount()).toEqual(1);
    expect(router.decide.mock.calls[0].arguments).toEqual([
      new DecideRequest({
        details: {
          ...details,
          headers: { "user-agent": "curl/8.1.2" },
        },
        rules: [new Rule()],
        sdkStack: SDKStack.SDK_STACK_NODEJS,
        sdkVersion: "__SNIPKIT_SDK_VERSION__",
      }),
      expect.anything(),
    ]);
  });

  test("calling `decide` creates an ALLOW SnipkitDecision if DecideResponse is allowed", async () => {
    const key = "test-key";
    const fingerprint =
      "fp_1_ac8547705f1f45c5050f1424700dfa3f6f2f681b550ca4f3c19571585aea7a2c";
    const context = {
      key,
      fingerprint,
      runtime: "test",
      log,
      characteristics: [],
      getBody: () => Promise.resolve(undefined),
    };
    const details = {
      ip: "172.100.1.1",
      method: "GET",
      protocol: "http",
      host: "example.com",
      path: "/",
      headers: new Headers([["User-Agent", "curl/8.1.2"]]),
      extra: {
        "extra-test": "extra-test-value",
      },
    };

    const router = {
      decide: mock.fn((args) => {
        return new DecideResponse({
          decision: {
            conclusion: Conclusion.ALLOW,
          },
        });
      }),
    };

    const client = createClient({
      ...defaultRemoteClientOptions,
      transport: createRouterTransport(({ service }) => {
        service(DecideService, router);
      }),
    });
    const decision = await client.decide(context, details, []);

    expect(decision.isErrored()).toBe(false);
    expect(decision.isAllowed()).toBe(true);
  });

  test("calling `decide` creates a DENY SnipkitDecision if DecideResponse is denied", async () => {
    const key = "test-key";
    const fingerprint =
      "fp_1_ac8547705f1f45c5050f1424700dfa3f6f2f681b550ca4f3c19571585aea7a2c";
    const context = {
      key,
      fingerprint,
      runtime: "test",
      log,
      characteristics: [],
      getBody: () => Promise.resolve(undefined),
    };
    const details = {
      ip: "172.100.1.1",
      method: "GET",
      protocol: "http",
      host: "example.com",
      path: "/",
      headers: new Headers([["User-Agent", "curl/8.1.2"]]),
      extra: {
        "extra-test": "extra-test-value",
      },
    };

    const router = {
      decide: mock.fn((args) => {
        return new DecideResponse({
          decision: {
            conclusion: Conclusion.DENY,
          },
        });
      }),
    };

    const client = createClient({
      ...defaultRemoteClientOptions,
      transport: createRouterTransport(({ service }) => {
        service(DecideService, router);
      }),
    });
    const decision = await client.decide(context, details, []);

    expect(decision.isDenied()).toBe(true);
  });

  test("calling `decide` creates a CHALLENGE SnipkitDecision if DecideResponse is challenged", async () => {
    const key = "test-key";
    const fingerprint =
      "fp_1_ac8547705f1f45c5050f1424700dfa3f6f2f681b550ca4f3c19571585aea7a2c";
    const context = {
      key,
      fingerprint,
      runtime: "test",
      log,
      characteristics: [],
      getBody: () => Promise.resolve(undefined),
    };
    const details = {
      ip: "172.100.1.1",
      method: "GET",
      protocol: "http",
      host: "example.com",
      path: "/",
      headers: new Headers([["User-Agent", "curl/8.1.2"]]),
      extra: {
        "extra-test": "extra-test-value",
      },
    };

    const router = {
      decide: mock.fn((args) => {
        return new DecideResponse({
          decision: {
            conclusion: Conclusion.CHALLENGE,
          },
        });
      }),
    };

    const client = createClient({
      ...defaultRemoteClientOptions,
      transport: createRouterTransport(({ service }) => {
        service(DecideService, router);
      }),
    });
    const decision = await client.decide(context, details, []);

    expect(decision.isChallenged()).toBe(true);
  });

  test("calling `decide` creates an ERROR SnipkitDecision with default message if DecideResponse is error and no reason", async () => {
    const key = "test-key";
    const fingerprint =
      "fp_1_ac8547705f1f45c5050f1424700dfa3f6f2f681b550ca4f3c19571585aea7a2c";
    const context = {
      key,
      fingerprint,
      runtime: "test",
      log,
      characteristics: [],
      getBody: () => Promise.resolve(undefined),
    };
    const details = {
      ip: "172.100.1.1",
      method: "GET",
      protocol: "http",
      host: "example.com",
      path: "/",
      headers: new Headers([["User-Agent", "curl/8.1.2"]]),
      extra: {
        "extra-test": "extra-test-value",
      },
    };

    const router = {
      decide: mock.fn((args) => {
        return new DecideResponse({
          decision: {
            conclusion: Conclusion.ERROR,
          },
        });
      }),
    };

    const client = createClient({
      ...defaultRemoteClientOptions,
      transport: createRouterTransport(({ service }) => {
        service(DecideService, router);
      }),
    });
    const decision = await client.decide(context, details, []);

    expect(decision.isErrored()).toBe(true);
    expect(decision.reason).toMatchObject({
      message: "Unknown error occurred",
    });
  });

  test("calling `decide` creates an ERROR SnipkitDecision with message if DecideResponse if error and reason available", async () => {
    const key = "test-key";
    const fingerprint =
      "fp_1_ac8547705f1f45c5050f1424700dfa3f6f2f681b550ca4f3c19571585aea7a2c";
    const context = {
      key,
      fingerprint,
      runtime: "test",
      log,
      characteristics: [],
      getBody: () => Promise.resolve(undefined),
    };
    const details = {
      ip: "172.100.1.1",
      method: "GET",
      protocol: "http",
      host: "example.com",
      path: "/",
      headers: new Headers([["User-Agent", "curl/8.1.2"]]),
      extra: {
        "extra-test": "extra-test-value",
      },
    };

    const router = {
      decide: mock.fn((args) => {
        return new DecideResponse({
          decision: {
            conclusion: Conclusion.ERROR,
            reason: {
              reason: {
                case: "error",
                value: { message: "Boom!" },
              },
            },
          },
        });
      }),
    };

    const client = createClient({
      ...defaultRemoteClientOptions,
      transport: createRouterTransport(({ service }) => {
        service(DecideService, router);
      }),
    });
    const decision = await client.decide(context, details, []);

    expect(decision.isErrored()).toBe(true);
    expect(decision.reason).toMatchObject({
      message: "Boom!",
    });
  });

  test("calling `decide` creates an ERROR SnipkitDecision if DecideResponse is unspecified", async () => {
    const key = "test-key";
    const fingerprint =
      "fp_1_ac8547705f1f45c5050f1424700dfa3f6f2f681b550ca4f3c19571585aea7a2c";
    const context = {
      key,
      fingerprint,
      runtime: "test",
      log,
      characteristics: [],
      getBody: () => Promise.resolve(undefined),
    };
    const details = {
      ip: "172.100.1.1",
      method: "GET",
      protocol: "http",
      host: "example.com",
      path: "/",
      headers: new Headers([["User-Agent", "curl/8.1.2"]]),
      extra: {
        "extra-test": "extra-test-value",
      },
    };

    const router = {
      decide: mock.fn((args) => {
        return new DecideResponse({
          decision: {
            conclusion: Conclusion.UNSPECIFIED,
          },
        });
      }),
    };

    const client = createClient({
      ...defaultRemoteClientOptions,
      transport: createRouterTransport(({ service }) => {
        service(DecideService, router);
      }),
    });
    const decision = await client.decide(context, details, []);

    expect(decision.isErrored()).toBe(true);
    expect(decision.isAllowed()).toBe(true);
  });

  test("calling `report` will use `waitUntil` if available", async () => {
    const [promise, resolve] = deferred();

    const key = "test-key";
    const fingerprint =
      "fp_1_ac8547705f1f45c5050f1424700dfa3f6f2f681b550ca4f3c19571585aea7a2c";
    const context = {
      key,
      fingerprint,
      runtime: "test",
      log,
      characteristics: [],
      getBody: () => Promise.resolve(undefined),
      waitUntil: mock.fn((promise: Promise<unknown>) => {
        promise.then(() => resolve());
      }),
    };
    const details = {
      ip: "172.100.1.1",
      method: "GET",
      protocol: "http",
      host: "example.com",
      path: "/",
      headers: new Headers([["User-Agent", "curl/8.1.2"]]),
      extra: {
        "extra-test": "extra-test-value",
      },
      email: "test@example.com",
    };

    const router = {
      report: () => {
        return new ReportResponse({});
      },
    };

    const client = createClient({
      ...defaultRemoteClientOptions,
      transport: createRouterTransport(({ service }) => {
        service(DecideService, router);
      }),
    });
    const decision = new SnipkitAllowDecision({
      ttl: 0,
      reason: new SnipkitTestReason(),
      results: [],
    });
    client.report(context, details, decision, []);

    await promise;

    expect(context.waitUntil.mock.callCount()).toEqual(1);
  });

  test("calling `report` will make RPC call with ALLOW decision", async () => {
    const key = "test-key";
    const fingerprint =
      "fp_1_ac8547705f1f45c5050f1424700dfa3f6f2f681b550ca4f3c19571585aea7a2c";
    const context = {
      key,
      fingerprint,
      runtime: "test",
      log,
      characteristics: [],
      getBody: () => Promise.resolve(undefined),
    };
    const details = {
      ip: "172.100.1.1",
      method: "GET",
      protocol: "http",
      host: "example.com",
      path: "/",
      headers: new Headers([["User-Agent", "curl/8.1.2"]]),
      extra: {
        "extra-test": "extra-test-value",
      },
      email: "test@example.com",
    };

    const [promise, resolve] = deferred();

    const router = {
      report: mock.fn((args) => {
        resolve();
        return new ReportResponse({});
      }),
    };

    const client = createClient({
      ...defaultRemoteClientOptions,
      transport: createRouterTransport(({ service }) => {
        service(DecideService, router);
      }),
    });
    const decision = new SnipkitAllowDecision({
      ttl: 0,
      reason: new SnipkitTestReason(),
      results: [],
    });
    client.report(context, details, decision, []);

    await promise;

    expect(router.report.mock.callCount()).toEqual(1);
    expect(router.report.mock.calls[0].arguments).toEqual([
      new ReportRequest({
        sdkStack: SDKStack.SDK_STACK_NODEJS,
        sdkVersion: "__SNIPKIT_SDK_VERSION__",
        details: {
          ...details,
          headers: { "user-agent": "curl/8.1.2" },
        },
        decision: {
          id: decision.id,
          conclusion: Conclusion.ALLOW,
          reason: new Reason(),
          ruleResults: [],
        },
      }),
      expect.anything(),
    ]);
  });

  test("calling `report` will make RPC call with DENY decision", async () => {
    const key = "test-key";
    const fingerprint =
      "fp_1_ac8547705f1f45c5050f1424700dfa3f6f2f681b550ca4f3c19571585aea7a2c";
    const context = {
      key,
      fingerprint,
      runtime: "test",
      log,
      characteristics: [],
      getBody: () => Promise.resolve(undefined),
    };
    const details = {
      ip: "172.100.1.1",
      method: "GET",
      protocol: "http",
      host: "example.com",
      path: "/",
      headers: new Headers([["User-Agent", "curl/8.1.2"]]),
      extra: {
        "extra-test": "extra-test-value",
      },
    };

    const [promise, resolve] = deferred();

    const router = {
      report: mock.fn((args) => {
        resolve();
        return new ReportResponse({});
      }),
    };

    const client = createClient({
      ...defaultRemoteClientOptions,
      transport: createRouterTransport(({ service }) => {
        service(DecideService, router);
      }),
    });
    const decision = new SnipkitDenyDecision({
      ttl: 0,
      reason: new SnipkitTestReason(),
      results: [],
    });
    client.report(context, details, decision, []);

    await promise;

    expect(router.report.mock.callCount()).toEqual(1);
    expect(router.report.mock.calls[0].arguments).toEqual([
      new ReportRequest({
        sdkStack: SDKStack.SDK_STACK_NODEJS,
        sdkVersion: "__SNIPKIT_SDK_VERSION__",
        details: {
          ...details,
          headers: { "user-agent": "curl/8.1.2" },
        },
        decision: {
          id: decision.id,
          conclusion: Conclusion.DENY,
          reason: new Reason(),
          ruleResults: [],
        },
      }),
      expect.anything(),
    ]);
  });

  test("calling `report` will make RPC call with ERROR decision", async () => {
    const key = "test-key";
    const fingerprint =
      "fp_1_ac8547705f1f45c5050f1424700dfa3f6f2f681b550ca4f3c19571585aea7a2c";
    const context = {
      key,
      fingerprint,
      runtime: "test",
      log,
      characteristics: [],
      getBody: () => Promise.resolve(undefined),
    };
    const details = {
      ip: "172.100.1.1",
      method: "GET",
      protocol: "http",
      host: "example.com",
      path: "/",
      headers: new Headers([["User-Agent", "curl/8.1.2"]]),
      extra: {
        "extra-test": "extra-test-value",
      },
    };

    const [promise, resolve] = deferred();

    const router = {
      report: mock.fn((args) => {
        resolve();
        return new ReportResponse({});
      }),
    };

    const client = createClient({
      ...defaultRemoteClientOptions,
      transport: createRouterTransport(({ service }) => {
        service(DecideService, router);
      }),
    });
    const decision = new SnipkitErrorDecision({
      ttl: 0,
      reason: new SnipkitErrorReason("Failure"),
      results: [],
    });
    client.report(context, details, decision, []);

    await promise;

    expect(router.report.mock.callCount()).toEqual(1);
    expect(router.report.mock.calls[0].arguments).toEqual([
      new ReportRequest({
        sdkStack: SDKStack.SDK_STACK_NODEJS,
        sdkVersion: "__SNIPKIT_SDK_VERSION__",
        details: {
          ...details,
          headers: { "user-agent": "curl/8.1.2" },
        },
        decision: {
          id: decision.id,
          conclusion: Conclusion.ERROR,
          reason: new Reason({
            reason: {
              case: "error",
              value: {
                message: "Failure",
              },
            },
          }),
          ruleResults: [],
        },
      }),
      expect.anything(),
    ]);
  });

  test("calling `report` will make RPC call with CHALLENGE decision", async () => {
    const key = "test-key";
    const fingerprint =
      "fp_1_ac8547705f1f45c5050f1424700dfa3f6f2f681b550ca4f3c19571585aea7a2c";
    const context = {
      key,
      fingerprint,
      runtime: "test",
      log,
      characteristics: [],
      getBody: () => Promise.resolve(undefined),
    };
    const details = {
      ip: "172.100.1.1",
      method: "GET",
      protocol: "http",
      host: "example.com",
      path: "/",
      headers: new Headers([["User-Agent", "curl/8.1.2"]]),
      extra: {
        "extra-test": "extra-test-value",
      },
    };

    const [promise, resolve] = deferred();

    const router = {
      report: mock.fn((args) => {
        resolve();
        return new ReportResponse({});
      }),
    };

    const client = createClient({
      ...defaultRemoteClientOptions,
      transport: createRouterTransport(({ service }) => {
        service(DecideService, router);
      }),
    });
    const decision = new SnipkitChallengeDecision({
      ttl: 0,
      reason: new SnipkitTestReason(),
      results: [],
    });
    client.report(context, details, decision, []);

    await promise;

    expect(router.report.mock.callCount()).toEqual(1);
    expect(router.report.mock.calls[0].arguments).toEqual([
      new ReportRequest({
        sdkStack: SDKStack.SDK_STACK_NODEJS,
        sdkVersion: "__SNIPKIT_SDK_VERSION__",
        details: {
          ...details,
          headers: { "user-agent": "curl/8.1.2" },
        },
        decision: {
          id: decision.id,
          conclusion: Conclusion.CHALLENGE,
          reason: new Reason(),
          ruleResults: [],
        },
      }),
      expect.anything(),
    ]);
  });

  test("calling `report` will make RPC call with UNSPECIFIED decision if invalid", async () => {
    const key = "test-key";
    const fingerprint =
      "fp_1_ac8547705f1f45c5050f1424700dfa3f6f2f681b550ca4f3c19571585aea7a2c";
    const context = {
      key,
      fingerprint,
      runtime: "test",
      log,
      characteristics: [],
      getBody: () => Promise.resolve(undefined),
    };
    const details = {
      ip: "172.100.1.1",
      method: "GET",
      protocol: "http",
      host: "example.com",
      path: "/",
      headers: new Headers([["User-Agent", "curl/8.1.2"]]),
      extra: {
        "extra-test": "extra-test-value",
      },
    };

    const [promise, resolve] = deferred();

    const router = {
      report: mock.fn((args) => {
        resolve();
        return new ReportResponse({});
      }),
    };

    const client = createClient({
      ...defaultRemoteClientOptions,
      transport: createRouterTransport(({ service }) => {
        service(DecideService, router);
      }),
    });
    const decision = new SnipkitInvalidDecision();
    client.report(context, details, decision, []);

    await promise;

    expect(router.report.mock.callCount()).toEqual(1);
    expect(router.report.mock.calls[0].arguments).toEqual([
      new ReportRequest({
        sdkStack: SDKStack.SDK_STACK_NODEJS,
        sdkVersion: "__SNIPKIT_SDK_VERSION__",
        details: {
          ...details,
          headers: { "user-agent": "curl/8.1.2" },
        },
        decision: {
          id: decision.id,
          conclusion: Conclusion.UNSPECIFIED,
          reason: new Reason(),
          ruleResults: [],
        },
      }),
      expect.anything(),
    ]);
  });

  test("calling `report` will make RPC with rules included", async () => {
    const key = "test-key";
    const fingerprint =
      "fp_1_ac8547705f1f45c5050f1424700dfa3f6f2f681b550ca4f3c19571585aea7a2c";
    const context = {
      key,
      fingerprint,
      runtime: "test",
      log,
      characteristics: [],
      getBody: () => Promise.resolve(undefined),
    };
    const details = {
      ip: "172.100.1.1",
      method: "GET",
      protocol: "http",
      host: "example.com",
      path: "/",
      headers: new Headers([["User-Agent", "curl/8.1.2"]]),
      extra: {
        "extra-test": "extra-test-value",
      },
      email: "abc@example.com",
    };

    const [promise, resolve] = deferred();

    const router = {
      report: mock.fn((args) => {
        resolve();
        return new ReportResponse({});
      }),
    };

    const client = createClient({
      ...defaultRemoteClientOptions,
      transport: createRouterTransport(({ service }) => {
        service(DecideService, router);
      }),
    });

    const decision = new SnipkitDenyDecision({
      ttl: 0,
      reason: new SnipkitTestReason(),
      results: [
        new SnipkitRuleResult({
          ruleId: "test-rule-id",
          fingerprint: "test-fingerprint",
          ttl: 0,
          state: "RUN",
          conclusion: "DENY",
          reason: new SnipkitReason(),
        }),
      ],
    });
    const rule: SnipkitRule = {
      version: 0,
      type: "TEST_RULE",
      mode: "LIVE",
      priority: 1,
      validate: mock.fn(),
      protect: mock.fn(),
    };
    client.report(context, details, decision, [rule]);

    await promise;

    expect(router.report.mock.callCount()).toEqual(1);
    expect(router.report.mock.calls[0].arguments).toEqual([
      new ReportRequest({
        sdkStack: SDKStack.SDK_STACK_NODEJS,
        sdkVersion: "__SNIPKIT_SDK_VERSION__",
        details: {
          ...details,
          headers: { "user-agent": "curl/8.1.2" },
        },
        decision: {
          id: decision.id,
          conclusion: Conclusion.DENY,
          reason: new Reason(),
          ruleResults: [
            new RuleResult({
              ruleId: "test-rule-id",
              fingerprint: "test-fingerprint",
              state: RuleState.RUN,
              conclusion: Conclusion.DENY,
              reason: new Reason(),
            }),
          ],
        },
        rules: [new Rule()],
      }),
      expect.anything(),
    ]);
  });

  test("calling `report` only logs if it fails", async () => {
    const key = "test-key";
    const fingerprint =
      "fp_1_ac8547705f1f45c5050f1424700dfa3f6f2f681b550ca4f3c19571585aea7a2c";
    const context = {
      key,
      fingerprint,
      runtime: "test",
      log,
      characteristics: [],
      getBody: () => Promise.resolve(undefined),
    };
    const details = {
      ip: "172.100.1.1",
      method: "GET",
      protocol: "http",
      host: "example.com",
      path: "/",
      headers: new Headers([["User-Agent", "curl/8.1.2"]]),
      extra: {
        "extra-test": "extra-test-value",
      },
    };

    const [promise, resolve] = deferred();

    const logSpy = mock.method(log, "info", () => {
      resolve();
    });

    const client = createClient({
      ...defaultRemoteClientOptions,
      transport: createRouterTransport(({ service }) => {
        service(DecideService, {});
      }),
    });
    const decision = new SnipkitAllowDecision({
      ttl: 0,
      reason: new SnipkitTestReason(),
      results: [],
    });
    client.report(context, details, decision, []);

    await promise;

    expect(logSpy.mock.callCount()).toEqual(1);
  });

  test("calling `decide` will make RPC with top level characteristics included", async () => {
    const key = "test-key";
    const fingerprint =
      "fp_1_ac8547705f1f45c5050f1424700dfa3f6f2f681b550ca4f3c19571585aea7a2c";
    const context = {
      key,
      fingerprint,
      runtime: "test",
      log,
      characteristics: ["src.ip"],
      getBody: () => Promise.resolve(undefined),
    };
    const details = {
      ip: "172.100.1.1",
      method: "GET",
      protocol: "http",
      host: "example.com",
      path: "/",
      headers: new Headers([["User-Agent", "curl/8.1.2"]]),
      extra: {
        "extra-test": "extra-test-value",
      },
      email: "abc@example.com",
    };

    const router = {
      decide: mock.fn((args) => {
        return new DecideResponse({
          decision: {
            conclusion: Conclusion.ALLOW,
          },
        });
      }),
    };

    const client = createClient({
      ...defaultRemoteClientOptions,
      transport: createRouterTransport(({ service }) => {
        service(DecideService, router);
      }),
    });
    const _ = await client.decide(context, details, []);

    expect(router.decide.mock.callCount()).toEqual(1);
    expect(router.decide.mock.calls[0].arguments).toEqual([
      new DecideRequest({
        details: {
          ...details,
          headers: { "user-agent": "curl/8.1.2" },
        },
        characteristics: ["src.ip"],
        rules: [],
        sdkStack: SDKStack.SDK_STACK_NODEJS,
        sdkVersion: "__SNIPKIT_SDK_VERSION__",
      }),
      expect.anything(),
    ]);
  });

  test("calling `report` will make RPC with top level characteristics included", async () => {
    const key = "test-key";
    const fingerprint =
      "fp_1_ac8547705f1f45c5050f1424700dfa3f6f2f681b550ca4f3c19571585aea7a2c";
    const context = {
      key,
      fingerprint,
      runtime: "test",
      log,
      characteristics: ["ip.src"],
      getBody: () => Promise.resolve(undefined),
    };
    const details = {
      ip: "172.100.1.1",
      method: "GET",
      protocol: "http",
      host: "example.com",
      path: "/",
      headers: new Headers([["User-Agent", "curl/8.1.2"]]),
      extra: {
        "extra-test": "extra-test-value",
      },
      email: "abc@example.com",
    };

    const [promise, resolve] = deferred();

    const router = {
      report: mock.fn((args) => {
        resolve();
        return new ReportResponse({});
      }),
    };

    const client = createClient({
      ...defaultRemoteClientOptions,
      transport: createRouterTransport(({ service }) => {
        service(DecideService, router);
      }),
    });

    const decision = new SnipkitDenyDecision({
      ttl: 0,
      reason: new SnipkitTestReason(),
      results: [
        new SnipkitRuleResult({
          ruleId: "test-rule-id",
          fingerprint: "test-fingerprint",
          ttl: 0,
          state: "RUN",
          conclusion: "DENY",
          reason: new SnipkitReason(),
        }),
      ],
    });
    client.report(context, details, decision, []);

    await promise;

    expect(router.report.mock.callCount()).toEqual(1);
    expect(router.report.mock.calls[0].arguments).toEqual([
      new ReportRequest({
        sdkStack: SDKStack.SDK_STACK_NODEJS,
        sdkVersion: "__SNIPKIT_SDK_VERSION__",
        details: {
          ...details,
          headers: { "user-agent": "curl/8.1.2" },
        },
        decision: {
          id: decision.id,
          conclusion: Conclusion.DENY,
          reason: new Reason(),
          ruleResults: [
            new RuleResult({
              ruleId: "test-rule-id",
              fingerprint: "test-fingerprint",
              state: RuleState.RUN,
              conclusion: Conclusion.DENY,
              reason: new Reason(),
            }),
          ],
        },
        rules: [],
        characteristics: ["ip.src"],
      }),
      expect.anything(),
    ]);
  });
});
