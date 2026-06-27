import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";
import { CalendarDays, Clock, BookOpen, Lock, Church, X } from "lucide-react";
import "./styles.css";
import heroImage from "./assets/kippeum-church-hero.png";

const SUPABASE_URL = "https://nbwltocexvufetywrecx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_9RA4GOB6JgKTmKI9jXfgZQ_vVjxger3";

const ADMIN_PASSWORD = "1234";
const TABLE_NAME = "prayer_room_reservations";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function pad(n) {
  return String(n).padStart(2, "0");
}

function toDateString(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function todayString() {
  return toDateString(new Date());
}

function maxDateString() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return toDateString(d);
}

function nowMinutes() {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

function timeToMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function generateSlots() {
  const slots = [];
  for (let h = 0; h < 24; h++) {
    slots.push(`${pad(h)}:00`);
    slots.push(`${pad(h)}:30`);
  }
  return slots;
}

function reservationKey(date, time) {
  return `${date}_${time}`;
}

function isPastSlot(date, time) {
  if (date !== todayString()) return false;
  return timeToMinutes(time) <= nowMinutes();
}

function App() {
  const [date, setDate] = useState(todayString());
  const [search, setSearch] = useState("");
  const [reservations, setReservations] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [cancelCode, setCancelCode] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const reservationsByKey = useMemo(() => {
    return Object.fromEntries(reservations.map((r) => [r.reservation_key, r]));
  }, [reservations]);

  const filteredReservations = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reservations
      .filter((r) => !q || r.name.toLowerCase().includes(q))
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [reservations, search]);

  async function loadReservations() {
    setSelectedSlots([]);
    setLoading(true);

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("date", date)
      .order("time", { ascending: true });

    if (error) {
      alert("예약 정보를 불러오지 못했습니다: " + error.message);
      setReservations([]);
    } else {
      setReservations(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadReservations();
  }, [date]);

  function toggleSlot(time) {
    if (date < todayString() || date > maxDateString() || isPastSlot(date, time)) {
      alert("예약 가능한 시간이 아닙니다.");
      return;
    }

    const key = reservationKey(date, time);
    const exists = selectedSlots.some((s) => s.reservation_key === key);

    if (exists) {
      setSelectedSlots((prev) => prev.filter((s) => s.reservation_key !== key));
    } else {
      setSelectedSlots((prev) =>
        [...prev, { date, time, reservation_key: key }].sort((a, b) =>
          a.time.localeCompare(b.time)
        )
      );
    }
  }

  function openReserveModal() {
    if (selectedSlots.length === 0) {
      alert("예약할 시간을 선택해주세요.");
      return;
    }

    setName("");
    setCancelCode("");
    setNote("");
    setModalOpen(true);
  }

  async function saveReservation() {
    if (!name.trim()) return alert("이름을 입력해주세요.");
    if (!cancelCode.trim() || cancelCode.trim().length < 4) {
      return alert("본인 삭제용 비밀번호를 4자리 이상 입력해주세요.");
    }

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
        alert("선택한 시간 중 이미 예약된 시간이 있습니다. 다시 선택해주세요.");
      } else {
        alert("예약 저장 실패: " + error.message);
      }
      setModalOpen(false);
      await loadReservations();
      return;
    }

    alert(`${payloads.length}개 시간이 예약되었습니다.`);
    setModalOpen(false);
    await loadReservations();
  }

  async function deleteReservation(reservation) {
    const password = prompt(
      `${reservation.name}님의 예약을 삭제하려면 예약자 비밀번호 또는 관리자 비밀번호를 입력하세요.`
    );

    if (!password) return;

    if (password !== ADMIN_PASSWORD && password !== reservation.cancel_code) {
      alert("비밀번호가 틀렸습니다.");
      return;
    }

    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq("id", reservation.id);

    if (error) alert("삭제 실패: " + error.message);
    await loadReservations();
  }

  const selectedLabel =
    selectedSlots.length === 0
      ? "선택된 시간 없음"
      : selectedSlots.map((s) => s.time).join(", ");

  return (
    <div className="app">
      <section className="hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="heroOverlay" />
        <header className="topNav">
          <div className="brand">
            <Church size={34} />
            <div>
              <strong>기쁨의교회</strong>
              <span>KIPPEUM CHURCH</span>
            </div>
          </div>
          <button className="adminButton">
            <Lock size={17} />
            관리자
          </button>
        </header>

        <div className="heroText">
          <h1>옥상 기도실<br />예약 시스템</h1>
          <p>기도로 하루를 시작하고, 기도로 하루를 마무리하세요.<br />하나님은 우리의 기도를 들으십니다.</p>
          <div className="heroMeta">
            <span><Clock size={19} />30분 단위</span>
            <span><CalendarDays size={19} />24시간 예약 가능</span>
          </div>
        </div>
      </section>

      <main className="shell">
        <section className="bookingCard">
          <div className="infoBlock">
            <div className="iconCircle"><BookOpen size={24} /></div>
            <div>
              <h2>예약 안내</h2>
              <ul>
                <li>30분 단위로 예약할 수 있습니다.</li>
                <li>현재 시간 기준 한 달 앞까지 예약 가능합니다.</li>
                <li>여러 시간 슬롯을 한 번에 선택하여 예약할 수 있습니다.</li>
                <li>예약 취소는 예약 시 만든 취소 비밀번호로 가능합니다.</li>
              </ul>
            </div>
          </div>

          <div className="divider" />

          <div className="formGrid">
            <label>
              <span>날짜 선택</span>
              <input
                type="date"
                value={date}
                min={todayString()}
                max={maxDateString()}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>

            <label>
              <span>예약자 이름 검색</span>
              <input
                type="text"
                placeholder="이름을 입력하세요"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>

            <button className="primarySmall" onClick={() => setDate(todayString())}>
              오늘 보기
            </button>
          </div>

          <div className="slotHeader">
            <h3>시간 선택 <small>(여러 시간 선택 가능)</small></h3>
            <div className="legend">
              <span><i className="dot availableDot" />예약 가능</span>
              <span><i className="dot selectedDot" />선택됨</span>
              <span><i className="dot disabledDot" />예약 불가</span>
            </div>
          </div>

          <div className="slotGrid">
            {generateSlots().map((time) => {
              const key = reservationKey(date, time);
              const reservation = reservationsByKey[key];
              const past = isPastSlot(date, time);
              const selected = selectedSlots.some((s) => s.reservation_key === key);

              let className = "slot available";
              let label = "예약 가능";

              if (reservation || past) {
                className = "slot disabled";
                label = reservation ? "예약 완료" : "예약 불가";
              } else if (selected) {
                className = "slot selected";
                label = "선택됨";
              }

              return (
                <button
                  key={key}
                  className={className}
                  disabled={Boolean(reservation || past)}
                  onClick={() => toggleSlot(time)}
                >
                  <strong>{time}</strong>
                  <span>{label}</span>
                  {reservation && <em>{reservation.name}</em>}
                </button>
              );
            })}
          </div>

          <div className="selectedBar">
            <div>
              <span className="selectedCount">{selectedSlots.length}개 선택</span>
              <strong>{selectedLabel}</strong>
            </div>
            <button onClick={openReserveModal} disabled={selectedSlots.length === 0}>
              선택한 시간 예약하기
            </button>
          </div>
        </section>

        <aside className="sideCard">
          <div className="iconCircle large"><Lock size={30} /></div>
          <h2>예약 취소</h2>
          <p>예약 시 받은 취소 비밀번호로 본인 예약을 삭제할 수 있습니다.</p>

          <div className="reservationList">
            {loading ? (
              <p>불러오는 중...</p>
            ) : filteredReservations.length === 0 ? (
              <p>이 날짜에는 예약이 없습니다.</p>
            ) : (
              filteredReservations.map((r) => (
                <div className="reservationItem" key={r.id}>
                  <div>
                    <strong>{r.time}</strong>
                    <span>{r.name}</span>
                    {r.note && <small>{r.note}</small>}
                  </div>
                  <button onClick={() => deleteReservation(r)}>삭제</button>
                </div>
              ))
            )}
          </div>
        </aside>
      </main>

      <footer className="footer">
        <div className="footerBrand">
          <Church size={32} />
          <div>
            <strong>기쁨의교회</strong>
            <span>KIPPEUM CHURCH</span>
          </div>
        </div>
        <p>
          너희는 기도할 때에 골방에 들어가 문을 닫고<br />
          은밀한 중에 계신 네 아버지께 기도하라
        </p>
        <span>- 마태복음 6:6</span>
      </footer>

      {modalOpen && (
        <div className="modalBackdrop">
          <div className="modal">
            <button className="modalClose" onClick={() => setModalOpen(false)}>
              <X size={20} />
            </button>
            <h2>선택한 시간 예약하기</h2>

            <label>
              <span>예약 시간</span>
              <textarea readOnly value={selectedSlots.map((s) => `${s.date} ${s.time}`).join("\n")} />
            </label>

            <label>
              <span>이름</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="예: 홍길동" />
            </label>

            <label>
              <span>본인 삭제용 비밀번호</span>
              <input
                type="password"
                value={cancelCode}
                onChange={(e) => setCancelCode(e.target.value)}
                placeholder="4자리 이상"
              />
            </label>

            <label>
              <span>기도제목 / 메모</span>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="선택 입력" />
            </label>

            <div className="modalActions">
              <button onClick={saveReservation}>예약 저장</button>
              <button className="ghost" onClick={() => setModalOpen(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
