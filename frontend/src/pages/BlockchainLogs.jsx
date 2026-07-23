import { ExternalLink } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import DataTable from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import { demoBlockchainLogs } from '@/lib/demoData';
import { explorerTxUrl } from '@/lib/contract';

// Shortens a long hash/address for table display.
const short = (v, head = 10, tail = 8) =>
  v ? `${v.slice(0, head)}…${v.slice(-tail)}` : '—';

export default function BlockchainLogs() {
  const columns = [
    { key: 'receipt_number', header: 'Receipt No.', render: (r) => <span className="font-medium text-primary">{r.receipt_number}</span> },
    { key: 'sha256_hash', header: 'SHA-256', render: (r) => <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{short(r.sha256_hash)}</span> },
    { key: 'transaction_hash', header: 'Tx Hash', render: (r) => <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{short(r.transaction_hash)}</span> },
    { key: 'wallet_address', header: 'Wallet', render: (r) => <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{short(r.wallet_address, 8, 6)}</span> },
    { key: 'block_number', header: 'Block', className: 'tabular-nums text-slate-500 dark:text-slate-400', render: (r) => r.block_number ?? '—' },
    { key: 'gas_used', header: 'Gas', className: 'tabular-nums text-slate-500 dark:text-slate-400', render: (r) => r.gas_used?.toLocaleString() ?? '—' },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    {
      key: '__explorer', header: '', className: 'text-right',
      render: (r) =>
        r.transaction_hash ? (
          <a href={explorerTxUrl(r.transaction_hash)} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            Explorer <ExternalLink className="h-3 w-3" />
          </a>
        ) : <span className="text-xs text-slate-400">pending</span>,
    },
  ];

  return (
    <div>
      <PageHeader title="Blockchain Logs" subtitle="On-chain transaction records for anchored receipts (Ethereum Sepolia)." />
      <DataTable columns={columns} rows={demoBlockchainLogs} searchKeys={['receipt_number', 'transaction_hash', 'wallet_address']} emptyTitle="No blockchain transactions yet" />
    </div>
  );
}
