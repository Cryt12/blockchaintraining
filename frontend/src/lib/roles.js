// Role-based access control definitions, mirrored from the backend RBAC.
// Keep the role keys in sync with the `user_role` enum in the database.

export const ROLES = {
  ADMINISTRATOR: 'administrator',
  PROPERTY_CUSTODIAN: 'property_custodian',
  VERIFIER: 'verifier',
  VIEWER: 'viewer',
};

export const ROLE_LABELS = {
  [ROLES.ADMINISTRATOR]: 'Administrator',
  [ROLES.PROPERTY_CUSTODIAN]: 'Property Custodian',
  [ROLES.VERIFIER]: 'Verifier',
  [ROLES.VIEWER]: 'Viewer',
};

// Permission → roles allowed. Checked by hasPermission() and route guards.
// Administrator implicitly has every permission (handled in hasPermission).
const PERMISSIONS = {
  'employees.manage': [ROLES.ADMINISTRATOR, ROLES.PROPERTY_CUSTODIAN],
  'offices.manage': [ROLES.ADMINISTRATOR, ROLES.PROPERTY_CUSTODIAN],
  'categories.manage': [ROLES.ADMINISTRATOR, ROLES.PROPERTY_CUSTODIAN],
  'items.manage': [ROLES.ADMINISTRATOR, ROLES.PROPERTY_CUSTODIAN],
  'receipts.create': [ROLES.ADMINISTRATOR, ROLES.PROPERTY_CUSTODIAN],
  'receipts.view': [ROLES.ADMINISTRATOR, ROLES.PROPERTY_CUSTODIAN, ROLES.VERIFIER, ROLES.VIEWER],
  'blockchain.verify': [ROLES.ADMINISTRATOR, ROLES.PROPERTY_CUSTODIAN, ROLES.VERIFIER],
  'blockchain.view': [ROLES.ADMINISTRATOR, ROLES.PROPERTY_CUSTODIAN, ROLES.VERIFIER, ROLES.VIEWER],
  'reports.view': [ROLES.ADMINISTRATOR, ROLES.PROPERTY_CUSTODIAN, ROLES.VERIFIER, ROLES.VIEWER],
  'users.manage': [ROLES.ADMINISTRATOR],
  'settings.manage': [ROLES.ADMINISTRATOR],
};

export function hasPermission(role, permission) {
  if (!role) return false;
  if (role === ROLES.ADMINISTRATOR) return true;
  const allowed = PERMISSIONS[permission];
  return Array.isArray(allowed) && allowed.includes(role);
}
