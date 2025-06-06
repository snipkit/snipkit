import express from "express";
import snipkit from "./lib/snipkit.js";

const app = express();
app.get("/", async (req, res) => {
  // Get an instance of Snipkit from our custom module
  const aj = await snipkit();

  // Get a decision from Snipkit for the incoming request
  const decision = await aj.protect(req);

  // If the decision is denied, return an appropriate status code
  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return res.status(429).send("Too many requests");
    } else {
      return res.status(403).send("Forbidden");
    }
  }

  // If the decision is allowed, return a successful response
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log("Server started at http://localhost:3000");
});
