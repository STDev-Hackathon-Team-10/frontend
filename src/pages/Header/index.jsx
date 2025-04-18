import styles from "./Header.module.css";
import home from "../../Asset/home.svg";
import trophy from "../../Asset/trophy.svg";
import medal from "../../Asset/medal.svg";
import back from "../../Asset/left_arrow.svg";
import mini_logo from "../../Asset/mini_logo.svg";

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
        <div className={styles.tooltipWrapper} data-tooltip="게임화면으로 이동">
          <img
            src={back}
            alt="게임버튼"
            onClick={() => navigate("/game")}
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
            alt="메달 버튼"
            onClick={() => navigate("/medal")}
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
