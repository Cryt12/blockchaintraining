import CrudPage from '@/components/crud/CrudPage';
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission } from '@/lib/roles';
import { demoOffices } from '@/lib/demoData';

export default function Offices() {
  const { user } = useAuth();
  const canManage = hasPermission(user?.role, 'offices.manage');

  const columns = [
    { key: 'office_name', header: 'Office Name', render: (r) => <span className="font-medium text-slate-700 dark:text-slate-200">{r.office_name}</span> },
    { key: 'office_code', header: 'Code' },
    { key: 'description', header: 'Description', className: 'text-slate-500 dark:text-slate-400' },
  ];

  const fields = [
    { name: 'office_name', label: 'Office Name', required: true },
    { name: 'office_code', label: 'Office Code', required: true, placeholder: 'HR' },
    { name: 'description', label: 'Description', type: 'textarea', full: true },
  ];

  return (
    <CrudPage
      title="Offices"
      subtitle="Organizational offices."
      entityName="Office"
      columns={columns}
      fields={fields}
      initialData={demoOffices}
      searchKeys={['office_name', 'office_code']}
      canManage={canManage}
    />
  );
}
