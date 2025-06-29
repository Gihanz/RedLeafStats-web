export default function LoadingButton({ loading, children, className = "", ...props }) {
  return (
    <button
      disabled={loading}
      className={`flex items-center justify-center px-4 py-2 disabled:opacity-50 transition ${className}`}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
      )}
      {children}
    </button>
  );
}
