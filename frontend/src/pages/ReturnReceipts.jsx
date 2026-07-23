import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Eye, ShieldCheck, Loader2, Hash } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import StatusBadge from '@/components/ui/StatusBadge';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission } from '@/lib/roles';
import { demoReceipts, demoEmployees, demoOffices, demoItems } from '@/lib/demoData';
import { hashReceipt } from '@/lib/hash';
import { isContractConfigured, hasMetaMask, storeReceiptOnChain } from '@/lib/contract';
import { toastSuccess, toastError, toastInfo } from '@/lib/toast';

const CONDITIONS = [
  { value: 'good', label: 'Good' },
  { value: 'serviceable', label: 'Serviceable' },
  { value: 'damaged', label: 'Damaged' },
  { value: 'defective', label: 'Defective' },
  { value: 'missing_parts', label: 'Missing Parts' },
];

// Builds the deterministic object that gets hashed. Only stable, meaningful fields
// are included — never volatile metadata — so the hash is reproducible at verify time.
function buildCanonicalReceipt(receiptNumber, values) {
  return {
    receipt_number: receiptNumber,
    employee: values.employee,
    office: values.office,
    return_date: values.return_date,
    received_by: values.received_by || '',
    purpose: values.purpose || '',
    remarks: values.remarks || '',
    items: values.items.map((it) => ({
      item: it.item,
      quantity: Number(it.quantity),
      condition: it.condition,
      remarks: it.remarks || '',
    })),
  };
}

