import { useState } from 'react';
import { Sun, Moon, Wallet, Database, Link2, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import Badge from '@/components/ui/Badge';
import { useTheme } from '@/contexts/ThemeContext';
import { isSupabaseConfigured } from '@/lib/supabase';
import {
  hasMetaMask,
  isContractConfigured,
  CONTRACT_ADDRESS,
  SEPOLIA_CHAIN_ID,
  connectWalletContract,
} from '@/lib/contract';
import { toastError, toastSuccess } from '@/lib/toast';

function StatusPill({ ok, okText, offText }) {
  return ok ? (
    <Badge variant="success"><CheckCircle2 className="h-3 w-3" />{okText}</Badge>
  ) : (
    <Badge variant="warning"><XCircle className="h-3 w-3" />{offText}</Badge>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [wallet, setWallet] = useState(null);
  const [connecting, setConnecting] = useState(false);

  const connect = async () => {
    setConnecting(true);
    try {
      const { address } = await connectWalletContract();
      setWallet(address);
      toastSuccess('Wallet connected');
    } catch (err) {
      toastError(err.message || 'Could not connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Appearance, blockchain wallet, and integration status." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Section icon={theme === 'dark' ? Moon : Sun} title="Appearance">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Theme</p>
              <p className="text-xs text-slate-400">Toggle light / dark mode.</p>
            </div>
            <button onClick={toggleTheme} className="btn-secondary">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === 'dark' ? 'Light' : 'Dark'} mode
            </button>
          </div>
        </Section>

        <Section icon={Wallet} title="Blockchain Wallet">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">MetaMask</span>
              <StatusPill ok={hasMetaMask} okText="Detected" offText="Not installed" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Contract</span>
              <StatusPill ok={isContractConfigured} okText="Configured" offText="Not set" />
            </div>
            {isContractConfigured && (
              <p className="break-all rounded-lg bg-slate-50 p-2 font-mono text-xs text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                {CONTRACT_ADDRESS}
              </p>
            )}
            <p className="text-xs text-slate-400">Network: Sepolia (chain ID {SEPOLIA_CHAIN_ID})</p>
            {wallet ? (
              <p className="break-all rounded-lg bg-success/10 p-2 font-mono text-xs text-success">Connected: {wallet}</p>
            ) : (
              <button onClick={connect} disabled={connecting || !hasMetaMask} className="btn-primary w-full">
                {connecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
                Connect MetaMask
              </button>
            )}
          </div>
        </Section>

        <Section icon={Database} title="Supabase">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Connection</span>
            <StatusPill ok={isSupabaseConfigured} okText="Connected" offText="Demo mode" />
          </div>
          {!isSupabaseConfigured && (
            <p className="mt-3 text-xs text-slate-400">
              Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> to{' '}
              <code>.env</code> to connect live data.
            </p>
          )}
        </Section>

        <Section icon={Link2} title="About">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500 dark:text-slate-400">Application</dt><dd className="font-medium text-slate-700 dark:text-slate-200">RREPS</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500 dark:text-slate-400">Version</dt><dd className="font-medium text-slate-700 dark:text-slate-200">0.1.0</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500 dark:text-slate-400">Hash algorithm</dt><dd className="font-medium text-slate-700 dark:text-slate-200">SHA-256</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500 dark:text-slate-400">Chain</dt><dd className="font-medium text-slate-700 dark:text-slate-200">Ethereum Sepolia</dd></div>
          </dl>
        </Section>
      </div>
    </div>
  );
}
