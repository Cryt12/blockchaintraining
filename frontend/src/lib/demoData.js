// Sample data used only in demo mode (Supabase not configured). Mirrors the shape
// of the database tables so pages can be swapped to live queries without refactoring.

export const demoOffices = [
  { id: 'o1', office_name: 'Office of the Mayor', office_code: 'OM', description: 'Executive office' },
  { id: 'o2', office_name: 'Human Resources', office_code: 'HR', description: 'Personnel management' },
  { id: 'o3', office_name: 'IT Department', office_code: 'ICT', description: 'Information & comms tech' },
  { id: 'o4', office_name: 'Accounting', office_code: 'ACC', description: 'Finance and accounting' },
  { id: 'o5', office_name: 'General Services', office_code: 'GSO', description: 'Facilities and supplies' },
];

export const demoCategories = [
  { id: 'c1', category_name: 'Office Supplies', description: 'Consumable office items' },
  { id: 'c2', category_name: 'ICT Equipment', description: 'Computer peripherals and hardware' },
  { id: 'c3', category_name: 'Cleaning Materials', description: 'Janitorial supplies' },
  { id: 'c4', category_name: 'Medical Supplies', description: 'First aid and consumables' },
];

export const demoEmployees = [
  { id: 'e1', employee_number: 'EMP-0001', full_name: 'Maria Santos', office: 'Human Resources', position: 'HR Officer', status: 'active' },
  { id: 'e2', employee_number: 'EMP-0002', full_name: 'Juan Dela Cruz', office: 'IT Department', position: 'System Admin', status: 'active' },
  { id: 'e3', employee_number: 'EMP-0003', full_name: 'Ana Reyes', office: 'Accounting', position: 'Accountant II', status: 'active' },
  { id: 'e4', employee_number: 'EMP-0004', full_name: 'Pedro Ramos', office: 'General Services', position: 'Utility Worker', status: 'inactive' },
  { id: 'e5', employee_number: 'EMP-0005', full_name: 'Liza Mendoza', office: 'Office of the Mayor', position: 'Executive Assistant', status: 'active' },
];

export const demoItems = [
  { id: 'i1', property_number: 'PN-2026-0001', item_code: 'BP-BLK', description: 'Ballpoint Pen (Black)', category: 'Office Supplies', unit: 'box', quantity: 100, remaining_quantity: 42, status: 'active' },
  { id: 'i2', property_number: 'PN-2026-0002', item_code: 'USB-32', description: 'USB Flash Drive 32GB', category: 'ICT Equipment', unit: 'pc', quantity: 50, remaining_quantity: 12, status: 'active' },
  { id: 'i3', property_number: 'PN-2026-0003', item_code: 'DET-1L', description: 'Liquid Detergent 1L', category: 'Cleaning Materials', unit: 'bottle', quantity: 80, remaining_quantity: 0, status: 'depleted' },
  { id: 'i4', property_number: 'PN-2026-0004', item_code: 'MSK-50', description: 'Surgical Mask (50/box)', category: 'Medical Supplies', unit: 'box', quantity: 60, remaining_quantity: 33, status: 'active' },
  { id: 'i5', property_number: 'PN-2026-0005', item_code: 'HDMI-2M', description: 'HDMI Cable 2m', category: 'ICT Equipment', unit: 'pc', quantity: 40, remaining_quantity: 25, status: 'active' },
];

export const demoReceipts = [
  { id: 'r1', receipt_number: 'RRP-2026-000001', employee: 'Maria Santos', office: 'Human Resources', return_date: '2026-07-20', items: 3, status: 'blockchain_verified' },
  { id: 'r2', receipt_number: 'RRP-2026-000002', employee: 'Juan Dela Cruz', office: 'IT Department', return_date: '2026-07-21', items: 5, status: 'blockchain_verified' },
  { id: 'r3', receipt_number: 'RRP-2026-000003', employee: 'Ana Reyes', office: 'Accounting', return_date: '2026-07-22', items: 2, status: 'blockchain_pending' },
  { id: 'r4', receipt_number: 'RRP-2026-000004', employee: 'Liza Mendoza', office: 'Office of the Mayor', return_date: '2026-07-23', items: 1, status: 'submitted' },
  { id: 'r5', receipt_number: 'RRP-2026-000005', employee: 'Pedro Ramos', office: 'General Services', return_date: '2026-07-23', items: 4, status: 'draft' },
];

export const demoBlockchainLogs = [
  {
    id: 'b1',
    receipt_number: 'RRP-2026-000001',
    sha256_hash: '9f2c1a7b3e4d5c6f8a0b1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a',
    transaction_hash: '0x8a3b1c9d7e5f2a4b6c8d0e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b',
    wallet_address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    block_number: 6284157,
    gas_used: 48231,
    status: 'confirmed',
    created_at: '2026-07-20T09:14:00Z',
  },
  {
    id: 'b2',
    receipt_number: 'RRP-2026-000002',
    sha256_hash: 'a1b2c3d4e5f60718293a4b5c6d7e8f9012a3b4c5d6e7f8091a2b3c4d5e6f7081',
    transaction_hash: '0x2f4e6d8c0a1b3d5f7091a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4',
    wallet_address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    block_number: 6284203,
    gas_used: 47980,
    status: 'confirmed',
    created_at: '2026-07-21T10:02:00Z',
  },
  {
    id: 'b3',
    receipt_number: 'RRP-2026-000003',
    sha256_hash: 'f0e1d2c3b4a5968778695a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d',
    transaction_hash: null,
    wallet_address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    block_number: null,
    gas_used: null,
    status: 'pending',
    created_at: '2026-07-22T14:30:00Z',
  },
];

// Dashboard chart series.
export const demoMonthlyReturns = [
  { month: 'Jan', items: 42 },
  { month: 'Feb', items: 55 },
  { month: 'Mar', items: 38 },
  { month: 'Apr', items: 61 },
  { month: 'May', items: 49 },
  { month: 'Jun', items: 72 },
  { month: 'Jul', items: 58 },
];

export const demoByOffice = [
  { office: 'HR', returns: 24 },
  { office: 'ICT', returns: 41 },
  { office: 'Accounting', returns: 18 },
  { office: 'GSO', returns: 33 },
  { office: 'Mayor', returns: 12 },
];

export const demoByCategory = [
  { category: 'Office Supplies', value: 45 },
  { category: 'ICT Equipment', value: 30 },
  { category: 'Cleaning Materials', value: 15 },
  { category: 'Medical Supplies', value: 10 },
];

export const demoActivity = [
  { id: 'a1', action: 'Verified Receipt', detail: 'RRP-2026-000002 confirmed on-chain', time: '2 hours ago' },
  { id: 'a2', action: 'Created Receipt', detail: 'RRP-2026-000005 saved as draft', time: '3 hours ago' },
  { id: 'a3', action: 'Updated Item', detail: 'USB Flash Drive 32GB remaining set to 12', time: '5 hours ago' },
  { id: 'a4', action: 'Login', detail: 'custodian@rreps.gov signed in', time: 'Yesterday' },
];
