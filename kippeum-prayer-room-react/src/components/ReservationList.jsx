import { Lock } from "lucide-react";

export function ReservationList({ reservations, loading, onDeleteReservation }) {
  return (
    <aside className="sideCard" aria-labelledby="reservation-list-title">
      <div className="iconCircle large"><Lock size={30} /></div>
      <h2 id="reservation-list-title">예약 취소</h2>
      <p>예약 시 받은 취소 비밀번호로 본인 예약을 삭제할 수 있습니다.</p>

      <div className="reservationList">
        {loading ? (
          <p className="reservationState loadingState">예약을 불러오는 중입니다...</p>
        ) : reservations.length === 0 ? (
          <p className="reservationState">이 날짜에는 아직 예약이 없습니다.</p>
        ) : (
          reservations.map((r) => (
            <div className="reservationItem" key={r.id}>
              <div>
                <strong>{r.time}</strong>
                <span>{r.name}</span>
                {r.note && <small>{r.note}</small>}
              </div>
              <button type="button" aria-label={`${r.time} ${r.name} 예약 삭제`} onClick={() => onDeleteReservation(r)}>삭제</button>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
