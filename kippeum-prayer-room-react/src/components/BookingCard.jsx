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
          <div className="guideSections">
            <section className="guideSection">
              <h4>1. 이용 가능 시간</h4>
              <ul>
                <li>잠근 동산은 오전 6시부터 오후 11시 전까지, 1시간 단위로 예약하여 사용할 수 있습니다.</li>
                <li>오후 11시부터 다음 날 오전 6시까지는 예약이 불가합니다.</li>
                <li>이 시간에 기도하기 원하시는 분은 이창규 목사님의 허락을 받은 후 사용하시기 바랍니다.</li>
              </ul>
            </section>

            <section className="guideSection">
              <h4>2. 예약 시간</h4>
              <ul>
                <li>잠근 동산을 사용하기 위해서는 사용 시간 최소 6시간 전까지 예약을 완료해야 합니다.</li>
                <li>현재 시간을 기준으로 한 달 앞까지 예약할 수 있습니다.</li>
                <li>예약 취소는 예약 시 설정한 취소 비밀번호를 사용하여 가능합니다.</li>
              </ul>
            </section>

            <section className="guideSection">
              <h4>3. 직장 생활을 하지 않는 분</h4>
              <ul>
                <li>현재 직장 생활을 하지 않는 분들은 월요일부터 금요일, 오전 9시부터 오후 6시 사이에 일주일에 최대 2시간 사용할 수 있습니다.</li>
                <li>1시간씩 두 번 나누어 사용하거나, 2시간을 연속하여 사용할 수 있습니다.</li>
              </ul>
            </section>

            <section className="guideSection">
              <h4>4. 직장 생활을 하는 분</h4>
              <ul>
                <li>현재 직장 생활을 하는 분들은 다음 시간대에 일주일에 1시간 사용할 수 있습니다: 새벽 기도 시간(오전 6시~8시), 저녁 시간(오후 6시~11시).</li>
                <li>또한 주말인 토요일과 일요일에 추가로 1시간 사용할 수 있습니다.</li>
                <li>주말에는 필요할 경우 2시간을 연속하여 사용해도 됩니다.</li>
                <li>직장에 다니시는 분이라도 주중에 시간이 되는 경우, 비어 있는 시간에 추가로 예약하여 사용할 수 있습니다. 이 경우에는 일주일 2시간이라는 제한을 적용하지 않습니다.</li>
              </ul>
            </section>

            <section className="guideSection">
              <h4>5. 예약되지 않은 시간의 추가 이용</h4>
              <ul>
                <li>예약 시간 6시간 전까지도 예약되지 않고 비어 있는 시간은 이미 그 주에 2시간 이상 사용한 분이라도 추가로 예약하여 사용할 수 있습니다.</li>
              </ul>
            </section>

            <section className="guideSection">
              <h4>6. 사용 가능 연령</h4>
              <ul>
                <li>잠근 동산은 대학생 이상부터 사용할 수 있습니다.</li>
                <li>고등학생 이하의 경우에도 부모가 잠근 동산을 사용할 때 함께 이용하는 것은 가능합니다.</li>
              </ul>
            </section>

            <section className="guideSection">
              <h4>7. 사용 후 정리</h4>
              <ul>
                <li>잠근 동산을 사용한 후에는 다음에 사용하실 성도님을 위해 사용한 자리를 깨끗하게 정리해 주시기 바랍니다.</li>
              </ul>
            </section>
          </div>
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
