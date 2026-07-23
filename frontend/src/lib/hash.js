// Canonical JSON + SHA-256 hashing.
//
// The SAME canonicalization must run at submit time and at verify time (and match
// the backend), or a genuine receipt will look "tampered". The rules are:
//   - object keys sorted lexicographically, recursively
//   - arrays keep their order (order is meaningful for receipt items)
//   - no insignificant whitespace
// Keep this in lockstep with the backend's canonicalization.

export function canonicalize(value) {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return '[' + value.map(canonicalize).join(',') + ']';
  }
  const keys = Object.keys(value).sort();
  return '{' + keys.map((k) => JSON.stringify(k) + ':' + canonicalize(value[k])).join(',') + '}';
}

// Returns a lowercase 64-char hex SHA-256 digest of the given string.
export async function sha256Hex(text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Convenience: canonicalize a receipt object then hash it. Returns hex (no 0x).
export async function hashReceipt(receipt) {
  return sha256Hex(canonicalize(receipt));
}