export default function ReturnReceipts() {
  const { user } = useAuth();
  const canCreate = hasPermission(user?.role, 'receipts.create');

  const [rows, setRows] = useState(demoReceipts);
  const [createOpen, setCreateOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      employee: '', office: '', return_date: '2026-07-23', received_by: user?.name || '',
      purpose: '', remarks: '',
      items: [{ item: '', quantity: 1, condition: 'good', remarks: '' }],
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const nextReceiptNumber = () =>
    `RRP-2026-${String(rows.length + 1).padStart(6, '0')}`;

  const openCreate = () => {
    reset({
      employee: '', office: '', return_date: '2026-07-23', received_by: user?.name || '',
      purpose: '', remarks: '',
      items: [{ item: '', quantity: 1, condition: 'good', remarks: '' }],
    });
    setCreateOpen(true);
  };

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      const receiptNumber = nextReceiptNumber();

      // Steps 3–4: canonical JSON + SHA-256 hash.
      const canonical = buildCanonicalReceipt(receiptNumber, values);
      const hash = await hashReceipt(canonical);

      let status = 'submitted';
      let blockchain = null;

      // Steps 5–9: connect MetaMask + store on-chain (only when fully configured).
      if (isContractConfigured && hasMetaMask) {
        try {
          toastInfo('Confirm the transaction in MetaMask…');
          blockchain = await storeReceiptOnChain(receiptNumber, hash);
          status = 'blockchain_verified';
          toastSuccess('Receipt anchored on-chain');
        } catch (chainErr) {
          status = 'blockchain_failed';
          toastError(chainErr.message || 'Blockchain transaction failed');
        }
      } else {
        // Demo/offline path: the receipt is saved + hashed, but not yet anchored.
        toastInfo('Receipt saved & hashed. Configure the contract + MetaMask to anchor on-chain.');
      }

      const newRow = {
        id: `local-${Date.now()}`,
        receipt_number: receiptNumber,
        employee: values.employee,
        office: values.office,
        return_date: values.return_date,
        items: values.items.length,
        status,
        receipt_hash: hash,
        blockchain,
      };
      setRows((prev) => [newRow, ...prev]);
      setCreateOpen(false);
    } catch (err) {
      toastError(err.message || 'Failed to submit receipt');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: 'receipt_number', header: 'Receipt No.', render: (r) => <span className="font-medium text-primary">{r.receipt_number}</span> },
    { key: 'employee', header: 'Employee' },
    { key: 'office', header: 'Office', className: 'text-slate-500 dark:text-slate-400' },
    { key: 'return_date', header: 'Date', className: 'tabular-nums text-slate-500 dark:text-slate-400' },
    { key: 'items', header: 'Items', className: 'tabular-nums text-slate-500 dark:text-slate-400' },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    {
      key: '__actions', header: '', className: 'text-right',
      render: (r) => (
        <button onClick={() => setDetail(r)} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-800" aria-label="View">
          <Eye className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Return Receipts"
        subtitle="Record returned expendable property. Each finalized receipt is hashed and anchored on-chain."
        actions={canCreate && <button onClick={openCreate} className="btn-primary"><Plus className="h-4 w-4" />New Receipt</button>}
      />

      <DataTable
        columns={columns}
        rows={rows}
        searchKeys={['receipt_number', 'employee', 'office']}
        emptyTitle="No receipts yet"
      />

      {/* Create receipt modal */}
      <Modal
        open={createOpen}
        onClose={() => !submitting && setCreateOpen(false)}
        title="New Return Receipt"
        size="xl"
        footer={
          <>
            <button onClick={() => setCreateOpen(false)} className="btn-secondary" disabled={submitting}>Cancel</button>
            <button onClick={handleSubmit(onSubmit)} className="btn-primary" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              Submit Receipt
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Employee</label>
              <select className="input" {...register('employee', { required: true })}>
                <option value="">Select employee…</option>
                {demoEmployees.map((e) => <option key={e.id} value={e.full_name}>{e.full_name}</option>)}
              </select>
              {errors.employee && <p className="mt-1 text-xs text-danger">Employee is required</p>}
            </div>
            <div>
              <label className="label">Office</label>
              <select className="input" {...register('office', { required: true })}>
                <option value="">Select office…</option>
                {demoOffices.map((o) => <option key={o.id} value={o.office_name}>{o.office_name}</option>)}
              </select>
              {errors.office && <p className="mt-1 text-xs text-danger">Office is required</p>}
            </div>
            <div>
              <label className="label">Return Date</label>
              <input type="date" className="input" {...register('return_date', { required: true })} />
            </div>
            <div>
              <label className="label">Received By</label>
              <input className="input" {...register('received_by')} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Purpose</label>
              <input className="input" placeholder="Reason for return" {...register('purpose')} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Remarks</label>
              <textarea rows={2} className="input" {...register('remarks')} />
            </div>
          </div>

          {/* Returned items */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Returned Items</h4>
              <button type="button" onClick={() => append({ item: '', quantity: 1, condition: 'good', remarks: '' })} className="btn-secondary !py-1 !text-xs">
                <Plus className="h-3.5 w-3.5" />Add item
              </button>
            </div>
            <div className="space-y-2">
              {fields.map((field, idx) => (
                <div key={field.id} className="grid grid-cols-12 gap-2 rounded-lg border border-slate-200 p-2 dark:border-slate-700">
                  <div className="col-span-12 sm:col-span-4">
                    <select className="input" {...register(`items.${idx}.item`, { required: true })}>
                      <option value="">Item…</option>
                      {demoItems.map((it) => <option key={it.id} value={it.description}>{it.description}</option>)}
                    </select>
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <input type="number" min="1" step="1" className="input" placeholder="Qty" {...register(`items.${idx}.quantity`, { required: true, valueAsNumber: true })} />
                  </div>
                  <div className="col-span-8 sm:col-span-3">
                    <select className="input" {...register(`items.${idx}.condition`, { required: true })}>
                      {CONDITIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                  <div className="col-span-10 sm:col-span-2">
                    <input className="input" placeholder="Remarks" {...register(`items.${idx}.remarks`)} />
                  </div>
                  <div className="col-span-2 sm:col-span-1 flex items-center justify-center">
                    <button type="button" onClick={() => fields.length > 1 && remove(idx)} className="rounded-md p-1.5 text-slate-400 hover:text-danger disabled:opacity-30" disabled={fields.length === 1} aria-label="Remove item">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-lg bg-primary/5 px-3 py-2 text-xs text-slate-500 dark:text-slate-400">
            <Hash className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            On submit, a canonical JSON of this receipt is hashed with SHA-256.{' '}
            {isContractConfigured && hasMetaMask
              ? 'You will be asked to confirm a MetaMask transaction to anchor it on Sepolia.'
              : 'Configure the contract address + MetaMask to anchor it on-chain (Sepolia).'}
          </div>
        </form>
      </Modal>

      {/* Detail modal */}
      <ReceiptDetailModal detail={detail} onClose={() => setDetail(null)} />
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{value || '—'}</p>
    </div>
  );
}

function ReceiptDetailModal({ detail, onClose }) {
  if (!detail) return null;
  return (
    <Modal open={Boolean(detail)} onClose={onClose} title={detail.receipt_number} size="lg">
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Field label="Employee" value={detail.employee} />
          <Field label="Office" value={detail.office} />
          <Field label="Return Date" value={detail.return_date} />
          <Field label="Items" value={detail.items} />
          <div>
            <p className="text-xs text-slate-400">Status</p>
            <StatusBadge status={detail.status} />
          </div>
        </div>

        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Integrity</p>
          <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
            <p className="text-xs text-slate-400">SHA-256 Receipt Hash</p>
            <p className="break-all font-mono text-xs text-slate-600 dark:text-slate-300">
              {detail.receipt_hash || '— (open a receipt created in this session to see its hash)'}
            </p>
            {detail.blockchain ? (
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Field label="Transaction Hash" value={detail.blockchain.transaction_hash} />
                <Field label="Block Number" value={detail.blockchain.block_number} />
                <Field label="Wallet" value={detail.blockchain.wallet_address} />
                <Field label="Gas Used" value={detail.blockchain.gas_used} />
              </div>
            ) : (
              <p className="mt-2"><Badge variant="warning">Not yet anchored on-chain</Badge></p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
