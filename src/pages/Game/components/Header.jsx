import styles from "../../Header/Header.module.css";
import home from "../../../Asset/home.svg";
import trophy from "../../../Asset/trophy.svg";
import medal from "../../../Asset/medal.svg";
import dictionary from "../../../Asset/dictionary.svg";
import mini_logo from "../../../Asset/mini_logo.svg";

import { useNavigate } from "react-router";

export default function Header() {
  const navigate = useNavigate();

  return (
    <section className={styles.header}>
      <div className={styles.leftButtons}>
        <div className={styles.tooltipWrapper} data-tooltip="홈">
          <img
            src={home}
            alt="홈버튼"
            onClick={() => navigate("/")}
            className={styles.homeButton}
          />
        </div>
        <div className={styles.tooltipWrapper} data-tooltip="도감">
          <img
            src={dictionary}
            alt="도감버튼"
            onClick={() => navigate("/dictionary")}
            className={styles.homeButton}
          />
        </div>
      </div>

      <div className={styles.center}>
        <img src={mini_logo} alt="로고" className={styles.title} />
      </div>

      <div className={styles.rightButtons}>
        <div className={styles.tooltipWrapper} data-tooltip="칭호">
          <img
            src={medal}
            alt="칭호 버튼"
            onClick={() => navigate("/honor")}
            className={styles.headerButton}
          />
        </div>
        <div className={styles.tooltipWrapper} data-tooltip="랭킹">
          <img
            src={trophy}
            alt="트로피 버튼"
            onClick={() => navigate("/rank")}
            className={styles.headerButton}
          />
        </div>
      </div>
    </section>
  );
}
