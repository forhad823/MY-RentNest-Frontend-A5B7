const GlobalLoading = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default GlobalLoading;
