import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AppShellProps {
  children: ReactNode;
  showBottomNav?: boolean;
  bottomNav?: ReactNode;
}

export function AppShell({ children, showBottomNav = false, bottomNav }: AppShellProps) {
  return (
    <div className="min-h-screen bg-surface-muted flex flex-col items-center">
      {/* Desktop Top Navbar */}
      <header className="hidden md:flex w-full max-w-5xl justify-between items-center px-6 py-4 bg-background border-b border-border sticky top-0 z-30">
        <Link to="/" className="text-xl font-bold text-primary flex items-center gap-2">
          <span>🎬</span> <span className="tracking-tight">MovieTicket</span>
        </Link>
        <nav className="flex gap-8 items-center font-semibold text-sm">
          <Link to="/" className="text-text-primary hover:text-primary transition">Home</Link>
          <Link to="/bookings" className="text-text-primary hover:text-primary transition">My Bookings</Link>
          <Link to="/login" className="text-text-primary hover:text-primary transition">Profile</Link>
        </nav>
      </header>

      <div
        className="relative flex min-h-screen md:min-h-[calc(100vh-80px)] w-full max-w-[390px] md:max-w-5xl flex-col bg-background shadow-sm md:rounded-xl md:my-6 md:border md:border-border md:shadow-md overflow-hidden"
      >
        <div className={`flex-1 ${showBottomNav ? 'pb-[64px] md:pb-0' : ''}`}>{children}</div>
        {showBottomNav && <div className="md:hidden">{bottomNav}</div>}
      </div>
    </div>
  );
}
