/**
 * Remix interaction script: store a receipt hash, then read + verify it.
 *
 * Before running:
 *   - Deploy the contract (see deploy_with_ethers.js) and paste its address into
 *     CONTRACT_ADDRESS below.
 *   - Keep MetaMask on Sepolia with the authorized (deployer) account selected.
 *   - Right-click this file in Remix and choose "Run".
 *
 * The hash is computed here the same way the frontend computes it (canonical JSON
 * + SHA-256), so a receipt anchored from this script verifies in the app.
 * Keep this canonicalization in lockstep with frontend/src/lib/hash.js.
 */

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

(async () => {
  try {
    const CONTRACT_ADDRESS = 'PASTE_DEPLOYED_ADDRESS_HERE';
    const contractName = 'ReturnedExpendableProperty';

    const receipt = {
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
      ],
    };

    const receiptNumber = receipt.receipt_number;
    const sha256Hash = '0x' + (await sha256Hex(canonicalize(receipt)));
    console.log('Computed hash:', sha256Hash);

    const artifactsPath = `browser/contracts/artifacts/${contractName}.json`;
    const metadata = JSON.parse(
      await remix.call('fileManager', 'getFile', artifactsPath),
    );

    const signer = new ethers.providers.Web3Provider(web3Provider).getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, metadata.abi, signer);

    // --- store ---
    console.log('Storing', receiptNumber, '…');
    const tx = await contract.storeReceipt(receiptNumber, sha256Hash);
    const rcpt = await tx.wait();
    console.log('✅ Stored in block', rcpt.blockNumber, '| gas used', rcpt.gasUsed.toString());
    console.log('   Tx hash:', rcpt.transactionHash);

    // --- read back ---
    const record = await contract.getReceipt(receiptNumber);
    console.log('getReceipt =>', {
      receiptNumber: record[0],
      sha256Hash: record[1],
      timestamp: record[2].toString(),
      sender: record[3],
      exists: record[4],
    });

    // --- verify ---
    const matches = await contract.verifyReceipt(receiptNumber, sha256Hash);
    console.log('verifyReceipt (same hash) =>', matches, '(expected true)');

    const tampered = await contract.verifyReceipt(
      receiptNumber,
      '0x' + '0'.repeat(63) + '1',
    );
    console.log('verifyReceipt (wrong hash) =>', tampered, '(expected false)');
  } catch (e) {
    console.error('Interaction failed:', e.message);
  }
})();
