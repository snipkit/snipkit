import { describe, test } from "node:test";
import { expect } from "expect";
import * as env from "../index";

describe("env", () => {
  test("platform", () => {
    expect(env.platform({})).toBeUndefined();
    expect(env.platform({ FLY_APP_NAME: "" })).toBeUndefined();
    expect(env.platform({ FLY_APP_NAME: "foobar" })).toEqual("fly-io");
    expect(env.platform({ VERCEL: "" })).toBeUndefined();
    expect(env.platform({ VERCEL: "1" })).toEqual("vercel");
    expect(env.platform({ RENDER: "" })).toBeUndefined();
    expect(env.platform({ RENDER: "true" })).toEqual("render");
  });

  test("isDevelopment", () => {
    expect(env.isDevelopment({})).toEqual(false);
    expect(env.isDevelopment({ NODE_ENV: "production" })).toEqual(false);
    expect(env.isDevelopment({ NODE_ENV: "development" })).toEqual(true);
    expect(env.isDevelopment({ MODE: "production" })).toEqual(false);
    expect(env.isDevelopment({ MODE: "development" })).toEqual(true);
    expect(env.isDevelopment({ SNIPKIT_ENV: "production" })).toEqual(false);
    expect(env.isDevelopment({ SNIPKIT_ENV: "development" })).toEqual(true);
  });

  test("logLevel", () => {
    expect(env.logLevel({})).toEqual("warn");
    expect(env.logLevel({ SNIPKIT_LOG_LEVEL: "" })).toEqual("warn");
    expect(env.logLevel({ SNIPKIT_LOG_LEVEL: "invalid" })).toEqual("warn");
    expect(env.logLevel({ SNIPKIT_LOG_LEVEL: "debug" })).toEqual("debug");
    expect(env.logLevel({ SNIPKIT_LOG_LEVEL: "info" })).toEqual("info");
    expect(env.logLevel({ SNIPKIT_LOG_LEVEL: "warn" })).toEqual("warn");
    expect(env.logLevel({ SNIPKIT_LOG_LEVEL: "error" })).toEqual("error");
  });

  test("baseUrl", () => {
    // dev
    expect(env.baseUrl({ NODE_ENV: "development" })).toEqual(
      "https://decide-snipkit.khulnasoft.com",
    );
    expect(
      env.baseUrl({
        NODE_ENV: "development",
        SNIPKIT_BASE_URL: "anything-in-dev",
      }),
    ).toEqual("anything-in-dev");
    expect(env.baseUrl({ NODE_ENV: "development", FLY_APP_NAME: "" })).toEqual(
      "https://decide-snipkit.khulnasoft.com",
    );
    expect(
      env.baseUrl({ NODE_ENV: "development", FLY_APP_NAME: "foobar" }),
    ).toEqual("https://fly.decide-snipkit.khulnasoft.com");
    // prod
    expect(env.baseUrl({})).toEqual("https://decide-snipkit.khulnasoft.com");
    expect(
      env.baseUrl({
        SNIPKIT_BASE_URL: "https://decide-snipkit.khulnasoft.com",
      }),
    ).toEqual("https://decide-snipkit.khulnasoft.com");
    expect(
      env.baseUrl({
        SNIPKIT_BASE_URL: "https://decide.snipkittest.com",
      }),
    ).toEqual("https://decide.snipkittest.com");
    expect(
      env.baseUrl({
        SNIPKIT_BASE_URL: "https://fly.decide-snipkit.khulnasoft.com",
      }),
    ).toEqual("https://fly.decide-snipkit.khulnasoft.com");
    expect(
      env.baseUrl({
        SNIPKIT_BASE_URL: "https://fly.decide.snipkittest.com",
      }),
    ).toEqual("https://fly.decide.snipkittest.com");
    expect(
      env.baseUrl({
        SNIPKIT_BASE_URL: "https://decide.snipkit.orb.local:4082",
      }),
    ).toEqual("https://decide.snipkit.orb.local:4082");
    expect(env.baseUrl({ FLY_APP_NAME: "foobar" })).toEqual(
      "https://fly.decide-snipkit.khulnasoft.com",
    );
  });

  test("apiKey", () => {
    expect(env.apiKey({})).toBeUndefined();
    expect(env.apiKey({ SNIPKIT_KEY: "invalid" })).toBeUndefined();
    expect(env.apiKey({ SNIPKIT_KEY: "ajkey_abc123" })).toEqual("ajkey_abc123");
  });
});
