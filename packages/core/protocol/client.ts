import type { Transport } from "@connectrpc/connect";
import { createPromiseClient } from "@connectrpc/connect";
import {
  SnipkitDecisionFromProtocol,
  SnipkitDecisionToProtocol,
  SnipkitRuleToProtocol,
  SnipkitStackToProtocol,
} from "./convert.js";
import type {
  SnipkitContext,
  SnipkitRequestDetails,
  SnipkitRule,
  SnipkitStack,
} from "./index.js";
import { SnipkitDecision } from "./index.js";
import { DecideService } from "./proto/decide/v1alpha1/decide_connect.js";
import {
  DecideRequest,
  ReportRequest,
  Rule,
} from "./proto/decide/v1alpha1/decide_pb.js";

// TODO: Dedupe with `errorMessage` in core
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

export interface Client {
  decide(
    context: SnipkitContext,
    details: Partial<SnipkitRequestDetails>,
    rules: SnipkitRule[],
  ): Promise<SnipkitDecision>;
  // Call the Snipkit Log Decision API with details of the request and decision
  // made so we can log it.
  report(
    context: SnipkitContext,
    request: Partial<SnipkitRequestDetails>,
    decision: SnipkitDecision,
    rules: SnipkitRule[],
  ): void;
}

export type ClientOptions = {
  transport: Transport;
  baseUrl: string;
  timeout: number;
  sdkStack: SnipkitStack;
  sdkVersion: string;
};

export function createClient(options: ClientOptions): Client {
  const { transport, sdkVersion, baseUrl, timeout } = options;

  const sdkStack = SnipkitStackToProtocol(options.sdkStack);

  const client = createPromiseClient(DecideService, transport);

  return Object.freeze({
    async decide(
      context: SnipkitContext,
      details: SnipkitRequestDetails,
      rules: SnipkitRule[],
    ): Promise<SnipkitDecision> {
      const { log } = context;

      let hasValidateEmail = false;
      const protoRules: Rule[] = [];
      for (const rule of rules) {
        if (rule.type === "EMAIL") {
          hasValidateEmail = true;
        }

        protoRules.push(SnipkitRuleToProtocol(rule));
      }

      // Build the request object from the Protobuf generated class.
      const decideRequest = new DecideRequest({
        sdkStack,
        sdkVersion,
        characteristics: context.characteristics,
        details: {
          ip: details.ip,
          method: details.method,
          protocol: details.protocol,
          host: details.host,
          path: details.path,
          headers: Object.fromEntries(details.headers.entries()),
          cookies: details.cookies,
          query: details.query,
          // TODO(#208): Re-add body
          // body: details.body,
          extra: details.extra,
          email: typeof details.email === "string" ? details.email : undefined,
        },
        rules: protoRules,
      });

      log.debug("Decide request to %s", baseUrl);

      const response = await client.decide(decideRequest, {
        headers: { Authorization: `Bearer ${context.key}` },
        // If an email rule is configured, we double the timeout.
        // See https://github.com/snipkit/snipkit/issues/1697
        timeoutMs: hasValidateEmail ? timeout * 2 : timeout,
      });

      const decision = SnipkitDecisionFromProtocol(response.decision);

      log.debug(
        {
          id: decision.id,
          fingerprint: context.fingerprint,
          path: details.path,
          runtime: context.runtime,
          ttl: decision.ttl,
          conclusion: decision.conclusion,
          reason: decision.reason,
          ruleResults: decision.results,
        },
        "Decide response",
      );

      return decision;
    },

    report(
      context: SnipkitContext,
      details: SnipkitRequestDetails,
      decision: SnipkitDecision,
      rules: SnipkitRule[],
    ): void {
      const { log } = context;

      // Build the request object from the Protobuf generated class.
      const reportRequest = new ReportRequest({
        sdkStack,
        sdkVersion,
        characteristics: context.characteristics,
        details: {
          ip: details.ip,
          method: details.method,
          protocol: details.protocol,
          host: details.host,
          path: details.path,
          headers: Object.fromEntries(details.headers.entries()),
          cookies: details.cookies,
          query: details.query,
          // TODO(#208): Re-add body
          // body: details.body,
          extra: details.extra,
          email: typeof details.email === "string" ? details.email : undefined,
        },
        decision: SnipkitDecisionToProtocol(decision),
        rules: rules.map(SnipkitRuleToProtocol),
      });

      log.debug("Report request to %s", baseUrl);

      // We use the promise API directly to avoid returning a promise from this
      // function so execution can't be paused with `await`
      const reportPromise = client
        .report(reportRequest, {
          headers: { Authorization: `Bearer ${context.key}` },
          // Rules don't execute during `Report` so we don't adjust the timeout
          // if an email rule is configured.
          timeoutMs: 2_000, // 2 seconds
        })
        .then((response) => {
          log.debug(
            {
              id: decision.id,
              fingerprint: context.fingerprint,
              path: details.path,
              runtime: context.runtime,
              ttl: decision.ttl,
            },
            "Report response",
          );
        })
        .catch((err: unknown) => {
          log.info("Encountered problem sending report: %s", errorMessage(err));
        });

      if (typeof context.waitUntil === "function") {
        context.waitUntil(reportPromise);
      }
    },
  });
}
