import { useState } from "react";
import { BookingCard } from "./components/BookingCard";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { ReservationList } from "./components/ReservationList";
import { ReservationModal } from "./components/ReservationModal";
import { todayString, useReservations } from "./hooks/useReservations";

export function App() {
  const [date, setDate] = useState(todayString());
  const [modalOpen, setModalOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  const {
    reservations,
    reservationsByKey,
    selectedSlots,
    loading,
    toggleSlot,
    saveReservation,
    deleteReservation,
    deleteReservationsByName
  } = useReservations(date);

  function openReserveModal() {
    if (selectedSlots.length === 0) {
      alert("예약할 시간을 선택해주세요.");
      return;
    }

    setModalOpen(true);
  }

  return (
    <div className="app">
      <Hero isAdminMode={isAdminMode} onAdminModeChange={setIsAdminMode} />

      <main className="shell">
        <BookingCard
          date={date}
          reservationsByKey={reservationsByKey}
          selectedSlots={selectedSlots}
          onDateChange={setDate}
          onToggleSlot={toggleSlot}
          onReserveSelected={openReserveModal}
        />

        <ReservationList
          reservations={reservations}
          loading={loading}
          isAdminMode={isAdminMode}
          onDeleteReservation={(reservation) => deleteReservation(reservation, { isAdminMode })}
          onDeleteReservationsByName={(reservation) =>
            deleteReservationsByName(reservation, { isAdminMode })
          }
        />
      </main>

      <Footer />

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
