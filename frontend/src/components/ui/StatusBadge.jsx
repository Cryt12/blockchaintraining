import { CheckCircle2, Clock, XCircle, Circle, ShieldCheck } from 'lucide-react';
import Badge from './Badge';

// Maps domain status strings to a badge variant + icon + label.
const MAP = {
  // receipt statuses
  draft: { variant: 'neutral', icon: Circle, label: 'Draft' },
  submitted: { variant: 'primary', icon: Clock, label: 'Submitted' },
  blockchain_pending: { variant: 'warning', icon: Clock, label: 'Pending' },
  blockchain_verified: { variant: 'success', icon: ShieldCheck, label: 'Verified' },
  blockchain_failed: { variant: 'danger', icon: XCircle, label: 'Failed' },
  // blockchain log statuses
  pending: { variant: 'warning', icon: Clock, label: 'Pending' },
  confirmed: { variant: 'success', icon: CheckCircle2, label: 'Confirmed' },
  failed: { variant: 'danger', icon: XCircle, label: 'Failed' },
  // generic entity statuses
  active: { variant: 'success', icon: CheckCircle2, label: 'Active' },
  inactive: { variant: 'neutral', icon: Circle, label: 'Inactive' },
  depleted: { variant: 'warning', icon: Circle, label: 'Depleted' },
  archived: { variant: 'neutral', icon: Circle, label: 'Archived' },
};

export default function StatusBadge({ status }) {
  const cfg = MAP[status] || { variant: 'neutral', icon: Circle, label: status };
  const Icon = cfg.icon;
  return (
    <Badge variant={cfg.variant}>
      <Icon className="h-3 w-3" />
      {cfg.label}
    </Badge>
  );
}
