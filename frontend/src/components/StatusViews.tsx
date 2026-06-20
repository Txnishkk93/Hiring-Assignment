export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <p className="text-sm text-text-secondary">{message}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-4 py-16 text-center">
      <p className="text-sm text-error">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="text-sm font-medium text-primary">
          Try again
        </button>
      )}
    </div>
  );
}
