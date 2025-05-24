import { describe, mock, test } from "node:test";
import { expect } from "expect";
import {
  SnipkitModeToProtocol,
  SnipkitEmailTypeToProtocol,
  SnipkitEmailTypeFromProtocol,
  SnipkitStackToProtocol,
  SnipkitRuleStateToProtocol,
  SnipkitRuleStateFromProtocol,
  SnipkitConclusionToProtocol,
  SnipkitConclusionFromProtocol,
  SnipkitReasonFromProtocol,
  SnipkitReasonToProtocol,
  SnipkitRuleResultToProtocol,
  SnipkitRuleResultFromProtocol,
  SnipkitDecisionToProtocol,
  SnipkitDecisionFromProtocol,
  SnipkitRuleToProtocol,
} from "../convert.js";
import {
  Conclusion,
  Decision,
  EmailType,
  Mode,
  RateLimitAlgorithm,
  Reason,
  Rule,
  RuleResult,
  RuleState,
  SDKStack,
} from "../proto/decide/v1alpha1/decide_pb.js";
import type {
  SnipkitBotRule,
  SnipkitEmailRule,
  SnipkitTokenBucketRateLimitRule,
  SnipkitFixedWindowRateLimitRule,
  SnipkitSlidingWindowRateLimitRule,
  SnipkitShieldRule,
  SnipkitRule,
  SnipkitSensitiveInfoRule,
} from "../index.js";
import {
  SnipkitAllowDecision,
  SnipkitBotReason,
  SnipkitChallengeDecision,
  SnipkitDenyDecision,
  SnipkitEdgeRuleReason,
  SnipkitEmailReason,
  SnipkitErrorDecision,
  SnipkitErrorReason,
  SnipkitRateLimitReason,
  SnipkitReason,
  SnipkitRuleResult,
  SnipkitShieldReason,
  SnipkitIpDetails,
  SnipkitSensitiveInfoReason,
} from "../index.js";
import { Timestamp } from "@bufbuild/protobuf";

