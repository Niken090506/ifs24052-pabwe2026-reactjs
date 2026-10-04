import { useEffect, useRef } from "react";
import { IconX } from "@tabler/icons-react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Kerangka dialog modal yang aksesibel:
 * role="dialog", fokus berpindah ke dalam dialog, Tab terkunci di dalamnya,
 * Escape menutup dialog, dan fokus dikembalikan saat ditutup.
 */
export default function ModalShell({ titleId, title, onClose, children }) {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const previous = document.activeElement;
    const dialog = dialogRef.current;
    const first = dialog.querySelector("input, select, textarea") ?? dialog;
    first.focus();
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") {
        return;
      }
      const items = dialog.querySelectorAll(FOCUSABLE);
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previous?.focus?.();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        data-testid="modal-backdrop"
        className="absolute inset-0 bg-slate-900/60"
        onClick={() => onCloseRef.current()}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-xl font-bold text-slate-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup dialog"
            className="rounded-lg p-1.5 text-slate-700 hover:bg-slate-100"
          >
            <IconX size={20} aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}