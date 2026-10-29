# cache-tax: how it works

Lesson 0012, Cache guard (tier 2): [0012-cache-guard.html](../../teach/lessons/0012-cache-guard.html)

Cache Tax has two jobs. During a break, /keepwarm sends a short fork of the session every 50 minutes, so the one-hour cache is read rather than written again. When you come back to a cold cache with a large context, it drops your first ordinary message once and shows the estimated rewrite cost. Sending it again pays that cost.

This matters for your mission because this mod spends money on your behalf, so its README states the costs and limits as clearly as the code does. You need both to explain it honestly.

## How it was built

1. 1. Set the numbers
2. 2. Decide that the cache is cold
3. 3. Ping the cache with a fork
4. 4. Check that the ping really kept the cache warm
5. 5. Refuse one cold send, then let the resend through

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
