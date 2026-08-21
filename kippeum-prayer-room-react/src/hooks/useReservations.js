import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase, TABLE_NAME } from "../lib/supabase";

export const ADMIN_PASSWORD = "kippeum4034";

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
  for (let h = 6; h < 23; h++) {
    slots.push(`${pad(h)}:00`);
  }
  return slots;
}

export function weekRange(date) {
  const selectedDate = new Date(`${date}T12:00:00`);
  const dayFromMonday = (selectedDate.getDay() + 6) % 7;
  const start = new Date(selectedDate);
  start.setDate(start.getDate() - dayFromMonday);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return { start: toDateString(start), end: toDateString(end) };
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

// One-off full-day closures (specific calendar dates).
export const BLOCKED_DATES = ["2026-08-15", "2026-08-16"];

// Recurring weekly closures, keyed by JS Date#getDay() (0 = Sunday, 5 = Friday).
// Ranges are [start, end) in slot start-times.
const RECURRING_BLOCKS = [
  { day: 5, start: "20:00", end: "22:00" }, // 매주 금요일 오후 8-10시
  { day: 0, start: "09:00", end: "11:00" }, // 매주 일요일 오전 9-11시
  { day: 0, start: "11:00", end: "13:00" } // 매주 일요일 오전 11시-오후 1시
];

export function isBlockedSlot(date, time) {
  if (BLOCKED_DATES.includes(date)) return true;

  const day = new Date(`${date}T12:00:00`).getDay();
  const minutes = timeToMinutes(time);

  return RECURRING_BLOCKS.some(
    (block) => block.day === day && minutes >= timeToMinutes(block.start) && minutes < timeToMinutes(block.end)
  );
}

export function useReservations(date, notify = () => {}, isAdminMode = false) {
  const [reservations, setReservations] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const reservationsByKey = useMemo(() => {
    return Object.fromEntries(reservations.map((r) => [r.reservation_key, r]));
  }, [reservations]);

  const loadReservations = useCallback(async () => {
    setSelectedSlots([]);
    setLoading(true);

    let query = supabase.from(TABLE_NAME).select("*");

    if (isAdminMode) {
      // Admins can review the full reservation history, not just one date.
      query = query.order("date", { ascending: false }).order("time", { ascending: true });
    } else {
      query = query.eq("date", date).order("time", { ascending: true });
    }

    const { data, error } = await query;

    if (error) {
      notify("예약 정보를 불러오지 못했습니다: " + error.message);
      setReservations([]);
    } else {
      setReservations(data || []);
    }

    setLoading(false);
  }, [date, isAdminMode]);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  function toggleSlot(time) {
    if (date < todayString() || date > maxDateString() || isPastSlot(date, time) || isBlockedSlot(date, time)) {
      notify("예약 가능한 시간이 아닙니다.");
      return;
    }

    const key = reservationKey(date, time);

    setSelectedSlots((prev) => {
      const exists = prev.some((s) => s.reservation_key === key);

      if (exists) {
        return prev.filter((s) => s.reservation_key !== key);
      }

      return [{ date, time, reservation_key: key }];
    });
  }

  async function saveReservation({ name, cancelCode }) {
    const normalizedName = normalizeName(name);
    const { start, end } = weekRange(date);
    const { data: weeklyReservations, error: weeklyError } = await supabase
      .from(TABLE_NAME)
      .select("name")
      .gte("date", start)
      .lte("date", end);

    if (weeklyError) {
      notify("주간 예약 내역을 확인하지 못했습니다: " + weeklyError.message);
      return false;
    }

    if ((weeklyReservations || []).some((reservation) => normalizeName(reservation.name) === normalizedName)) {
      notify("기도실은 개인당 일주일에 1시간만 이용할 수 있습니다.");
      return false;
    }

    const payloads = selectedSlots.map((slot) => ({
      reservation_key: slot.reservation_key,
      date: slot.date,
      time: slot.time,
      name: normalizedName,
      cancel_code: cancelCode.trim()
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
