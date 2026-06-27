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
  const selectedLabel =
    selectedSlots.length === 0 ? "선택된 시간 없음" : selectedSlots.map((s) => s.time).join(", ");

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
            <li>30분 단위로 예약할 수 있습니다.</li>
            <li>현재 시간 기준 한 달 앞까지 예약 가능합니다.</li>
            <li>여러 시간 슬롯을 한 번에 선택하여 예약할 수 있습니다.</li>
            <li>예약 취소는 예약 시 만든 취소 비밀번호로 가능합니다.</li>
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
          시간 선택 <small>(여러 시간 선택 가능)</small>
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
          <span className="selectedCount">{selectedSlots.length}개 선택</span>
          <strong>{selectedLabel}</strong>
        </div>
        <button type="button" onClick={onReserveSelected} disabled={selectedSlots.length === 0}>
          선택한 시간 예약하기
        </button>
      </div>
    </section>
  );
}
