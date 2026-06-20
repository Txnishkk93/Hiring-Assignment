import { NavLink } from 'react-router-dom';

const navItems = [
  {
    to: '/',
    label: 'Home',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
        <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z" />
      </svg>
    ),
  },
  {
    to: '/',
    label: 'Search',
    end: false,
    icon: (_active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3-3" />
      </svg>
    ),
  },
  {
    to: '/bookings',
    label: 'Bookings',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
        <path d="M4 6h16M4 12h16M4 18h10" />
      </svg>
    ),
  },
  {
    to: '/login',
    label: 'Profile',
    icon: (_active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
      </svg>
    ),
  },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 z-30 flex h-16 w-full max-w-[390px] items-center justify-around border-t border-border bg-background">
      {navItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.to}
          end={item.end ?? item.to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] ${isActive ? 'text-primary' : 'text-text-muted'}`
          }
        >
          {({ isActive }) => (
            <>
              {item.icon(isActive)}
              <span>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
