# crosschain-incident

Read-only **cross-chain message incident normalization**. Feed it an operator-supplied JSON export of source/destination message status; get back a conservative evidence report with `PASS` / `FAIL` / `UNKNOWN` findings.

Part of the **Agent/Chain Evidence Tools** suite — CLI-first, read-only, no keys, no payments, JSON output.

## Quick start

```bash
npx crosschain-incident inspect --input ./message.json --json
```

```json
{
  "protocol": "layerzero",
  "messageId": "example-id",
  "source": { "status": "delivered", "network": "source-chain", "tx": "0x...", "observedAt": "2026-01-01T00:00:00Z" },
  "destination": { "status": "failed", "network": "destination-chain", "tx": "0x...", "observedAt": "2026-01-01T00:00:10Z" }
}
```

## What it does

- Normalizes source / destination / delivered / failed / unknown / source-only / destination-failed states
- Missing or ambiguous fields stay `UNKNOWN` — nothing is guessed
- Flags failures like `DESTINATION_FAILED` as machine-readable findings (exit `1`)
- Handles invalid JSON and UTF-8 BOM input without crashing

## NOT covered (explicitly)

- Does not query LayerZero, Hyperlane, or any protocol API yet — it normalizes **your** export
- No retries, refunds, or message submissions
- Not an online cross-chain monitor (protocol adapters are the roadmap)

## Status

Experimental (`0.1.0`). Local state-fixture tests pass (delivered, destination-failed, invalid JSON, BOM JSON). No real protocol API validation yet.

## Siblings

[mcpdoctor](https://www.npmjs.com/package/mcpdoctor) · [oauthdoctor](https://www.npmjs.com/package/oauthdoctor) · [x402-reconcile](https://www.npmjs.com/package/x402-reconcile) · [wallet-evidence](https://www.npmjs.com/package/wallet-evidence)

MIT © 2026 xka0085-byte (Eidon)
