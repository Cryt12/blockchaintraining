import CrudPage from '@/components/crud/CrudPage';
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission } from '@/lib/roles';
import { demoCategories } from '@/lib/demoData';

export default function Categories() {
  const { user } = useAuth();
  const canManage = hasPermission(user?.role, 'categories.manage');

  const columns = [
    { key: 'category_name', header: 'Category', render: (r) => <span className="font-medium text-slate-700 dark:text-slate-200">{r.category_name}</span> },
    { key: 'description', header: 'Description', className: 'text-slate-500 dark:text-slate-400' },
  ];

  const fields = [
    { name: 'category_name', label: 'Category Name', required: true },
    { name: 'description', label: 'Description', type: 'textarea', full: true },
  ];

  return (
    <CrudPage
      title="Categories"
      subtitle="Expendable item categories."
      entityName="Category"
      columns={columns}
      fields={fields}
      initialData={demoCategories}
      searchKeys={['category_name']}
      canManage={canManage}
    />
  );
}
