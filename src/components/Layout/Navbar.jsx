import { Link, useLocation } from 'react-router-dom';
import { FileText, Download, LayoutTemplate, Eye } from 'lucide-react';

const navLinks = [
  { to: '/',          label: 'Home' },
  { to: '/templates', label: 'Templates', icon: LayoutTemplate },
  { to: '/preview',   label: 'Preview',   icon: Eye },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <header className="h-14 border-b border-slate-200 bg-white flex items-center px-4 md:px-6 gap-4 flex-shrink-0 z-20">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 font-bold text-slate-800 text-base mr-4">
        <span className="flex items-center justify-center w-7 h-7 bg-blue-600 rounded-lg">
          <FileText size={15} className="text-white" />
        </span>
        <span className="hidden sm:block">ResumeBuilder</span>
      </Link>

      {/* Nav links */}
      <nav className="flex items-center gap-1 flex-1">
        {navLinks.map(({ to, label }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                active
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <Link
          to="/preview"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
        >
          <Eye size={15} />
          Full Preview
        </Link>
        <button
          disabled
          title="PDF export — coming in Day 2"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Download size={15} />
          <span className="hidden sm:block">Download PDF</span>
        </button>
      </div>
    </header>
  );
}
