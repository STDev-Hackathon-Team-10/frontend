import { useNavigate } from "react-router";
import styles from "./Home.module.css";
import logo from "../../Asset/logo.svg";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.logoBox}>
        <img src={logo} alt="logo" className={styles.logoImg} />
        <p>Mix different chemicals and discover new compounds!</p>
      </div>

      <div className={styles.inputBox}>
        <div className={styles.nickname}>
          <input placeholder="닉네임을 입력하세요" />
        </div>
        <div className={styles.group}>
          <input placeholder="소속 그룹 (예: Team A)" />
        </div>
      </div>

      <div className={styles.startbtnContainer}>
        <button className={styles.startbtn} onClick={() => navigate("/game")}>
          Let's Mix !
        </button>
      </div>
    </div>
  );
}
