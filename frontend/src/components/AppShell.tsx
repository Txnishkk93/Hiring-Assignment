import type { ReactNode } from 'react';
import { tokens } from '../styles/tokens';

interface AppShellProps {
  children: ReactNode;
  showBottomNav?: boolean;
  bottomNav?: ReactNode;
}

export function AppShell({ children, showBottomNav = false, bottomNav }: AppShellProps) {
  return (
    <div className="min-h-screen bg-surface-muted flex justify-center">
      <div
        className="relative flex min-h-screen w-full flex-col bg-background shadow-sm"
        style={{ maxWidth: tokens.layout.appWidth }}
      >
        <div className={`flex-1 ${showBottomNav ? 'pb-[64px]' : ''}`}>{children}</div>
        {showBottomNav && bottomNav}
      </div>
    </div>
  );
}
