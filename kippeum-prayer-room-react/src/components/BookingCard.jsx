import { BookOpen } from "lucide-react";
import { maxDateString, todayString } from "../hooks/useReservations";
import { SlotGrid } from "./SlotGrid";

export function BookingCard({
  date,
  reservationsByKey,
  selectedSlots,
  onDateChange,
  onToggleSlot,
  onReserveSelected
}) {
  const selectedLabel = selectedSlots.length === 0 ? "선택된 시간 없음" : selectedSlots[0].time;

  return (
    <section className="bookingCard" aria-labelledby="booking-title">
      <div className="infoBlock">
        <div className="iconCircle">
          <BookOpen size={24} />
        </div>
        <div>
          <span className="sectionEyebrow">Reservation Guide</span>
          <h2 id="booking-title">기도실 예약 안내</h2>
          <p className="infoLead">원하시는 날짜와 시간을 선택하세요.</p>
          <ul>
            <li>아침 7시부터 밤 11시 전까지 1시간 단위로 예약할 수 있습니다.</li>
            <li>현재 시간 기준 한 달 앞까지 예약 가능합니다.</li>
            <li>기도실은 개인당 일주일에 1시간 이용이 가능합니다.</li>
            <li>예약 취소는 예약 시 만든 취소 비밀번호로 가능합니다.</li>
            <li>밤 11시부터 다음날 오전 7시까지는 예약이 불가합니다. 이 시간에 기도하기 원하시는 분은 이창규 목사님의 허락을 받아 기도하시기 바랍니다.</li>
          </ul>
        </div>
      </div>

      <div className="divider" />

      <div className="formGrid" aria-label="예약 날짜 선택">
        <label className="dateField">
          <span>날짜 선택</span>
          <input
            type="date"
            value={date}
            min={todayString()}
            max={maxDateString()}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </label>

        <button className="primarySmall" type="button" onClick={() => onDateChange(todayString())}>
          오늘 보기
        </button>
      </div>

      <div className="slotHeader">
        <h3>
          시간 선택 <small>(1시간 단위)</small>
        </h3>
        <div className="legend">
          <span><i className="dot availableDot" />예약 가능</span>
          <span><i className="dot selectedDot" />선택됨</span>
          <span><i className="dot disabledDot" />예약 불가</span>
        </div>
      </div>

      <SlotGrid
        date={date}
        reservationsByKey={reservationsByKey}
        selectedSlots={selectedSlots}
        onToggleSlot={onToggleSlot}
      />

      <div className="selectedBar">
        <div>
          <span className="selectedCount">{selectedSlots.length ? "1시간 선택" : "선택 전"}</span>
          <strong>{selectedLabel}</strong>
        </div>
        <button type="button" onClick={onReserveSelected} disabled={selectedSlots.length === 0}>
          이 시간 예약하기
        </button>
      </div>
    </section>
  );
}
