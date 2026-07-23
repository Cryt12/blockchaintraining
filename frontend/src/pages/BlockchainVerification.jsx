import { useState } from 'react';
import { ShieldCheck, ShieldX, Loader2, RefreshCw, Link2 } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { hashReceipt } from '@/lib/hash';
import {
  isContractConfigured,
  verifyReceiptOnChain,
  explorerTxUrl,
  explorerAddressUrl,
} from '@/lib/contract';
import { demoBlockchainLogs } from '@/lib/demoData';
import { toastError } from '@/lib/toast';

// A fully-formed sample receipt so verification can actually recompute a hash.
// Editing any field below changes the recomputed hash — demonstrating tamper detection.
const SAMPLE_RECEIPT = {
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

const chainLog = demoBlockchainLogs.find((l) => l.receipt_number === SAMPLE_RECEIPT.receipt_number);

export default function BlockchainVerification() {
  const [receipt, setReceipt] = useState(SAMPLE_RECEIPT);
  const [result, setResult] = useState(null); // { verified, receiptHash, blockchainHash }
  const [checking, setChecking] = useState(false);
  const [anchoredHash, setAnchoredHash] = useState(null);

  // On first verify in demo mode, treat the freshly computed hash as the "anchored"
  // one (a correct on-chain record). Editing a field afterwards makes them diverge.
  const runVerify = async () => {
    setChecking(true);
    try {
      const receiptHash = await hashReceipt(receipt);

      if (isContractConfigured) {
        const chain = await verifyReceiptOnChain(receipt.receipt_number, receiptHash);
        if (!chain.onChain) {
          setResult({ verified: false, notFound: true, receiptHash, blockchainHash: null });
        } else {
          setResult({ verified: chain.matches, receiptHash, blockchainHash: chain.record.sha256Hash, record: chain.record });
        }
      } else {
        // Demo mode: first run establishes the anchored hash; later runs compare to it.
        const baseline = anchoredHash ?? receiptHash;
        if (anchoredHash === null) setAnchoredHash(receiptHash);
        setResult({ verified: baseline === receiptHash, receiptHash, blockchainHash: baseline, demo: true });
      }
    } catch (err) {
      toastError(err.message || 'Verification failed');
    } finally {
      setChecking(false);
    }
  };

  const updateField = (key, value) => {
    setReceipt((r) => ({ ...r, [key]: value }));
    setResult(null); // stale once edited
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blockchain Verification"
        subtitle="Recompute a receipt's SHA-256 hash and compare it against the immutable on-chain record."
      />

      {!isContractConfigured && (
        <p className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
          <span className="font-semibold">Interactive demo:</span> click <em>Verify Integrity</em> to
          anchor the sample hash, then edit any field and verify again to see{' '}
          <span className="font-semibold text-danger">Data Tampered</span> detection.
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Editable receipt */}
        <div className="card p-5">
          <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Receipt Data (Supabase)</h3>
          <div className="space-y-3">
            {['employee', 'office', 'return_date', 'received_by', 'purpose'].map((key) => (
              <div key={key}>
                <label className="label capitalize">{key.replace('_', ' ')}</label>
                <input className="input" value={receipt[key]} onChange={(e) => updateField(key, e.target.value)} />
              </div>
            ))}
            <div>
              <p className="label">Items</p>
              <ul className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
                {receipt.items.map((it, i) => (
                  <li key={i} className="flex justify-between border-b border-slate-100 py-1 last:border-0 dark:border-slate-700/50">
                    <span>{it.item}</span>
                    <span className="tabular-nums text-slate-400">×{it.quantity} · {it.condition}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <button onClick={runVerify} disabled={checking} className="btn-primary mt-5 w-full">
            {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Verify Integrity
          </button>
        </div>

        {/* Verdict */}
        <div className="card p-5">
          <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Verification Result</h3>

          {!result ? (
            <div className="flex h-48 items-center justify-center text-sm text-slate-400">
              Run a verification to see the result.
            </div>
          ) : (
            <div className="space-y-4">
              {result.notFound ? (
                <div className="flex items-center gap-3 rounded-lg bg-warning/10 p-4">
                  <ShieldX className="h-8 w-8 text-warning" />
                  <div>
                    <p className="font-semibold text-amber-700 dark:text-amber-300">Not found on-chain</p>
                    <p className="text-xs text-slate-500">This receipt has not been anchored yet.</p>
                  </div>
                </div>
              ) : result.verified ? (
                <div className="flex items-center gap-3 rounded-lg bg-success/10 p-4">
                  <ShieldCheck className="h-8 w-8 text-success" />
                  <div>
                    <p className="text-lg font-bold text-success">✅ Verified</p>
                    <p className="text-xs text-slate-500">Recomputed hash matches the blockchain record.</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-lg bg-danger/10 p-4">
                  <ShieldX className="h-8 w-8 text-danger" />
                  <div>
                    <p className="text-lg font-bold text-danger">❌ Data Tampered</p>
                    <p className="text-xs text-slate-500">Recomputed hash does NOT match the blockchain record.</p>
                  </div>
                </div>
              )}

              <HashRow label="Receipt Hash (recomputed)" value={result.receiptHash} />
              <HashRow label="Blockchain Hash (stored)" value={result.blockchainHash} />

              {chainLog && (
                <div className="grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 sm:grid-cols-2">
                  <Meta label="Transaction Hash" value={chainLog.transaction_hash}
                    href={chainLog.transaction_hash ? explorerTxUrl(chainLog.transaction_hash) : null} />
                  <Meta label="Wallet Address" value={chainLog.wallet_address}
                    href={chainLog.wallet_address ? explorerAddressUrl(chainLog.wallet_address) : null} />
                  <Meta label="Block Number" value={chainLog.block_number} />
                  <Meta label="Timestamp" value={new Date(chainLog.created_at).toLocaleString()} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HashRow({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="break-all font-mono text-xs text-slate-600 dark:text-slate-300">{value || '—'}</p>
    </div>
  );
}

function Meta({ label, value, href }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      {href ? (
        <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 break-all text-xs font-medium text-primary hover:underline">
          <Link2 className="h-3 w-3 shrink-0" />
          <span className="break-all">{value}</span>
        </a>
      ) : (
        <p className="break-all text-xs font-medium text-slate-700 dark:text-slate-200">{value ?? '—'}</p>
      )}
    </div>
  );
}
