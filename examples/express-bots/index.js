import snipkit, { detectBot, shield } from "@snipkit/node";
import express from "express";

const app = express();
const port = 3000;

const aj = snipkit({
  // Get your site key from https://app-snipkit.khulnasoft.com and set it as an environment
  // variable rather than hard coding.
  key: process.env.SNIPKIT_KEY,
  rules: [
    // Protect against common attacks with Snipkit Shield
    shield({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
    }),
    // Detect bots with the ability to allow or deny subsets
    detectBot({
      mode: "LIVE",
      deny: ["CURL"] // explicitly deny the curl command
      // allow: [] // explicitly allow bots in the list while denying all others
    }),
  ],
});

app.get('/', async (req, res) => {
  const decision = await aj.protect(req);
  // We need to check that the bot is who they say they are.
  if (decision.reason.isSpoofed()) {
    return NextResponse.json(
      { error: "You are pretending to be a good bot!" },
      { status: 403, headers },
    );
  }

  if (decision.isBot()) {
    // We want to check for disallowed bots, or spoofed bots
    if (decision.isDenied() || decision.reason.isSpoofed()) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        error: "You are a bot",
        detected: decision.reason.denied[0]
      }));
    }
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: `Hello world!` }));
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})
