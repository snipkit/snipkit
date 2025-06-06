import snipkit, { fixedWindow, shield } from "@snipkit/node";
import express from "express";

const app = express();
const port = 3000;

const aj = snipkit({
  // Get your site key from https://app-snipkit.khulnasoft.com and set it as an environment
  // variable rather than hard coding.
  key: process.env.SNIPKIT_KEY,
  // Limiting by ip.src is the default if not specified
  //characteristics: ["ip.src"],
  rules: [
    // Protect against common attacks with Snipkit Shield
    shield({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
    }),
    // Fixed window rate limit. Snipkit also supports sliding window and token
    // bucket.
    fixedWindow({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only      
      window: "1m", // 1 min fixed window
      max: 1, // allow a single request (for demo purposes)
    }),
  ],
});

app.get('/', async (req, res) => {
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    res.writeHead(429, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Too Many Requests" }));
  } else {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Hello World" }));
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})