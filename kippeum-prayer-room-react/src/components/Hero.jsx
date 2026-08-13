import { Lock } from "lucide-react";
import heroImage from "../assets/kippeum-church-hero.png";
import logoImage from "../assets/kippeum-church-logo-original.png";
export function Hero({ isAdminMode, onAdminClick, adminButtonRef }) {

  return (
    <section className="hero" style={{ backgroundImage: `url(${heroImage})` }}>
      <div className="heroOverlay" />
      <header className="topNav">
        <div className="brand" aria-label="기쁨교회">
          <div className="brandLogoWrap">
            <img
              className="brandLogo"
              src={logoImage}
              alt="기쁨교회 로고"
            />
          </div>
          <div className="brandText">
            <strong>기쁨교회</strong>
            <span>KIPPEUM CHURCH</span>
          </div>
        </div>
        <button
          ref={adminButtonRef}
          className={`adminButton${isAdminMode ? " active" : ""}`}
          type="button"
          aria-label={isAdminMode ? "관리자 모드 종료" : "관리자 모드 시작"}
          aria-pressed={isAdminMode}
          onClick={onAdminClick}
        >
          <Lock size={17} />
          {isAdminMode ? "관리자 모드" : "관리자"}
        </button>
      </header>

      <div className="heroText">
        <span className="heroKicker">KIPPEUM PRAYER ROOM</span>
        <h1>옥상 “잠근동산” 예약 시스템</h1>
        <p>
          하나님은 우리의 기도를 들으십니다.
        </p>
        <span className="heroBlessing">조용한 기도의 자리로 초대합니다</span>
      </div>
    </section>
  );
}
