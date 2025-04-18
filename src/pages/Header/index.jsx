import styles from "./Header.module.css";
import home from "../../Asset/home.svg";
import trophy from "../../Asset/trophy.svg";
import medal from "../../Asset/medal.svg";
import back from "../../Asset/left_arrow.svg";
import mini_logo from "../../Asset/mini_logo.svg";

import { useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();

    return(
        <section className={styles.header}>
        <div className={styles.leftButtons}>
          <img
            src={home}
            alt="홈버튼"
            onClick={() => navigate("/")}
            className={styles.homeButton}
          />
          <img
            src={back}
            alt="도감버튼"
            onClick={() => navigate("/game")}
            className={styles.homeButton}
          />
        </div>

        <div className={styles.center}>
          <img src={mini_logo} alt="로고" className={styles.title} />
        </div>

        <div className={styles.rightButtons}>
          <img
            src={medal}
            alt="메달 버튼"
            onClick={() => navigate("/medal")}
            className={styles.headerButton}
          />
          <img
            src={trophy}
            alt="트로피 버튼"
            onClick={() => navigate("/rank")}
            className={styles.headerButton}
          />
        </div>
      </section>
    )
}