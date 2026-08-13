import { useState } from "react";
import { X } from "lucide-react";

export function ReservationModal({ selectedSlots, onClose, onSave }) {
  const [name, setName] = useState("");
  const [cancelCode, setCancelCode] = useState("");
  const [error, setError] = useState("");

  async function handleSave() {
    if (!name.trim()) {
      setError("이름을 입력해주세요.");
      return;
    }
    if (!cancelCode.trim() || cancelCode.trim().length < 4) {
      setError("본인 삭제용 비밀번호를 4자리 이상 입력해주세요.");
      return;
    }

    const success = await onSave({ name, cancelCode });
    if (success) onClose();
  }

  return (
    <div className="modalBackdrop">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="reservation-modal-title">
        <button className="modalClose" type="button" aria-label="예약 모달 닫기" onClick={onClose}>
          <X size={20} />
        </button>
        <span className="sectionEyebrow">Confirm Reservation</span>
        <h2 id="reservation-modal-title">선택한 시간 예약하기</h2>

        <label>
          <span>예약 시간</span>
          <textarea readOnly value={selectedSlots.map((s) => `${s.date} ${s.time}`).join("\n")} />
        </label>

        <label>
          <span>이름</span>
          <input value={name} onChange={(e) => { setName(e.target.value); setError(""); }} placeholder="예: 홍길동" />
        </label>

        <label>
          <span>본인 삭제용 비밀번호</span>
          <input
            type="password"
            value={cancelCode}
            onChange={(e) => { setCancelCode(e.target.value); setError(""); }}
            placeholder="4자리 이상"
          />
        </label>

        {error && <p className="modalError" role="alert">{error}</p>}

        <div className="modalActions">
          <button type="button" onClick={handleSave}>예약 저장</button>
          <button className="ghost" type="button" onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
}
