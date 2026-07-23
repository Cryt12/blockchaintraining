import { createContext, useContext, useEffect, useState } from 'react';
import { ROLES } from '@/lib/roles';

const AuthContext = createContext(null);
const STORAGE_KEY = 'rreps-auth-user';

// Demo accounts let you explore each role's permissions before the Laravel
// JWT backend is wired up. Once the backend exists, replace login() below with
// a POST to /api/auth/login and store the returned JWT instead.
export const DEMO_ACCOUNTS = [
  { email: 'admin@rreps.gov', password: 'demo1234', name: 'System Administrator', role: ROLES.ADMINISTRATOR },
  { email: 'custodian@rreps.gov', password: 'demo1234', name: 'Property Custodian', role: ROLES.PROPERTY_CUSTODIAN },
  { email: 'verifier@rreps.gov', password: 'demo1234', name: 'Records Verifier', role: ROLES.VERIFIER },
  { email: 'viewer@rreps.gov', password: 'demo1234', name: 'Read-only Viewer', role: ROLES.VIEWER },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {
      // ignore malformed storage
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const match = DEMO_ACCOUNTS.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password,
    );
    if (!match) {
      throw new Error('Invalid email or password.');
    }
    const authUser = { email: match.email, name: match.name, role: match.role };
    setUser(authUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    return authUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: Boolean(user) }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
