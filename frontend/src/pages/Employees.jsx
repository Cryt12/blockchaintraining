import CrudPage from '@/components/crud/CrudPage';
import StatusBadge from '@/components/ui/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission } from '@/lib/roles';
import { demoEmployees, demoOffices } from '@/lib/demoData';

export default function Employees() {
  const { user } = useAuth();
  const canManage = hasPermission(user?.role, 'employees.manage');

  const columns = [
    { key: 'employee_number', header: 'Emp. No.', render: (r) => <span className="font-medium text-slate-700 dark:text-slate-200">{r.employee_number}</span> },
    { key: 'full_name', header: 'Full Name' },
    { key: 'office', header: 'Office', className: 'text-slate-500 dark:text-slate-400' },
    { key: 'position', header: 'Position', className: 'text-slate-500 dark:text-slate-400' },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  const fields = [
    { name: 'employee_number', label: 'Employee Number', required: true, placeholder: 'EMP-0006' },
    { name: 'full_name', label: 'Full Name', required: true },
    { name: 'office', label: 'Office', type: 'select', required: true, options: demoOffices.map((o) => o.office_name) },
    { name: 'position', label: 'Position' },
    { name: 'status', label: 'Status', type: 'select', default: 'active', options: [{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }] },
  ];

  return (
    <CrudPage
      title="Employees"
      subtitle="People who return expendable property."
      entityName="Employee"
      columns={columns}
      fields={fields}
      initialData={demoEmployees}
      searchKeys={['employee_number', 'full_name', 'office', 'position']}
      canManage={canManage}
    />
  );
}
