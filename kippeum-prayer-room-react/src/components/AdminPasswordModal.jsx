import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { ADMIN_PASSWORD } from "../hooks/useReservations";

export function AdminPasswordModal({ open, onClose, onSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setPassword("");
    setError("");
    const timer = window.setTimeout(() => inputRef.current?.focus(), 0);
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  function handleSubmit(event) {
    event.preventDefault();
    if (password !== ADMIN_PASSWORD) {
      setPassword("");
      setError("관리자 비밀번호가 틀렸습니다.");
      inputRef.current?.focus();
      return;
    }
    setPassword("");
    setError("");
    onSuccess();
  }

  return (
    <div className="modalBackdrop" onMouseDown={onClose}>
      <form className="modal" role="dialog" aria-modal="true" aria-labelledby="admin-password-title" onSubmit={handleSubmit} onMouseDown={(event) => event.stopPropagation()}>
        <button className="modalClose" type="button" aria-label="관리자 로그인 닫기" onClick={onClose}>
          <X size={20} />
        </button>
        <span className="sectionEyebrow">Admin Login</span>
        <h2 id="admin-password-title">관리자 로그인</h2>
        <label htmlFor="admin-password-input">
          <span>관리자 비밀번호</span>
          <input
            id="admin-password-input"
            ref={inputRef}
            type="password"
            autoComplete="current-password"
            inputMode="numeric"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              if (error) setError("");
            }}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "admin-password-error" : undefined}
          />
        </label>
        {error && <p className="modalError" id="admin-password-error">{error}</p>}
        <div className="modalActions">
          <button type="submit">확인</button>
          <button className="ghost" type="button" onClick={onClose}>취소</button>
        </div>
      </form>
    </div>
  );
}
