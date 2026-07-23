import { BrowserProvider, JsonRpcProvider, Contract } from 'ethers';
import artifact from '@/contracts/ReturnedExpendableProperty.json';

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '';
export const SEPOLIA_RPC_URL = import.meta.env.VITE_SEPOLIA_RPC_URL || '';
export const SEPOLIA_CHAIN_ID = Number(import.meta.env.VITE_SEPOLIA_CHAIN_ID || 11155111);
export const EXPLORER_BASE = 'https://sepolia.etherscan.io';

export const isContractConfigured = Boolean(CONTRACT_ADDRESS);
export const hasMetaMask = typeof window !== 'undefined' && Boolean(window.ethereum);

export function explorerTxUrl(txHash) {
  return `${EXPLORER_BASE}/tx/${txHash}`;
}
export function explorerAddressUrl(address) {
  return `${EXPLORER_BASE}/address/${address}`;
}

// 64-char hex (with or without 0x) -> 0x-prefixed bytes32 the contract expects.
export function toBytes32(hashHex) {
  const clean = hashHex.startsWith('0x') ? hashHex.slice(2) : hashHex;
  if (clean.length !== 64) throw new Error('Expected a 32-byte (64 hex char) SHA-256 hash');
  return '0x' + clean;
}

// Read-only contract via the configured RPC — used by verification/logs, needs no wallet.
export function getReadContract() {
  if (!isContractConfigured || !SEPOLIA_RPC_URL) return null;
  const provider = new JsonRpcProvider(SEPOLIA_RPC_URL);
  return new Contract(CONTRACT_ADDRESS, artifact.abi, provider);
}

// Connects MetaMask, ensures Sepolia is selected, and returns a signer-bound contract.
export async function connectWalletContract() {
  if (!hasMetaMask) throw new Error('MetaMask is not installed.');
  if (!isContractConfigured) throw new Error('Contract address is not configured (VITE_CONTRACT_ADDRESS).');

  const provider = new BrowserProvider(window.ethereum);
  await provider.send('eth_requestAccounts', []);

  const network = await provider.getNetwork();
  if (Number(network.chainId) !== SEPOLIA_CHAIN_ID) {
    // Ask MetaMask to switch to Sepolia (0xaa36a7).
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x' + SEPOLIA_CHAIN_ID.toString(16) }],
      });
    } catch {
      throw new Error('Please switch MetaMask to the Sepolia test network.');
    }
  }

  const signer = await provider.getSigner();
  const contract = new Contract(CONTRACT_ADDRESS, artifact.abi, signer);
  return { contract, signer, address: await signer.getAddress() };
}

/**
 * Stores a receipt hash on-chain and waits for confirmation.
 * Returns the blockchain metadata to persist back to Supabase.
 */
export async function storeReceiptOnChain(receiptNumber, hashHex) {
  const { contract, address } = await connectWalletContract();
  const tx = await contract.storeReceipt(receiptNumber, toBytes32(hashHex));
  const receipt = await tx.wait(); // 1 confirmation

  return {
    transaction_hash: receipt.hash,
    block_number: Number(receipt.blockNumber),
    wallet_address: address,
    gas_used: receipt.gasUsed?.toString(),
    network: 'sepolia',
    explorer_url: explorerTxUrl(receipt.hash),
  };
}

/**
 * Verifies a receipt hash against the on-chain record (read-only).
 * Returns { onChain, matches, record } — onChain=false if not stored yet.
 */
export async function verifyReceiptOnChain(receiptNumber, hashHex) {
  const contract = getReadContract();
  if (!contract) throw new Error('Blockchain read provider is not configured.');

  const record = await contract.getReceipt(receiptNumber);
  const exists = record[4];
  if (!exists) return { onChain: false, matches: false, record: null };

  const storedHash = record[1].toLowerCase();
  const matches = storedHash === toBytes32(hashHex).toLowerCase();
  return {
    onChain: true,
    matches,
    record: {
      receiptNumber: record[0],
      sha256Hash: storedHash,
      timestamp: Number(record[2]),
      sender: record[3],
    },
  };
}
