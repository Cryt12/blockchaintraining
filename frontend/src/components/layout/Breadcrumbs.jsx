import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { NAV_ITEMS } from '@/config/navigation';

// Derives a simple two-level breadcrumb (Home / <Section>) from the current path.
export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const current = NAV_ITEMS.find((i) => i.path === pathname);
  const title = current?.label ?? 'Page';

  return (
    <nav className="flex items-center gap-1.5 text-sm text-slate-400" aria-label="Breadcrumb">
      <Link to="/" className="hover:text-slate-600 dark:hover:text-slate-200">
        Home
      </Link>
      {pathname !== '/' && (
        <>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-slate-600 dark:text-slate-200">{title}</span>
        </>
      )}
    </nav>
  );
}
