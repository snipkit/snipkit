import "jsr:@std/dotenv/load";

import snipkit, { sensitiveInfo, shield } from "npm:@snipkit/deno"

const aj = snipkit({
  key: Deno.env.get("SNIPKIT_KEY")!,
  rules: [
    shield({ mode: "LIVE" }),
    sensitiveInfo({ mode: "LIVE", allow: [] })
  ]
})

Deno.serve({ port: 3000 }, aj.handler(async (request: Request) => {
  const decision = await aj.protect(request)

  if (decision.isDenied()) {
    return new Response("Forbidden", { status: 403 });
  }

  return new Response("Hello, world!");
}));
