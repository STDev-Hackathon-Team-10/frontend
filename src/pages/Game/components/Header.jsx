import styles from "../../Header/Header.module.css";
import { IoStorefront, IoTrophySharp } from "react-icons/io5";
import { FaMedal, FaBookOpen } from "react-icons/fa";
import mini_logo from "../../../Asset/mini_logo.svg";
import { Link, useNavigate } from "react-router";

export default function Header() {
  const navigate = useNavigate();

  return (
    <section className={styles.header}>
      <div className={styles.leftButtons}>
        <IoStorefront
          onClick={() => navigate("/store")}
          className={styles.headerButton}
        />
        <FaBookOpen
          onClick={() => navigate("/dictionary")}
          className={styles.headerButton}
        />
      </div>

      <Link className={styles.center} to="/">
        <img src={mini_logo} alt="로고" className={styles.title} />
      </Link>

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
