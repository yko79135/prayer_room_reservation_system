import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase, TABLE_NAME } from "../lib/supabase";

export const ADMIN_PASSWORD = "cnfdornqrl4034";

export function pad(n) {
  return String(n).padStart(2, "0");
}

export function toDateString(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function todayString() {
  return toDateString(new Date());
}

export function maxDateString() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return toDateString(d);
}

function nowMinutes() {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

export function timeToMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function generateSlots() {
  const slots = [];
  for (let h = 0; h < 24; h++) {
    slots.push(`${pad(h)}:00`);
    slots.push(`${pad(h)}:30`);
  }
  return slots;
}

export function reservationKey(date, time) {
  return `${date}_${time}`;
}

export function normalizeName(name = "") {
  return name.trim();
}

export function isPastSlot(date, time) {
  if (date !== todayString()) return false;
  return timeToMinutes(time) <= nowMinutes();
}

export function useReservations(date, notify = () => {}) {
  const [reservations, setReservations] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const reservationsByKey = useMemo(() => {
    return Object.fromEntries(reservations.map((r) => [r.reservation_key, r]));
  }, [reservations]);

  const loadReservations = useCallback(async () => {
    setSelectedSlots([]);
    setLoading(true);

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("date", date)
      .order("time", { ascending: true });

    if (error) {
      notify("예약 정보를 불러오지 못했습니다: " + error.message);
      setReservations([]);
    } else {
      setReservations(data || []);
    }

    setLoading(false);
  }, [date]);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  function toggleSlot(time) {
    if (date < todayString() || date > maxDateString() || isPastSlot(date, time)) {
      notify("예약 가능한 시간이 아닙니다.");
      return;
    }

    const key = reservationKey(date, time);

    setSelectedSlots((prev) => {
      const exists = prev.some((s) => s.reservation_key === key);

      if (exists) {
        return prev.filter((s) => s.reservation_key !== key);
      }

      return [...prev, { date, time, reservation_key: key }].sort((a, b) =>
        a.time.localeCompare(b.time)
      );
    });
  }

  async function saveReservation({ name, cancelCode, note }) {
    const payloads = selectedSlots.map((slot) => ({
      reservation_key: slot.reservation_key,
      date: slot.date,
      time: slot.time,
      name: name.trim(),
      cancel_code: cancelCode.trim(),
      note: note.trim()
    }));

    const { error } = await supabase.from(TABLE_NAME).insert(payloads);

    if (error) {
      if (error.message.includes("duplicate") || error.code === "23505") {
        notify("선택한 시간 중 이미 예약된 시간이 있습니다. 다시 선택해주세요.");
      } else {
        notify("예약 저장에 실패했습니다: " + error.message);
      }
      await loadReservations();
      return false;
    }

    notify(`${payloads.length}개 시간이 예약되었습니다.`);
    await loadReservations();
    return true;
  }

  async function deleteReservation(reservation, { isAdminMode = false, password = "" } = {}) {
    if (!isAdminMode && password !== ADMIN_PASSWORD && password !== reservation.cancel_code) {
      notify("비밀번호가 틀렸습니다.");
      return false;
    }

    const { error } = await supabase.from(TABLE_NAME).delete().eq("id", reservation.id);

    if (error) {
      notify("삭제 실패: " + error.message);
      return false;
    }

    notify("선택한 예약이 취소되었습니다.");
    await loadReservations();
    return true;
  }

  async function deleteReservationsByIds(ids, { successMessage } = {}) {
    if (!Array.isArray(ids) || ids.length === 0) {
      notify("취소할 예약을 선택해주세요.");
      return false;
    }

    const { error } = await supabase.from(TABLE_NAME).delete().in("id", ids);

    if (error) {
      notify("삭제 실패: " + error.message);
      return false;
    }

    if (successMessage) notify(successMessage);
    await loadReservations();
    return true;
  }

  return {
    reservations,
    reservationsByKey,
    selectedSlots,
    loading,
    toggleSlot,
    saveReservation,
    deleteReservation,
    deleteReservationsByIds
  };
}
