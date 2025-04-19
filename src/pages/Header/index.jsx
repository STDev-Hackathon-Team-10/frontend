import styles from "./Header.module.css";
import home from "../../Asset/home.svg";
import trophy from "../../Asset/trophy.svg";
import medal from "../../Asset/medal.svg";
import back from "../../Asset/left_arrow.svg";
import mini_logo from "../../Asset/mini_logo.svg";
import { IoStorefront, IoTrophySharp } from "react-icons/io5";
import { FaMedal } from "react-icons/fa";

import { useNavigate } from "react-router";

export default function Header() {
  const navigate = useNavigate();

  return (
    <section className={styles.header}>
      <div className={styles.leftButtons}>
        <IoStorefront
          onClick={() => navigate("/store")}
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
        <FaMedal
          onClick={() => navigate("/medal")}
          className={styles.headerButton}
        />

        <IoTrophySharp
          onClick={() => navigate("/rank")}
          className={styles.headerButton}
        />
      </div>
    </section>
  );
}
