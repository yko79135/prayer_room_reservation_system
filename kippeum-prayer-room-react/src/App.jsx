import { useRef, useState } from "react";
import { BookingCard } from "./components/BookingCard";
import { Footer } from "./components/Footer";
import { AdminPasswordModal } from "./components/AdminPasswordModal";
import { Hero } from "./components/Hero";
import { ReservationHistoryTable } from "./components/ReservationHistoryTable";
import { ReservationList } from "./components/ReservationList";
import { ReservationModal } from "./components/ReservationModal";
import { todayString, useReservations } from "./hooks/useReservations";

export function App() {
  const [date, setDate] = useState(todayString());
  const [modalOpen, setModalOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("booking");
  const [toastMessage, setToastMessage] = useState("");
  const adminButtonRef = useRef(null);
  const showHistoryTab = isAdminMode && activeTab === "history";

  const {
    reservations,
    reservationsByKey,
    selectedSlots,
    loading,
    toggleSlot,
    saveReservation,
    deleteReservation,
    deleteReservationsByIds
  } = useReservations(date, showToast, isAdminMode);

  function openReserveModal() {
    if (selectedSlots.length === 0) {
      showToast("예약할 시간을 선택해주세요.");
      return;
    }

    setModalOpen(true);
  }

  function showToast(message) {
    setToastMessage(message);
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => setToastMessage(""), 3200);
  }

  function activateAdminMode() {
    setAdminModalOpen(false);
    adminButtonRef.current?.focus();
    setIsAdminMode(true);
    showToast("관리자 모드가 활성화되었습니다.");
  }

  function handleAdminButtonClick() {
    if (isAdminMode) {
      setIsAdminMode(false);
      setActiveTab("booking");
      showToast("관리자 모드가 종료되었습니다.");
      return;
    }

    setAdminModalOpen(true);
  }

  return (
    <div className="app">
      <Hero isAdminMode={isAdminMode} onAdminClick={handleAdminButtonClick} adminButtonRef={adminButtonRef} />

      <main className={`shell${showHistoryTab ? " shellHistory" : ""}`}>
        {isAdminMode && (
          <div className="adminTabs" role="tablist" aria-label="관리자 메뉴">
            <button
              type="button"
              role="tab"
              aria-selected={!showHistoryTab}
              className={`adminTab${showHistoryTab ? "" : " active"}`}
              onClick={() => setActiveTab("booking")}
            >
              예약 관리
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={showHistoryTab}
              className={`adminTab${showHistoryTab ? " active" : ""}`}
              onClick={() => setActiveTab("history")}
            >
              전체 예약 내역
            </button>
          </div>
        )}

        {showHistoryTab ? (
          <ReservationHistoryTable reservations={reservations} loading={loading} />
        ) : (
          <>
            <BookingCard
              date={date}
              reservationsByKey={reservationsByKey}
              selectedSlots={selectedSlots}
              onDateChange={setDate}
              onToggleSlot={toggleSlot}
              onReserveSelected={openReserveModal}
            />

            <ReservationList
              date={date}
              reservations={reservations}
              loading={loading}
              isAdminMode={isAdminMode}
              onDeleteReservation={deleteReservation}
              onDeleteReservationsByIds={deleteReservationsByIds}
              onNotify={showToast}
            />
          </>
        )}
      </main>

      <Footer />

      {toastMessage && <div className="toastNotice" role="status" aria-live="polite">{toastMessage}</div>}

      <AdminPasswordModal
        open={adminModalOpen}
        onClose={() => { setAdminModalOpen(false); adminButtonRef.current?.focus(); }}
        onSuccess={activateAdminMode}
      />

      {modalOpen && (
        <ReservationModal
          selectedSlots={selectedSlots}
          onClose={() => setModalOpen(false)}
          onSave={saveReservation}
        />
      )}
    </div>
  );
}
