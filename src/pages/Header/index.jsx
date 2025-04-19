import styles from "./Header.module.css";
import mini_logo from "../../Asset/mini_logo.svg";
import { IoStorefront, IoTrophySharp } from "react-icons/io5";
import { FaMedal } from "react-icons/fa";
import { HiArrowUturnLeft } from "react-icons/hi2";

import { useNavigate } from "react-router";

export default function Header() {
  const navigate = useNavigate();

  return (
    <section className={styles.header}>
      <div className={styles.leftButtons}>
        <IoStorefront
          onClick={() => navigate("/store")}
          className={styles.headerButton}
        />

        <HiArrowUturnLeft
          onClick={() => navigate("/game")}
          className={styles.headerButton}
        />
      </div>

      <div className={styles.center}>
        <img src={mini_logo} alt="로고" className={styles.title} />
      </div>

      <div className={styles.rightButtons}>
        <FaMedal
          onClick={() => navigate("/honor")}
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