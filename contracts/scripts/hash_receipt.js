/**
 * Remix helper: turn a receipt object into the exact bytes32 the contract expects.
 *
 * Right-click this file in Remix and choose "Run". It prints the canonical JSON,
 * the 64-char hex digest, and the 0x-prefixed bytes32 — paste the last one into
 * storeReceipt() in the Deploy & Run tab.
 *
 * The canonicalization below is a byte-for-byte copy of frontend/src/lib/hash.js.
 * If you change one, change both, or receipts anchored from Remix will read as
 * "Data Tampered" in the app (and vice versa).
 */

// Object keys sorted lexicographically (recursively); array order preserved;
// no insignificant whitespace.
function canonicalize(value) {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return '[' + value.map(canonicalize).join(',') + ']';
  }
  const keys = Object.keys(value).sort();
  return '{' + keys.map((k) => JSON.stringify(k) + ':' + canonicalize(value[k])).join(',') + '}';
}

async function sha256Hex(text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Edit this to match the receipt you want to anchor. Field names and nesting must
// match what the app stores in Supabase — the hash covers the whole structure.
const RECEIPT = {
  receipt_number: 'RRP-2026-000001',
  employee: 'Maria Santos',
  office: 'Human Resources',
  return_date: '2026-07-20',
  received_by: 'System Administrator',
  purpose: 'End of assignment return',
  remarks: '',
  items: [
    { item: 'Ballpoint Pen (Black)', quantity: 2, condition: 'good', remarks: '' },
    { item: 'USB Flash Drive 32GB', quantity: 1, condition: 'serviceable', remarks: 'Minor scratch' },
    { item: 'HDMI Cable 2m', quantity: 1, condition: 'good', remarks: '' },
  ],
};

(async () => {
  try {
    const canonical = canonicalize(RECEIPT);
    const hex = await sha256Hex(canonical);

    console.log('Canonical JSON:', canonical);
    console.log('SHA-256 (hex): ', hex);
    console.log('bytes32 arg:   ', '0x' + hex);
    console.log('receiptNumber: ', RECEIPT.receipt_number);
    console.log('');
    console.log('storeReceipt("' + RECEIPT.receipt_number + '", "0x' + hex + '")');
  } catch (e) {
    console.error('Hashing failed:', e.message);
  }
})();
