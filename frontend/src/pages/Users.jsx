import CrudPage from '@/components/crud/CrudPage';
import Badge from '@/components/ui/Badge';
import StatusBadge from '@/components/ui/StatusBadge';
import { ROLES, ROLE_LABELS } from '@/lib/roles';

const ROLE_VARIANT = {
  [ROLES.ADMINISTRATOR]: 'primary',
  [ROLES.PROPERTY_CUSTODIAN]: 'success',
  [ROLES.VERIFIER]: 'warning',
  [ROLES.VIEWER]: 'neutral',
};

const demoUsers = [
  { id: 'u1', name: 'System Administrator', email: 'admin@rreps.gov', role: ROLES.ADMINISTRATOR, status: 'active' },
  { id: 'u2', name: 'Property Custodian', email: 'custodian@rreps.gov', role: ROLES.PROPERTY_CUSTODIAN, status: 'active' },
  { id: 'u3', name: 'Records Verifier', email: 'verifier@rreps.gov', role: ROLES.VERIFIER, status: 'active' },
  { id: 'u4', name: 'Read-only Viewer', email: 'viewer@rreps.gov', role: ROLES.VIEWER, status: 'inactive' },
];

export default function Users() {
  const columns = [
    { key: 'name', header: 'Name', render: (r) => <span className="font-medium text-slate-700 dark:text-slate-200">{r.name}</span> },
    { key: 'email', header: 'Email', className: 'text-slate-500 dark:text-slate-400' },
    { key: 'role', header: 'Role', render: (r) => <Badge variant={ROLE_VARIANT[r.role]}>{ROLE_LABELS[r.role]}</Badge> },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  const fields = [
    { name: 'name', label: 'Full Name', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'role', label: 'Role', type: 'select', required: true, options: Object.values(ROLES).map((v) => ({ value: v, label: ROLE_LABELS[v] })) },
    { name: 'status', label: 'Status', type: 'select', default: 'active', options: [{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }] },
    { name: 'wallet_address', label: 'Wallet Address (optional)', full: true, placeholder: '0x… (for Property Custodians who anchor on-chain)' },
  ];

  return (
    <CrudPage
      title="Users"
      subtitle="System accounts and their roles."
      entityName="User"
      columns={columns}
      fields={fields}
      initialData={demoUsers}
      searchKeys={['name', 'email']}
      canManage
    />
  );
}
