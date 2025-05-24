import snipkit, { fixedWindow, sensitiveInfo, shield } from "@snipkit/remix";

export const aj = snipkit({
    key: process.env.SNIPKIT_KEY!,
    rules: [
        shield({ mode: "LIVE" }),
        fixedWindow({
            mode: "LIVE",
            window: "10s",
            max: 5
        }),
        sensitiveInfo({
            mode: "LIVE",
            allow: []
        }),
    ]
})
