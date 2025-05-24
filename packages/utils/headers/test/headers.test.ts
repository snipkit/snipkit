import { describe, test } from "node:test";
import { expect } from "expect";
import SnipkitHeaders from "../index";

describe("SnipkitHeaders", () => {
  test("can be constructed with no initializer", () => {
    const headers = new SnipkitHeaders();
    expect(Array.from(headers.entries())).toEqual([]);
  });

  test("can be constructed with Headers", () => {
    const headers = new SnipkitHeaders(new Headers([["abc", "xyz"]]));
    expect(Array.from(headers.entries())).toEqual([["abc", "xyz"]]);
  });

  test("can be constructed with SnipkitHeaders", () => {
    const headers = new SnipkitHeaders(new SnipkitHeaders([["abc", "xyz"]]));
    expect(Array.from(headers.entries())).toEqual([["abc", "xyz"]]);
  });

  test("can be constructed with a plain object", () => {
    const headers = new SnipkitHeaders({ abc: "xyz" });
    expect(Array.from(headers.entries())).toEqual([["abc", "xyz"]]);
  });

  test("can be constructed with a plain object", () => {
    const headers = new SnipkitHeaders({ abc: "xyz" });
    expect(Array.from(headers.entries())).toEqual([["abc", "xyz"]]);
  });

  test("can be constructed with a plain object containing multiple entries", () => {
    const headers = new SnipkitHeaders({ abc: ["xyz", "123"] });
    expect(Array.from(headers.entries())).toEqual([["abc", "xyz, 123"]]);
  });

  test("does not error if null is used as init", () => {
    // @ts-expect-error
    const headers = new SnipkitHeaders(null);
    expect(Array.from(headers.entries())).toEqual([]);
  });

  test("does not initialize header values if string used as init", () => {
    // @ts-expect-error
    const headers = new SnipkitHeaders("abc123");
    expect(Array.from(headers.entries())).toEqual([]);
  });

  test("filters undefined values from plain objects", () => {
    const headers = new SnipkitHeaders({ abc: undefined });
    expect(Array.from(headers.entries())).toEqual([]);
  });

  describe("#append(key, value)", () => {
    test("sets a header if not already set", () => {
      const headers = new SnipkitHeaders();
      headers.append("abc", "xyz");
      expect(Array.from(headers.entries())).toEqual([["abc", "xyz"]]);
    });

    test("adds another value to header if already set", () => {
      const headers = new SnipkitHeaders({ abc: "xyz" });
      headers.append("abc", "123");
      expect(Array.from(headers.entries())).toEqual([["abc", "xyz, 123"]]);
    });

    test("does NOT add cookie header", () => {
      const headers = new SnipkitHeaders();
      headers.append("cookie", "abc");
      headers.append("COOKIE", "123");
      headers.append("cOoKiE", "xyz");
      expect(Array.from(headers.entries())).toEqual([]);
    });

    test("does NOT add non-string keys", () => {
      const headers = new SnipkitHeaders();
      // @ts-expect-error
      headers.append(123, "abc");
      // @ts-expect-error
      headers.append({}, "abc");
      // @ts-expect-error
      headers.append([], "abc");
      // @ts-expect-error
      headers.append(function () {}, "abc");
      expect(Array.from(headers.entries())).toEqual([]);
    });

    test("does NOT add non-string values", () => {
      const headers = new SnipkitHeaders();
      // @ts-expect-error
      headers.append("abc", undefined);
      // @ts-expect-error
      headers.append("abc", 123);
      // @ts-expect-error
      headers.append("abc", {});
      // @ts-expect-error
      headers.append("abc", []);
      // @ts-expect-error
      headers.append("abc", function () {});
      expect(Array.from(headers.entries())).toEqual([]);
    });
  });

  describe("#set(key, value)", () => {
    test("sets a header if not already set", () => {
      const headers = new SnipkitHeaders();
      headers.set("abc", "xyz");
      expect(Array.from(headers.entries())).toEqual([["abc", "xyz"]]);
    });

    test("overrides a header if already set", () => {
      const headers = new SnipkitHeaders({ abc: "xyz" });
      headers.set("abc", "123");
      expect(Array.from(headers.entries())).toEqual([["abc", "123"]]);
    });

    test("does NOT add cookie header", () => {
      const headers = new SnipkitHeaders();
      headers.set("cookie", "abc");
      headers.set("COOKIE", "123");
      headers.set("cOoKiE", "xyz");
      expect(Array.from(headers.entries())).toEqual([]);
    });

    test("does NOT add non-string keys", () => {
      const headers = new SnipkitHeaders();
      // @ts-expect-error
      headers.set(123, "abc");
      // @ts-expect-error
      headers.set({}, "abc");
      // @ts-expect-error
      headers.set([], "abc");
      // @ts-expect-error
      headers.set(function () {}, "abc");
      expect(Array.from(headers.entries())).toEqual([]);
    });

    test("does NOT add non-string values", () => {
      const headers = new SnipkitHeaders();
      // @ts-expect-error
      headers.set("abc", undefined);
      // @ts-expect-error
      headers.set("abc", 123);
      // @ts-expect-error
      headers.set("abc", {});
      // @ts-expect-error
      headers.set("abc", []);
      // @ts-expect-error
      headers.set("abc", function () {});
      expect(Array.from(headers.entries())).toEqual([]);
    });
  });
});
