# ReturnedExpendableProperty Smart Contract

Stores only a receipt number and the SHA-256 hash of its off-chain Supabase record.
Never stores personal data, quantities, or item details on-chain.

## Contract surface

| Function | Access | Purpose |
|---|---|---|
| `storeReceipt(string receiptNumber, bytes32 sha256Hash)` | authorized submitters only | Records a receipt's hash. Reverts if that receipt number was already stored (immutable once written). |
| `verifyReceipt(string receiptNumber, bytes32 sha256Hash)` | anyone (view) | Returns `true` if the given hash matches what's on-chain for that receipt. |
| `getReceipt(string receiptNumber)` | anyone (view) | Returns the full stored record: hash, timestamp, submitting wallet, existence flag. |
| `addAuthorizedSubmitter(address)` / `removeAuthorizedSubmitter(address)` | owner only | Manages which wallets (e.g. Property Custodian accounts) may call `storeReceipt`. |

Emits `ReceiptStored(receiptNumber, sha256Hash, sender, timestamp)` on every successful store —
this is what the Blockchain Logs page / explorer link surfaces.

## Remix helper files

| File | Remix plugin | What it does |
|---|---|---|
| `scripts/deploy_with_ethers.js` | Script runner (right-click → Run) | Deploys the contract and prints its address. |
| `scripts/interact_with_ethers.js` | Script runner | Stores a receipt hash, reads it back, and verifies match vs. mismatch. |
| `scripts/hash_receipt.js` | Script runner | Prints the canonical JSON, SHA-256 hex, and `bytes32` arg for a receipt — paste the result into `storeReceipt` by hand. |
| `tests/ReturnedExpendableProperty_test.sol` | Solidity Unit Testing | Unit tests: store/verify, wrong-hash rejection, `getReceipt`, duplicate-store revert, empty-input revert. |

The scripts use the ethers v5 API that Remix's script environment injects (`ethers.providers.Web3Provider`, `contract.deployed()`). The frontend app uses ethers v6 — that difference is expected; each targets its own runtime.

## Deploying via Remix to Sepolia

1. Open [Remix IDE](https://remix.ethereum.org) and create a new file, paste in
   `ReturnedExpendableProperty.sol`.
2. **Compile**: Solidity Compiler tab → select a `0.8.20`+ compiler → Compile.
3. **Connect MetaMask**: switch MetaMask to the **Sepolia** test network and fund
   the deploying wallet with test ETH from a Sepolia faucet.
4. **Deploy**: Deploy & Run Transactions tab → Environment: "Injected Provider -
   MetaMask" → confirm Sepolia is selected → Deploy → approve the transaction in
   MetaMask.
5. Copy the deployed **contract address** and, from the Solidity Compiler tab,
   the **ABI** (Compilation Details → ABI). Both are needed by the frontend/backend.
6. If Property Custodians will submit receipts from wallets other than the
   deployer, call `addAuthorizedSubmitter(custodianWalletAddress)` once per wallet.

## Values the application needs after deployment

Put these in the frontend's `.env` (see root `.env.example`):

```
VITE_CONTRACT_ADDRESS=0x...
VITE_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/<project-id>   # or Alchemy equivalent
VITE_SEPOLIA_CHAIN_ID=11155111
```

The ABI JSON should be saved as `src/contracts/ReturnedExpendableProperty.json` in the
frontend project once it's scaffolded, and loaded by ethers.js to instantiate the contract.

## Converting the SHA-256 hash for on-chain storage

`sha256Hash` is `bytes32` — a 32-byte value, which is exactly the size of a SHA-256
digest, so no truncation happens. In JavaScript with ethers.js:

```js
import { sha256 } from "js-sha256"; // or Web Crypto's subtle.digest
import { ethers } from "ethers";

const canonicalJson = JSON.stringify(sortedReceiptObject); // canonical, sorted-key JSON
const hashHex = sha256(canonicalJson);        // 64 hex chars
const hashBytes32 = "0x" + hashHex;           // ethers accepts this directly as bytes32

await contract.storeReceipt(receiptNumber, hashBytes32);
```

The same `hashHex` (without the `0x` prefix, or with it — pick one convention and
keep it consistent) is what gets saved to Supabase's `return_receipts.receipt_hash`
and `blockchain_logs.sha256_hash` columns, so verification later can recompute and
compare without ambiguity.

## Notes on the access-control model

- `storeReceipt` reverts on a duplicate receipt number rather than overwriting —
  once on-chain, a receipt's hash is permanent. If a receipt is legitimately
  corrected, that should produce a *new* receipt (and receipt number) in Supabase,
  not a rewrite of an existing on-chain hash.
- Authorization is per-wallet (`authorizedSubmitters`), not per-role — map this to
  application roles when wiring up the backend (e.g. only Property Custodian users
  have a `wallet_address` and are added as authorized submitters).
