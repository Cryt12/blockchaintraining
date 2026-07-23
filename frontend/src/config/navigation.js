import {
  LayoutDashboard,
  Users2,
  Building2,
  Tags,
  Package,
  ReceiptText,
  ShieldCheck,
  Link2,
  FileBarChart,
  UserCog,
  Settings,
} from 'lucide-react';

// Single source of truth for the sidebar and route guards.
// `permission` (optional) gates visibility/access via hasPermission().
export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Employees', path: '/employees', icon: Users2, permission: 'employees.manage' },
  { label: 'Offices', path: '/offices', icon: Building2, permission: 'offices.manage' },
  { label: 'Categories', path: '/categories', icon: Tags, permission: 'categories.manage' },
  { label: 'Expendable Items', path: '/items', icon: Package, permission: 'items.manage' },
  { label: 'Return Receipts', path: '/receipts', icon: ReceiptText, permission: 'receipts.view' },
  { label: 'Blockchain Verification', path: '/verify', icon: ShieldCheck, permission: 'blockchain.verify' },
  { label: 'Blockchain Logs', path: '/blockchain-logs', icon: Link2, permission: 'blockchain.view' },
  { label: 'Reports', path: '/reports', icon: FileBarChart, permission: 'reports.view' },
  { label: 'Users', path: '/users', icon: UserCog, permission: 'users.manage' },
  { label: 'Settings', path: '/settings', icon: Settings, permission: 'settings.manage' },
];
