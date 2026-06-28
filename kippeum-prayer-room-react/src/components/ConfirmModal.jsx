import { useEffect, useRef } from "react";

export function ConfirmModal({ open, title, message, cancelLabel = "취소", confirmLabel = "확인", destructive = false, onCancel, onConfirm }) {
  const cancelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => cancelRef.current?.focus(), 0);
    function handleKeyDown(event) {
      if (event.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="modalBackdrop" onMouseDown={onCancel}>
      <div className="modal confirmModal" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title" onMouseDown={(event) => event.stopPropagation()}>
        <span className="sectionEyebrow">Please Confirm</span>
        <h2 id="confirm-modal-title">{title}</h2>
        <p className="modalMessage">{message}</p>
        <div className="modalActions">
          <button className={destructive ? "dangerButton" : undefined} type="button" onClick={onConfirm}>{confirmLabel}</button>
          <button ref={cancelRef} className="ghost" type="button" onClick={onCancel}>{cancelLabel}</button>
        </div>
      </div>
    </div>
  );
}
