import { CalendarDays, Clock, Lock } from "lucide-react";
import heroImage from "../assets/kippeum-church-hero.png";
import logoImage from "../assets/kippeum-church-logo-original.png";

export function Hero() {
  return (
    <section className="hero" style={{ backgroundImage: `url(${heroImage})` }}>
      <div className="heroOverlay" />
      <header className="topNav">
        <div className="brand" aria-label="기쁨교회">
          <img className="brandLogo" src={logoImage} alt="기쁨교회 로고" />
          <div className="brandText">
            <strong>기쁨교회</strong>
            <span>KIPPEUM CHURCH</span>
          </div>
        </div>
        <button className="adminButton" type="button" aria-label="관리자 메뉴">
          <Lock size={17} />
          관리자
        </button>
      </header>

      <div className="heroText">
        <span className="heroKicker">KIPPEUM PRAYER ROOM</span>
        <h1>
          옥상 기도실
          <br />
          예약 시스템
        </h1>
        <p>
          기도로 하루를 시작하고, 기도로 하루를 마무리하세요.
          <br />
          하나님은 우리의 기도를 들으십니다.
        </p>
        <div className="heroMeta">
          <span>
            <Clock size={19} />30분 단위
          </span>
          <span>
            <CalendarDays size={19} />24시간 예약 가능
          </span>
        </div>
        <span className="heroBlessing">조용한 기도의 자리로 초대합니다</span>
      </div>
    </section>
  );
}
