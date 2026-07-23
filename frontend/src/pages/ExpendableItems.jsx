import CrudPage from '@/components/crud/CrudPage';
import StatusBadge from '@/components/ui/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission } from '@/lib/roles';
import { demoItems, demoCategories } from '@/lib/demoData';

export default function ExpendableItems() {
  const { user } = useAuth();
  const canManage = hasPermission(user?.role, 'items.manage');

  const columns = [
    { key: 'property_number', header: 'Property No.', render: (r) => <span className="font-medium text-slate-700 dark:text-slate-200">{r.property_number}</span> },
    { key: 'description', header: 'Description' },
    { key: 'category', header: 'Category', className: 'text-slate-500 dark:text-slate-400' },
    { key: 'unit', header: 'Unit', className: 'text-slate-500 dark:text-slate-400' },
    {
      key: 'remaining_quantity',
      header: 'Remaining',
      className: 'tabular-nums',
      render: (r) => (
        <span className={r.remaining_quantity === 0 ? 'text-danger' : ''}>
          {r.remaining_quantity} / {r.quantity}
        </span>
      ),
    },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  const fields = [
    { name: 'property_number', label: 'Property Number', required: true, placeholder: 'PN-2026-0006' },
    { name: 'item_code', label: 'Item Code', required: true },
    { name: 'description', label: 'Description', required: true, full: true },
    { name: 'category', label: 'Category', type: 'select', required: true, options: demoCategories.map((c) => c.category_name) },
    { name: 'unit', label: 'Unit', required: true, placeholder: 'pc / box / bottle' },
    { name: 'quantity', label: 'Quantity', type: 'number', step: '1', required: true },
    { name: 'remaining_quantity', label: 'Remaining Quantity', type: 'number', step: '1', required: true },
    { name: 'remarks', label: 'Remarks', type: 'textarea', full: true },
    { name: 'status', label: 'Status', type: 'select', default: 'active', options: [{ value: 'active', label: 'Active' }, { value: 'depleted', label: 'Depleted' }, { value: 'archived', label: 'Archived' }] },
  ];

  return (
    <CrudPage
      title="Expendable Items"
      subtitle="Property catalog with remaining quantities."
      entityName="Item"
      columns={columns}
      fields={fields}
      initialData={demoItems}
      searchKeys={['property_number', 'item_code', 'description', 'category']}
      canManage={canManage}
    />
  );
}
