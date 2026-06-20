import { useNavigate } from 'react-router-dom';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: { label: string; onClick: () => void };
}

export function ScreenHeader({ title, onBack, rightAction }: ScreenHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background px-4">
      <button
        type="button"
        onClick={onBack ?? (() => navigate(-1))}
        className="flex h-8 w-8 items-center justify-center text-text-primary"
        aria-label="Go back"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <h1 className="text-[18px] font-semibold text-text-primary">{title}</h1>
      {rightAction ? (
        <button type="button" onClick={rightAction.onClick} className="text-sm font-medium text-primary">
          {rightAction.label}
        </button>
      ) : (
        <span className="w-8" />
      )}
    </header>
  );
}
