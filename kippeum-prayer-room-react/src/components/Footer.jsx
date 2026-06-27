import logoImage from "../assets/kippeum-church-logo.svg";
import { Church } from "lucide-react";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footerBrand">
        <img className="brandLogo" src={logoImage} alt="기쁨교회 로고" />
        <div>
          <strong>기쁨교회</strong>
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
  );
}
