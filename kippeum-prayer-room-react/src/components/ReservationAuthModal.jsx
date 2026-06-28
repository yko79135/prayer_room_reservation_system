import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

export function ReservationAuthModal({ open, mode = "selection", reservation, error, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const firstInputRef = useRef(null);
  const title = mode === "selection" ? "내 예약 확인" : "예약 취소 비밀번호";

  useEffect(() => {
    if (!open) return;
    setName("");
    setPassword("");
    const timer = window.setTimeout(() => firstInputRef.current?.focus(), 0);
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
    onSubmit({ name, password, reservation });
    setPassword("");
  }

  return (
    <div className="modalBackdrop" onMouseDown={onClose}>
      <form className="modal" role="dialog" aria-modal="true" aria-labelledby="reservation-auth-title" onSubmit={handleSubmit} onMouseDown={(event) => event.stopPropagation()}>
        <button className="modalClose" type="button" aria-label="예약 확인 닫기" onClick={onClose}>
          <X size={20} />
        </button>
        <span className="sectionEyebrow">Reservation</span>
        <h2 id="reservation-auth-title">{title}</h2>
        {mode === "selection" && (
          <label htmlFor="reservation-auth-name">
            <span>예약자 이름</span>
            <input id="reservation-auth-name" ref={firstInputRef} value={name} onChange={(event) => setName(event.target.value)} />
          </label>
        )}
        {mode === "single" && (
          <p className="modalMessage">{reservation?.name}님의 {reservation?.time} 예약을 취소하려면 비밀번호를 입력하세요.</p>
        )}
        <label htmlFor="reservation-auth-password">
          <span>예약 취소 비밀번호</span>
          <input
            id="reservation-auth-password"
            ref={mode === "single" ? firstInputRef : undefined}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {error && <p className="modalError">{error}</p>}
        <div className="modalActions">
          <button type="submit">확인</button>
          <button className="ghost" type="button" onClick={onClose}>취소</button>
        </div>
      </form>
    </div>
  );
}
