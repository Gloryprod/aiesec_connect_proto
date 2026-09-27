import React from "react";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  title,
  subtitle,
  action,
}) => {
  return (
    <div className="min-h-screen bg-aiesec-background text-aiesec-text flex flex-col">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-30 bg-aiesec-surface border-b border-aiesec-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-aiesec-blue flex items-center justify-center text-white font-bold text-lg">
              A
            </div>
            <span className="font-bold text-lg text-aiesec-navy tracking-tight">
              AIESEC Connect
            </span>
          </div>
          <nav className="flex items-center gap-4 text-sm font-medium text-aiesec-text-secondary">
            <a href="#" className="hover:text-aiesec-blue transition-colors">Dashboard</a>
            <a href="#" className="hover:text-aiesec-blue transition-colors">Projets</a>
            <a href="#" className="hover:text-aiesec-blue transition-colors">Membres</a>
          </nav>
        </div>
      </header>

      {/* Zone de contenu */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {(title || action) && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              {title && <h1 className="text-2xl font-bold text-aiesec-navy">{title}</h1>}
              {subtitle && <p className="text-aiesec-text-secondary text-sm mt-1">{subtitle}</p>}
            </div>
            {action && <div className="flex items-center gap-3">{action}</div>}
          </div>
        )}
        {children}
      </main>
    </div>
  );
};