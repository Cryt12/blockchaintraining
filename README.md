# RREPS — Receipt of Returned Expendable Property System

A blockchain-verified system for recording returned expendable property in government
agencies, schools, and organizations. Operational data lives in **Supabase PostgreSQL**;
each finalized receipt is hashed with **SHA-256** and only that hash (plus the receipt
number) is written to the **Ethereum Sepolia testnet**, making every receipt tamper-evident
without ever putting personal data on-chain.

## Repository layout

```
.
├── database/          # Supabase PostgreSQL schema — SQL migrations (built ✅)
│   ├── migrations/    # Run 001 → 012 in order
│   └── README.md
├── contracts/         # Solidity smart contract (built ✅)
│   ├── ReturnedExpendableProperty.sol
│   └── README.md      # Remix + Sepolia deployment steps
├── backend/           # Laravel 12 REST API (planned)
├── frontend/          # React + Vite + Tailwind SPA (planned)
├── .env.example       # Environment template (copy to .env)
└── .gitignore
```

## Build phases

This is a large system, so it's being built in dependency order. Completed phases are
marked; the rest are planned.

1. ✅ **Database schema** — normalized Supabase Postgres tables, FKs, indexes, soft
   deletes, receipt-number generator. See [`database/`](database/).
2. ✅ **Smart contract** — `ReturnedExpendableProperty.sol` storing only receipt number
   + SHA-256 hash. See [`contracts/`](contracts/).
3. ⬜ **Laravel backend** — REST API, JWT auth, RBAC (Administrator / Property Custodian /
   Verifier / Viewer), CRUD for all modules, receipt submission + canonical-JSON hashing,
   activity logging.
4. ⬜ **React frontend** — dashboard, sidebar navigation, all modules, MetaMask + ethers.js
   integration, receipt workflow, verification page, reports (PDF/Excel/CSV), QR codes,
   dark mode.
5. ⬜ **Integration & polish** — end-to-end receipt → hash → chain → verify flow,
   printable government-formatted receipts, audit trail.

## Getting started (current state)

1. Copy the env template and fill in real values:
   ```bash
   cp .env.example .env
   ```
2. Run the database migrations against your Supabase project — see
   [`database/README.md`](database/README.md).
3. Deploy the smart contract to Sepolia via Remix — see
   [`contracts/README.md`](contracts/README.md) — and record the contract address + ABI.

## The core integrity guarantee

The blockchain **never** stores personal information or full receipt data — only the
receipt number and its SHA-256 hash. During verification the app regenerates the hash
from the current Supabase record (using the same canonical, sorted-key JSON that was
hashed at submission time) and compares it to the on-chain hash. A match ⇒ **Verified**;
any difference ⇒ **Data Tampered**.

## Security

- Real secrets live only in `.env` (gitignored). The frontend receives only the Supabase
  publishable key; the secret key and JWT secret are backend-only.
- Planned backend enforces JWT auth, RBAC, request validation, rate limiting, and
  parameterized queries (SQL-injection safe) via Eloquent.
