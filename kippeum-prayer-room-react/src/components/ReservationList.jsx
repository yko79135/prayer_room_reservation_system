import { useEffect, useMemo, useState } from "react";
import { Lock } from "lucide-react";
import { normalizeName } from "../hooks/useReservations";

export function ReservationList({
  date,
  reservations,
  loading,
  isAdminMode,
  onDeleteReservation,
  onDeleteReservationsByIds
}) {
  const [selectionMode, setSelectionMode] = useState(null);
  const [selectableIds, setSelectableIds] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const selectableIdSet = useMemo(() => new Set(selectableIds), [selectableIds]);
  const selectedCount = selectedIds.length;
  const isSelecting = Boolean(selectionMode);

  useEffect(() => {
    clearSelection();
  }, [date, isAdminMode]);

  function clearSelection() {
    setSelectionMode(null);
    setSelectableIds([]);
    setSelectedIds([]);
  }

  function startUserSelection() {
    const name = prompt("예약자 이름을 입력하세요.");
    if (!name) return;

    const password = prompt("예약 취소 비밀번호를 입력하세요.");
    if (!password) return;

    const normalizedName = normalizeName(name);
    const matchingReservations = reservations.filter(
      (reservation) =>
        normalizeName(reservation.name) === normalizedName && reservation.cancel_code === password
    );

    if (matchingReservations.length === 0) {
      alert("이름 또는 취소 비밀번호가 일치하는 예약이 없습니다.");
      return;
    }

    setSelectionMode("user");
    setSelectableIds(matchingReservations.map((reservation) => reservation.id));
    setSelectedIds([]);
  }

  function startAdminSelection() {
    setSelectionMode("admin");
    setSelectableIds(reservations.map((reservation) => reservation.id));
    setSelectedIds([]);
  }

  function toggleReservationSelection(reservation) {
    if (!isSelecting || !selectableIdSet.has(reservation.id)) return;

    setSelectedIds((currentIds) =>
      currentIds.includes(reservation.id)
        ? currentIds.filter((id) => id !== reservation.id)
        : [...currentIds, reservation.id]
    );
  }

  function clearSelectedIds() {
    setSelectedIds([]);
  }

  async function deleteSelectedReservations() {
    if (selectedCount === 0) {
      alert("취소할 예약을 선택해주세요.");
      return;
    }

    if (!confirm(`선택한 예약 ${selectedCount}개를 취소하시겠습니까?`)) {
      return;
    }

    const deletedCount = selectedCount;
    const success = await onDeleteReservationsByIds(selectedIds, {
      successMessage: `선택한 예약 ${deletedCount}개가 취소되었습니다.`
    });

    if (success) clearSelection();
  }

  return (
    <aside className="sideCard" aria-labelledby="reservation-list-title">
      <div className="iconCircle large"><Lock size={30} /></div>
      <h2 id="reservation-list-title">예약 취소</h2>
      <p>
        {isAdminMode
          ? "관리자 모드에서는 비밀번호 없이 예약을 삭제할 수 있습니다."
          : "예약 시 받은 취소 비밀번호로 본인 예약을 삭제할 수 있습니다."}
      </p>

      <div className="reservationToolbar">
        {isAdminMode ? (
          <button type="button" className="secondaryAction" onClick={startAdminSelection} disabled={reservations.length === 0}>
            관리자 선택 삭제
          </button>
        ) : (
          <button type="button" className="secondaryAction" onClick={startUserSelection} disabled={reservations.length === 0}>
            내 예약 선택 취소
          </button>
        )}
      </div>

      {isSelecting && (
        <div className="selectionPanel" aria-live="polite">
          <strong>{selectedCount}개 선택됨</strong>
          <div className="selectionActions">
            <button type="button" className="dangerAction" onClick={deleteSelectedReservations} disabled={selectedCount === 0}>
              선택한 예약 취소
            </button>
            <button type="button" onClick={clearSelectedIds} disabled={selectedCount === 0}>
              선택 취소
            </button>
            <button type="button" onClick={clearSelection}>
              선택 모드 종료
            </button>
          </div>
        </div>
      )}

      <div className="reservationList">
        {loading ? (
          <p className="reservationState loadingState">예약을 불러오는 중입니다...</p>
        ) : reservations.length === 0 ? (
          <p className="reservationState">이 날짜에는 아직 예약이 없습니다.</p>
        ) : (
          reservations.map((r) => {
            const isSelectable = isSelecting && selectableIdSet.has(r.id);
            const isSelected = selectedIds.includes(r.id);
            const isDisabledSelection = isSelecting && !isSelectable;

            return (
              <div
                className={`reservationItem${isSelected ? " selectedForCancel" : ""}${isDisabledSelection ? " disabledForSelection" : ""}${isSelectable ? " selectableForCancel" : ""}`}
                key={r.id}
                role={isSelectable ? "button" : undefined}
                tabIndex={isSelectable ? 0 : undefined}
                aria-pressed={isSelectable ? isSelected : undefined}
                onClick={() => toggleReservationSelection(r)}
                onKeyDown={(event) => {
                  if (isSelectable && (event.key === "Enter" || event.key === " ")) {
                    event.preventDefault();
                    toggleReservationSelection(r);
                  }
                }}
              >
                {isSelecting && (
                  <input
                    className="reservationCheckbox"
                    type="checkbox"
                    checked={isSelected}
                    disabled={!isSelectable}
                    aria-label={`${r.time} ${r.name} 예약 선택`}
                    onChange={() => toggleReservationSelection(r)}
                    onClick={(event) => event.stopPropagation()}
                  />
                )}
                <div className="reservationDetails">
                  <strong>{r.time}</strong>
                  <span>{r.name}</span>
                  {r.note && <small>{r.note}</small>}
                </div>
                {!isSelecting && (
                  <div className="reservationActions">
                    <button
                      type="button"
                      aria-label={`${r.time} ${r.name} 예약만 취소`}
                      onClick={() => onDeleteReservation(r)}
                    >
                      이 예약만 취소
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
