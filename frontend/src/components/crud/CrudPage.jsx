import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import { toastSuccess, confirmAction } from '@/lib/toast';

/**
 * Config-driven CRUD list page. Operates on in-memory demo state until the
 * backend is wired; each handler is where a Supabase/API call will slot in later.
 *
 * Props:
 *  - title, subtitle, entityName
 *  - columns:   DataTable columns (excluding the actions column, added here)
 *  - fields:    [{ name, label, type, options?, required?, placeholder?, step? }]
 *  - initialData, searchKeys
 *  - canManage: boolean — hides Add/Edit/Delete when false (read-only roles)
 *  - makeId:    (row) => id generator for new rows
 */
export default function CrudPage({
  title,
  subtitle,
  entityName = 'record',
  columns,
  fields,
  initialData = [],
  searchKeys = [],
  canManage = true,
  loading = false,
}) {
  const [rows, setRows] = useState(initialData);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const openCreate = () => {
    setEditing(null);
    reset(Object.fromEntries(fields.map((f) => [f.name, f.default ?? ''])));
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    reset(row);
    setModalOpen(true);
  };

  const onSubmit = (values) => {
    if (editing) {
      setRows((prev) => prev.map((r) => (r.id === editing.id ? { ...r, ...values } : r)));
      toastSuccess(`${entityName} updated`);
    } else {
      const id = `local-${Date.now()}`;
      setRows((prev) => [{ id, ...values }, ...prev]);
      toastSuccess(`${entityName} created`);
    }
    setModalOpen(false);
  };

  const onDelete = async (row) => {
    const ok = await confirmAction({
      title: `Delete ${entityName}?`,
      text: 'This action cannot be undone.',
      confirmButtonText: 'Delete',
    });
    if (!ok) return;
    setRows((prev) => prev.filter((r) => r.id !== row.id));
    toastSuccess(`${entityName} deleted`);
  };

  const actionColumn = {
    key: '__actions',
    header: '',
    className: 'text-right',
    render: (row) =>
      canManage ? (
        <div className="flex justify-end gap-1">
          <button
            onClick={() => openEdit(row)}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-800"
            aria-label="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(row)}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-danger dark:hover:bg-slate-800"
            aria-label="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ) : null,
  };

  return (
    <div>
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={
          canManage && (
            <button onClick={openCreate} className="btn-primary">
              <Plus className="h-4 w-4" />
              Add {entityName}
            </button>
          )
        }
      />

      <DataTable
        columns={canManage ? [...columns, actionColumn] : columns}
        rows={rows}
        searchKeys={searchKeys}
        loading={loading}
        emptyTitle={`No ${entityName.toLowerCase()}s yet`}
        emptyMessage={canManage ? `Click "Add ${entityName}" to create one.` : undefined}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`${editing ? 'Edit' : 'Add'} ${entityName}`}
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleSubmit(onSubmit)} className="btn-primary">
              {editing ? 'Save changes' : 'Create'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.name} className={f.full ? 'sm:col-span-2' : ''}>
              <label className="label" htmlFor={f.name}>{f.label}</label>
              {f.type === 'select' ? (
                <select id={f.name} className="input" {...register(f.name, { required: f.required })}>
                  <option value="">Select…</option>
                  {f.options.map((o) => (
                    <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
                  ))}
                </select>
              ) : f.type === 'textarea' ? (
                <textarea id={f.name} rows={3} className="input" placeholder={f.placeholder} {...register(f.name, { required: f.required })} />
              ) : (
                <input
                  id={f.name}
                  type={f.type || 'text'}
                  step={f.step}
                  className="input"
                  placeholder={f.placeholder}
                  {...register(f.name, { required: f.required, valueAsNumber: f.type === 'number' })}
                />
              )}
              {errors[f.name] && <p className="mt-1 text-xs text-danger">{f.label} is required</p>}
            </div>
          ))}
        </form>
      </Modal>
    </div>
  );
}
