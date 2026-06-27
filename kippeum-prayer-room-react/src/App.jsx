import { useMemo, useState } from "react";
import { BookingCard } from "./components/BookingCard";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { ReservationList } from "./components/ReservationList";
import { ReservationModal } from "./components/ReservationModal";
import { todayString, useReservations } from "./hooks/useReservations";

export function App() {
  const [date, setDate] = useState(todayString());
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const {
    reservations,
    reservationsByKey,
    selectedSlots,
    loading,
    toggleSlot,
    saveReservation,
    deleteReservation
  } = useReservations(date);

  const filteredReservations = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reservations
      .filter((r) => !q || r.name.toLowerCase().includes(q))
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [reservations, search]);

  function openReserveModal() {
    if (selectedSlots.length === 0) {
      alert("예약할 시간을 선택해주세요.");
      return;
    }

    setModalOpen(true);
  }

  return (
    <div className="app">
      <Hero />

      <main className="shell">
        <BookingCard
          date={date}
          search={search}
          reservationsByKey={reservationsByKey}
          selectedSlots={selectedSlots}
          onDateChange={setDate}
          onSearchChange={setSearch}
          onToggleSlot={toggleSlot}
          onReserveSelected={openReserveModal}
        />

        <ReservationList
          reservations={filteredReservations}
          loading={loading}
          onDeleteReservation={deleteReservation}
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
