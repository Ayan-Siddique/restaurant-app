import { useEffect } from "react";
import { AlertTriangle, AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { removeToast, type ToastItem } from "../../store/slices/toastSlice";

function ToastItemCard({ toast }: { toast: ToastItem }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!toast.duration || toast.duration <= 0) return;
    const timer = setTimeout(() => {
      dispatch(removeToast(toast.id));
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, dispatch]);

  const getIcon = () => {
    switch (toast.type) {
      case "warning":
        return <AlertTriangle size={20} className="text-[#f5a623] shrink-0 mt-0.5" />;
      case "error":
        return <AlertCircle size={20} className="text-rose-600 shrink-0 mt-0.5" />;
      case "success":
        return <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />;
      case "info":
      default:
        return <Info size={20} className="text-sky-600 shrink-0 mt-0.5" />;
    }
  };

  const getStyleClasses = () => {
    switch (toast.type) {
      case "warning":
        return "bg-amber-50/95 border-amber-300 text-amber-950 shadow-amber-900/10";
      case "error":
        return "bg-rose-50/95 border-rose-300 text-rose-950 shadow-rose-900/10";
      case "success":
        return "bg-emerald-50/95 border-emerald-300 text-emerald-950 shadow-emerald-900/10";
      case "info":
      default:
        return "bg-sky-50/95 border-sky-300 text-sky-950 shadow-sky-900/10";
    }
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={`alert border rounded-2xl p-4 shadow-xl flex items-start gap-3 w-full max-w-sm sm:max-w-md backdrop-blur-xs transition-all duration-200 animate-[slideDown_0.2s_ease-out] ${getStyleClasses()}`}
    >
      {getIcon()}

      <div className="flex-1 min-w-0 pr-1">
        <h4
          className="text-sm font-bold text-neutral-900 m-0 leading-tight"
          style={{ fontFamily: "'Rubik', sans-serif" }}
        >
          {toast.title}
        </h4>
        <p className="text-xs text-neutral-700 m-0 mt-1 leading-relaxed">
          {toast.message}
        </p>
      </div>

      <button
        type="button"
        onClick={() => dispatch(removeToast(toast.id))}
        aria-label="Dismiss notification"
        className="text-neutral-400 hover:text-neutral-700 p-1 rounded-full hover:bg-neutral-200/50 transition-colors shrink-0 cursor-pointer"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function GlobalToast() {
  const toasts = useAppSelector((state) => state.toast.toasts);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-label="Notifications"
      className="toast toast-top toast-end z-[9999] p-4 sm:p-6 flex flex-col gap-2.5 pointer-events-auto fixed"
    >
      {toasts.map((toast) => (
        <ToastItemCard key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

export default GlobalToast;
