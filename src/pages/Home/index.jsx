import { useNavigate } from "react-router";
import styles from "./Home.module.css";
import logo from "../../Asset/logo.svg";
import { useState } from "react";
import { saveState } from "../../utils/storage";
import axios from "axios";

axios.interceptors.response.use(undefined, (err) => {
  return err.response;
});

export default function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  return (
    <div className={styles.container}>
      <div className={styles.logoBox}>
        <img src={logo} alt="logo" className={styles.logoImg} />
        <p>Mix different chemicals and discover new compounds!</p>
      </div>

      <div className={styles.inputBox}>
        <div className={styles.nickname}>
          <input
            placeholder="닉네임을 입력하세요"
            onChange={(e) => {
              setUsername(e.target.value.trim());
            }}
          />
        </div>
        <div className={styles.group}>
          {/* <input placeholder="소속 그룹 (예: Team A" /> */}
        </div>
      </div>

      <div className={styles.startbtnContainer}>
        <button
          className={styles.startbtn}
          onClick={async () => {
            if (username.length < 1) {
              alert("닉네임을 입력하세요.");
              return;
            }
            await axios.post(`${import.meta.env.VITE_API_URL}/user/register`, {
              userName: username,
              groupName: "default",
            });
            let response = await axios.get(
              `${import.meta.env.VITE_API_URL}/user/getIdByUsername/${username}`
            );
            let userId = response.data.data;
            console.log(userId);
            saveState("uid", userId);
            saveState("username", username);
            navigate("/game");
          }}
        >
          Let's Mix !
        </button>
      </div>
    </div>
  );
}
