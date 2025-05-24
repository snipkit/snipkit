import { defineMiddleware } from "astro:middleware";
import aj from "snipkit:client";
import { getActionContext } from "astro:actions";

export const onRequest = defineMiddleware(async (ctx, next) => {
  const { action } = getActionContext(ctx);
  // If we are in an action context, we can skip the middleware call to
  // `protect()` since our actions will call it themselves. If we didn't call
  // `protect()` in every action, we'd want to be more specific with this
  // filtering logic.
  if (action) {
    return next();
  }

  // We are using Snipkit `protect()` in our `/randomizer.json` endpoint, so we
  // don't need to execute `protect()` as part of this middleware.
  if (ctx.routePattern === "/randomizer.json") {
    return next();
  }

  // Snipkit can be run in your middleware; however, Snipkit can only process a
  // request when the page is NOT prerendered.
  if (!ctx.isPrerendered) {
    // console.log(request);
    const decision = await aj.protect(ctx.request);

    // Deny decisions can respond immediately to avoid any additional server
    // processing.
    if (decision.isDenied()) {
      return new Response(null, { status: 403, statusText: "Forbidden" });
    }

    // The decision can be forwarded to components via `locals` where the
    // additional data, such as IP details or rule results, can inform
    // application logic.
    ctx.locals.decision = decision;
  }

  return next();
});
