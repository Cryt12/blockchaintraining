/**
 * Remix interaction script: store a receipt hash, then read + verify it.
 *
 * Before running:
 *   - Deploy the contract (see deploy_with_ethers.js) and paste its address into
 *     CONTRACT_ADDRESS below.
 *   - Keep MetaMask on Sepolia with the authorized (deployer) account selected.
 *   - Right-click this file in Remix and choose "Run".
 *
 * The hash below is a demo SHA-256 digest. In the real app the frontend computes
 * it from the receipt's canonical JSON and passes it as a 0x-prefixed bytes32.
 */
(async () => {
  try {
    const CONTRACT_ADDRESS = 'PASTE_DEPLOYED_ADDRESS_HERE';
    const contractName = 'ReturnedExpendableProperty';

    const receiptNumber = 'RRP-2026-000001';
    // 32-byte value (0x + 64 hex chars). Example only.
    const sha256Hash =
      '0x9f2c1a7b3e4d5c6f8a0b1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a';

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
