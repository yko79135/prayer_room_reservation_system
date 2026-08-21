import { History } from "lucide-react";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function formatDateLabel(dateString) {
  const d = new Date(`${dateString}T12:00:00`);
  return `${dateString} (${WEEKDAY_LABELS[d.getDay()]})`;
}

export function ReservationHistoryTable({ reservations, loading }) {
  return (
    <section className="bookingCard historyCard" aria-labelledby="history-title">
      <div className="infoBlock">
        <div className="iconCircle">
          <History size={24} />
        </div>
        <div>
          <span className="sectionEyebrow">Reservation History</span>
          <h2 id="history-title">전체 예약 내역</h2>
          <p className="infoLead">지금까지의 모든 예약을 날짜순으로 확인할 수 있습니다.</p>
        </div>
      </div>

      <div className="divider" />

      {loading ? (
        <p className="reservationState loadingState">예약 내역을 불러오는 중입니다...</p>
      ) : reservations.length === 0 ? (
        <p className="reservationState">아직 예약 내역이 없습니다.</p>
      ) : (
        <div className="historyTableWrap">
          <table className="historyTable">
            <thead>
              <tr>
                <th scope="col">날짜</th>
                <th scope="col">시간</th>
                <th scope="col">예약자</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id}>
                  <td>{formatDateLabel(r.date)}</td>
                  <td>{r.time}</td>
                  <td>{r.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
