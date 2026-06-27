import { generateSlots, isPastSlot, reservationKey } from "../hooks/useReservations";

export function SlotGrid({ date, reservationsByKey, selectedSlots, onToggleSlot }) {
  return (
    <div className="slotGrid" aria-label="예약 시간 선택">
      {generateSlots().map((time) => {
        const key = reservationKey(date, time);
        const reservation = reservationsByKey[key];
        const past = isPastSlot(date, time);
        const selected = selectedSlots.some((s) => s.reservation_key === key);

        let className = "slot available";
        let label = "예약 가능";

        if (reservation || past) {
          className = "slot disabled";
          label = reservation ? "예약 완료" : "예약 불가";
        } else if (selected) {
          className = "slot selected";
          label = "선택됨";
        }

        return (
          <button
            key={key}
            className={className}
            disabled={Boolean(reservation || past)}
            aria-pressed={selected}
            aria-label={`${time} ${label}${reservation ? `, 예약자 ${reservation.name}` : ""}`}
            onClick={() => onToggleSlot(time)}
          >
            <strong>{time}</strong>
            <span>{label}</span>
            {reservation && <em>{reservation.name}</em>}
          </button>
        );
      })}
    </div>
  );
}