describe("convert", () => {
  test("SnipkitModeToProtocol", () => {
    expect(SnipkitModeToProtocol("LIVE")).toEqual(Mode.LIVE);
    expect(SnipkitModeToProtocol("DRY_RUN")).toEqual(Mode.DRY_RUN);
    expect(
      SnipkitModeToProtocol(
        // @ts-expect-error
        "NOT_VALID",
      ),
    ).toEqual(Mode.UNSPECIFIED);
  });

  test("SnipkitEmailTypeToProtocol", () => {
    expect(SnipkitEmailTypeToProtocol("DISPOSABLE")).toEqual(
      EmailType.DISPOSABLE,
    );
    expect(SnipkitEmailTypeToProtocol("FREE")).toEqual(EmailType.FREE);
    expect(SnipkitEmailTypeToProtocol("INVALID")).toEqual(EmailType.INVALID);
    expect(SnipkitEmailTypeToProtocol("NO_GRAVATAR")).toEqual(
      EmailType.NO_GRAVATAR,
    );
    expect(SnipkitEmailTypeToProtocol("NO_MX_RECORDS")).toEqual(
      EmailType.NO_MX_RECORDS,
    );
    expect(
      SnipkitEmailTypeToProtocol(
        // @ts-expect-error
        "NOT_VALID",
      ),
    ).toEqual(EmailType.UNSPECIFIED);
  });

  test("SnipkitEmailTypeFromProtocol", () => {
    expect(SnipkitEmailTypeFromProtocol(EmailType.DISPOSABLE)).toEqual(
      "DISPOSABLE",
    );
    expect(SnipkitEmailTypeFromProtocol(EmailType.FREE)).toEqual("FREE");
    expect(SnipkitEmailTypeFromProtocol(EmailType.INVALID)).toEqual("INVALID");
    expect(SnipkitEmailTypeFromProtocol(EmailType.NO_GRAVATAR)).toEqual(
      "NO_GRAVATAR",
    );
    expect(SnipkitEmailTypeFromProtocol(EmailType.NO_MX_RECORDS)).toEqual(
      "NO_MX_RECORDS",
    );
    expect(() => {
      SnipkitEmailTypeFromProtocol(EmailType.UNSPECIFIED);
    }).toThrow("Invalid EmailType");
    expect(() => {
      SnipkitEmailTypeFromProtocol(
        // @ts-expect-error
        99,
      );
    }).toThrow("Invalid EmailType");
  });

  test("SnipkitStackToProtocol", () => {
    expect(SnipkitStackToProtocol("NODEJS")).toEqual(SDKStack.SDK_STACK_NODEJS);
    expect(SnipkitStackToProtocol("NEXTJS")).toEqual(SDKStack.SDK_STACK_NEXTJS);
    expect(SnipkitStackToProtocol("BUN")).toEqual(SDKStack.SDK_STACK_BUN);
    expect(SnipkitStackToProtocol("SVELTEKIT")).toEqual(
      SDKStack.SDK_STACK_SVELTEKIT,
    );
    expect(SnipkitStackToProtocol("DENO")).toEqual(SDKStack.SDK_STACK_DENO);
    expect(SnipkitStackToProtocol("NESTJS")).toEqual(SDKStack.SDK_STACK_NESTJS);
    expect(SnipkitStackToProtocol("REMIX")).toEqual(SDKStack.SDK_STACK_REMIX);
    expect(SnipkitStackToProtocol("ASTRO")).toEqual(SDKStack.SDK_STACK_ASTRO);
    expect(
      SnipkitStackToProtocol(
        // @ts-expect-error
        "NOT_VALID",
      ),
    ).toEqual(SDKStack.SDK_STACK_UNSPECIFIED);
  });

  test("SnipkitRuleStateToProtocol", () => {
    expect(SnipkitRuleStateToProtocol("CACHED")).toEqual(RuleState.CACHED);
    expect(SnipkitRuleStateToProtocol("DRY_RUN")).toEqual(RuleState.DRY_RUN);
    expect(SnipkitRuleStateToProtocol("NOT_RUN")).toEqual(RuleState.NOT_RUN);
    expect(SnipkitRuleStateToProtocol("RUN")).toEqual(RuleState.RUN);
    expect(
      SnipkitRuleStateToProtocol(
        // @ts-expect-error
        "NOT_VALID",
      ),
    ).toEqual(RuleState.UNSPECIFIED);
  });

  test("SnipkitRuleStateFromProtocol", () => {
    expect(SnipkitRuleStateFromProtocol(RuleState.CACHED)).toEqual("CACHED");
    expect(SnipkitRuleStateFromProtocol(RuleState.DRY_RUN)).toEqual("DRY_RUN");
    expect(SnipkitRuleStateFromProtocol(RuleState.NOT_RUN)).toEqual("NOT_RUN");
    expect(SnipkitRuleStateFromProtocol(RuleState.RUN)).toEqual("RUN");
    expect(() => {
      SnipkitRuleStateFromProtocol(RuleState.UNSPECIFIED);
    }).toThrow("Invalid RuleState");
    expect(() => {
      SnipkitRuleStateFromProtocol(
        // @ts-expect-error
        99,
      );
    }).toThrow("Invalid RuleState");
  });

  test("SnipkitConclusionToProtocol", () => {
    expect(SnipkitConclusionToProtocol("ALLOW")).toEqual(Conclusion.ALLOW);
    expect(SnipkitConclusionToProtocol("CHALLENGE")).toEqual(
      Conclusion.CHALLENGE,
    );
    expect(SnipkitConclusionToProtocol("DENY")).toEqual(Conclusion.DENY);
    expect(SnipkitConclusionToProtocol("ERROR")).toEqual(Conclusion.ERROR);
    expect(
      SnipkitConclusionToProtocol(
        // @ts-expect-error
        "NOT_VALID",
      ),
    ).toEqual(Conclusion.UNSPECIFIED);
  });

  test("SnipkitConclusionFromProtocol", () => {
    expect(SnipkitConclusionFromProtocol(Conclusion.ALLOW)).toEqual("ALLOW");
    expect(SnipkitConclusionFromProtocol(Conclusion.CHALLENGE)).toEqual(
      "CHALLENGE",
    );
    expect(SnipkitConclusionFromProtocol(Conclusion.DENY)).toEqual("DENY");
    expect(SnipkitConclusionFromProtocol(Conclusion.ERROR)).toEqual("ERROR");
    expect(() => {
      SnipkitConclusionFromProtocol(Conclusion.UNSPECIFIED);
    }).toThrow("Invalid Conclusion");
    expect(() => {
      SnipkitConclusionFromProtocol(
        // @ts-expect-error
        99,
      );
    }).toThrow("Invalid Conclusion");
  });

  test("SnipkitReasonFromProtocol", () => {
    expect(SnipkitReasonFromProtocol()).toBeInstanceOf(SnipkitReason);
    expect(
      SnipkitReasonFromProtocol(
        new Reason({
          reason: {
            case: "botV2",
            value: {
              allowed: [],
              denied: [],
            },
          },
        }),
      ),
    ).toBeInstanceOf(SnipkitBotReason);
    expect(
      SnipkitReasonFromProtocol(
        new Reason({
          reason: {
            case: "edgeRule",
            value: {},
          },
        }),
      ),
    ).toBeInstanceOf(SnipkitEdgeRuleReason);
    expect(
      SnipkitReasonFromProtocol(
        new Reason({
          reason: {
            case: "email",
            value: {
              emailTypes: [EmailType.DISPOSABLE],
            },
          },
        }),
      ),
    ).toBeInstanceOf(SnipkitEmailReason);
    expect(
      SnipkitReasonFromProtocol(
        new Reason({
          reason: {
            case: "error",
            value: {
              message: "Test error",
            },
          },
        }),
      ),
    ).toBeInstanceOf(SnipkitErrorReason);
    expect(
      SnipkitReasonFromProtocol(
        new Reason({
          reason: {
            case: "rateLimit",
            value: {
              max: 1,
              count: 2,
              remaining: -1,
              resetInSeconds: 1000,
              windowInSeconds: 1000,
              resetTime: undefined,
            },
          },
        }),
      ),
    ).toBeInstanceOf(SnipkitRateLimitReason);
    expect(
      SnipkitReasonFromProtocol(
        new Reason({
          reason: {
            case: "rateLimit",
            value: {
              max: 1,
              count: 2,
              remaining: -1,
              resetInSeconds: 1000,
              windowInSeconds: 1000,
              resetTime: Timestamp.now(),
            },
          },
        }),
      ),
    ).toBeInstanceOf(SnipkitRateLimitReason);
    expect(
      SnipkitReasonFromProtocol(
        new Reason({
          reason: {
            case: "sensitiveInfo",
            value: {
              denied: [
                {
                  start: 0,
                  end: 16,
                  identifiedType: "credit-card-number",
                },
              ],
            },
          },
        }),
      ),
    ).toBeInstanceOf(SnipkitSensitiveInfoReason);
    expect(
      SnipkitReasonFromProtocol(
        new Reason({
          reason: {
            case: "shield",
            value: {
              shieldTriggered: true,
            },
          },
        }),
      ),
    ).toBeInstanceOf(SnipkitShieldReason);
    expect(SnipkitReasonFromProtocol(new Reason())).toBeInstanceOf(SnipkitReason);
    expect(
      SnipkitReasonFromProtocol(
        new Reason({
          reason: {
            // @ts-expect-error
            case: "NOT_VALID",
          },
        }),
      ),
    ).toBeInstanceOf(SnipkitReason);
    expect(() => {
      SnipkitReasonFromProtocol(
        // @ts-expect-error
        "NOT_VALID",
      );
    }).toThrow("Invalid Reason");
    expect(() => {
      SnipkitReasonFromProtocol({
        // @ts-expect-error
        reason: "NOT_VALID",
      });
    }).toThrow("Invalid Reason");
  });

  test("SnipkitReasonToProtocol", () => {
    expect(SnipkitReasonToProtocol(new SnipkitReason())).toBeInstanceOf(Reason);
    expect(
      SnipkitReasonToProtocol(
        new SnipkitRateLimitReason({
          max: 1,
          remaining: -1,
          reset: 100,
          window: 100,
        }),
      ),
    ).toEqual(
      new Reason({
        reason: {
          case: "rateLimit",
          value: {
            max: 1,
            remaining: -1,
            resetInSeconds: 100,
            windowInSeconds: 100,
          },
        },
      }),
    );
    const resetTime = new Date();
    expect(
      SnipkitReasonToProtocol(
        new SnipkitRateLimitReason({
          max: 1,
          remaining: -1,
          reset: 100,
          window: 100,
          resetTime,
        }),
      ),
    ).toEqual(
      new Reason({
        reason: {
          case: "rateLimit",
          value: {
            max: 1,
            remaining: -1,
            resetInSeconds: 100,
            windowInSeconds: 100,
            resetTime: Timestamp.fromDate(resetTime),
          },
        },
      }),
    );
    expect(
      SnipkitReasonToProtocol(
        new SnipkitBotReason({
          allowed: ["GOOGLE_CRAWLER"],
          denied: [],
          verified: true,
          spoofed: false,
        }),
      ),
    ).toEqual(
      new Reason({
        reason: {
          case: "botV2",
          value: {
            allowed: ["GOOGLE_CRAWLER"],
            denied: [],
            verified: true,
            spoofed: false,
          },
        },
      }),
    );
    expect(
      SnipkitReasonToProtocol(
        new SnipkitSensitiveInfoReason({
          denied: [
            {
              start: 0,
              end: 16,
              identifiedType: "credit-card-number",
            },
          ],
          allowed: [],
        }),
      ),
    ).toEqual(
      new Reason({
        reason: {
          case: "sensitiveInfo",
          value: {
            denied: [
              {
                start: 0,
                end: 16,
                identifiedType: "credit-card-number",
              },
            ],
          },
        },
      }),
    );
    expect(SnipkitReasonToProtocol(new SnipkitEdgeRuleReason())).toEqual(
      new Reason({
        reason: {
          case: "edgeRule",
          value: {},
        },
      }),
    );
    expect(
      SnipkitReasonToProtocol(new SnipkitShieldReason({ shieldTriggered: true })),
    ).toEqual(
      new Reason({
        reason: {
          case: "shield",
          value: {
            shieldTriggered: true,
          },
        },
      }),
    );
    expect(
      SnipkitReasonToProtocol(
        new SnipkitEmailReason({
          emailTypes: ["DISPOSABLE"],
        }),
      ),
    ).toEqual(
      new Reason({
        reason: {
          case: "email",
          value: {
            emailTypes: [EmailType.DISPOSABLE],
          },
        },
      }),
    );
    expect(SnipkitReasonToProtocol(new SnipkitErrorReason("Test error"))).toEqual(
      new Reason({
        reason: {
          case: "error",
          value: {
            message: "Test error",
          },
        },
      }),
    );
  });

  test("SnipkitRuleResultToProtocol", () => {
    expect(
      SnipkitRuleResultToProtocol(
        new SnipkitRuleResult({
          ruleId: "test-rule-id",
          fingerprint: "test-fingerprint",
          ttl: 0,
          state: "RUN",
          conclusion: "ALLOW",
          reason: new SnipkitReason(),
        }),
      ),
    ).toEqual(
      new RuleResult({
        ruleId: "test-rule-id",
        fingerprint: "test-fingerprint",
        state: RuleState.RUN,
        conclusion: Conclusion.ALLOW,
        reason: new Reason(),
      }),
    );
  });

  test("SnipkitRuleResultFromProtocol", () => {
    expect(
      SnipkitRuleResultFromProtocol(
        new RuleResult({
          ruleId: "test-rule-id",
          fingerprint: "test-fingerprint",
          state: RuleState.RUN,
          conclusion: Conclusion.ALLOW,
          reason: new Reason(),
        }),
      ),
    ).toEqual(
      new SnipkitRuleResult({
        ruleId: "test-rule-id",
        fingerprint: "test-fingerprint",
        ttl: 0,
        state: "RUN",
        conclusion: "ALLOW",
        reason: new SnipkitReason(),
      }),
    );
  });

  test("SnipkitDecisionToProtocol", () => {
    expect(
      SnipkitDecisionToProtocol(
        new SnipkitAllowDecision({
          id: "abc123",
          ttl: 0,
          results: [],
          reason: new SnipkitReason(),
          ip: new SnipkitIpDetails(),
        }),
      ),
    ).toEqual(
      new Decision({
        id: "abc123",
        conclusion: Conclusion.ALLOW,
        ruleResults: [],
        reason: new Reason(),
      }),
    );
  });

  test("SnipkitDecisionFromProtocol", () => {
    expect(SnipkitDecisionFromProtocol()).toBeInstanceOf(SnipkitErrorDecision);
    expect(SnipkitDecisionFromProtocol(new Decision())).toBeInstanceOf(
      SnipkitErrorDecision,
    );
    expect(
      SnipkitDecisionFromProtocol(
        new Decision({
          conclusion: Conclusion.ALLOW,
        }),
      ),
    ).toBeInstanceOf(SnipkitAllowDecision);
    expect(
      SnipkitDecisionFromProtocol(
        new Decision({
          conclusion: Conclusion.DENY,
        }),
      ),
    ).toBeInstanceOf(SnipkitDenyDecision);
    expect(
      SnipkitDecisionFromProtocol(
        new Decision({
          conclusion: Conclusion.CHALLENGE,
        }),
      ),
    ).toBeInstanceOf(SnipkitChallengeDecision);
    expect(
      SnipkitDecisionFromProtocol(
        new Decision({
          conclusion: Conclusion.ERROR,
        }),
      ),
    ).toBeInstanceOf(SnipkitErrorDecision);
    expect(
      SnipkitDecisionFromProtocol({
        // @ts-expect-error
        conclusion: "NOT_VALID",
      }),
    ).toBeInstanceOf(SnipkitErrorDecision);
    expect(
      SnipkitDecisionFromProtocol(
        // @ts-expect-error
        "NOT_VALID",
      ),
    ).toBeInstanceOf(SnipkitErrorDecision);
  });

  test("SnipkitRuleToProtocol", () => {
    const unknownRule: SnipkitRule = {
      version: 0,
      type: "UNKNOWN",
      mode: "DRY_RUN",
      priority: 1,
      validate: mock.fn(),
      protect: mock.fn(),
    };
    expect(SnipkitRuleToProtocol(unknownRule)).toEqual(new Rule({}));

    const tokenBucketRule: SnipkitTokenBucketRateLimitRule<{}> = {
      version: 0,
      type: "RATE_LIMIT",
      mode: "DRY_RUN",
      priority: 1,
      algorithm: "TOKEN_BUCKET",
      refillRate: 1,
      interval: 1,
      capacity: 1,
      validate: mock.fn(),
      protect: mock.fn(),
    };
    expect(SnipkitRuleToProtocol(tokenBucketRule)).toEqual(
      new Rule({
        rule: {
          case: "rateLimit",
          value: {
            mode: Mode.DRY_RUN,
            algorithm: RateLimitAlgorithm.TOKEN_BUCKET,
            refillRate: 1,
            interval: 1,
            capacity: 1,
          },
        },
      }),
    );

    const fixedWindowRule: SnipkitFixedWindowRateLimitRule<{}> = {
      version: 0,
      type: "RATE_LIMIT",
      mode: "DRY_RUN",
      priority: 1,
      algorithm: "FIXED_WINDOW",
      max: 1,
      window: 1,
      validate: mock.fn(),
      protect: mock.fn(),
    };
    expect(SnipkitRuleToProtocol(fixedWindowRule)).toEqual(
      new Rule({
        rule: {
          case: "rateLimit",
          value: {
            mode: Mode.DRY_RUN,
            algorithm: RateLimitAlgorithm.FIXED_WINDOW,
            max: 1,
            windowInSeconds: 1,
          },
        },
      }),
    );

    const slidingWindowRule: SnipkitSlidingWindowRateLimitRule<{}> = {
      version: 0,
      type: "RATE_LIMIT",
      mode: "DRY_RUN",
      priority: 1,
      algorithm: "SLIDING_WINDOW",
      max: 1,
      interval: 1,
      validate: mock.fn(),
      protect: mock.fn(),
    };
    expect(SnipkitRuleToProtocol(slidingWindowRule)).toEqual(
      new Rule({
        rule: {
          case: "rateLimit",
          value: {
            mode: Mode.DRY_RUN,
            algorithm: RateLimitAlgorithm.SLIDING_WINDOW,
            max: 1,
            interval: 1,
          },
        },
      }),
    );

    const emailRule: SnipkitEmailRule<{ email: string }> = {
      version: 0,
      type: "EMAIL",
      mode: "DRY_RUN",
      priority: 1,
      allow: [],
      deny: ["INVALID"],
      requireTopLevelDomain: false,
      allowDomainLiteral: false,
      validate() {
        throw new Error("should not be called");
      },
      protect() {
        throw new Error("should not be called");
      },
    };
    expect(SnipkitRuleToProtocol(emailRule)).toEqual(
      new Rule({
        rule: {
          case: "email",
          value: {
            mode: Mode.DRY_RUN,
            allow: [],
            deny: [EmailType.INVALID],
          },
        },
      }),
    );

    const botRule: SnipkitBotRule<{}> = {
      version: 0,
      type: "BOT",
      mode: "DRY_RUN",
      priority: 1,
      allow: [],
      deny: [],
      validate() {
        throw new Error("should not be called");
      },
      protect() {
        throw new Error("should not be called");
      },
    };
    expect(SnipkitRuleToProtocol(botRule)).toEqual(
      new Rule({
        rule: {
          case: "botV2",
          value: {
            mode: Mode.DRY_RUN,
            allow: [],
            deny: [],
          },
        },
      }),
    );

    const shieldRule: SnipkitShieldRule<{}> = {
      version: 0,
      type: "SHIELD",
      mode: "DRY_RUN",
      priority: 1,
      validate: mock.fn(),
      protect: mock.fn(),
    };
    expect(SnipkitRuleToProtocol(shieldRule)).toEqual(
      new Rule({
        rule: {
          case: "shield",
          value: {
            mode: Mode.DRY_RUN,
            autoAdded: false,
          },
        },
      }),
    );

    const sensitiveInfoRule: SnipkitSensitiveInfoRule<{}> = {
      version: 0,
      type: "SENSITIVE_INFO",
      mode: "DRY_RUN",
      priority: 1,
      allow: [],
      deny: [],
      validate() {
        throw new Error("should not be called");
      },
      protect() {
        throw new Error("should not be called");
      },
    };
    expect(SnipkitRuleToProtocol(sensitiveInfoRule)).toEqual(
      new Rule({
        rule: {
          case: "sensitiveInfo",
          value: {
            mode: Mode.DRY_RUN,
            allow: [],
            deny: [],
          },
        },
      }),
    );
  });
});
