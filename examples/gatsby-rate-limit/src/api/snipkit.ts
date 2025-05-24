import snipkit, { slidingWindow } from "@snipkit/node";
import type { GatsbyFunctionRequest, GatsbyFunctionResponse } from 'gatsby';

const aj = snipkit({
    key: process.env.SNIPKIT_KEY!,
    rules: [
        slidingWindow({
            mode: "LIVE",
            interval: "1m",
            max: 1,
        }),
    ],
});

export default async function handler(
    req: GatsbyFunctionRequest,
    res: GatsbyFunctionResponse
) {
    const decision = await aj.protect(req);

    console.log("Snipkit decision", decision);

    if (decision.isErrored()) {
        console.error("Encountered Snipkit Error", decision.reason);
    }

    if (decision.isDenied()) {
        if (decision.reason.isRateLimit()) {
            return res.status(429).json({ error: "Too many requests" });
        }

        return res.status(403).json({ error: "Forbidden" });
    }

    return res.json({ message: "Hello world!" });
}
