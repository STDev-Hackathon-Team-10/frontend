import { useNavigate } from "react-router";
import styles from "./Home.module.css";
import logo from "../../Asset/logo.svg";
import { useEffect, useState } from "react";
import { saveState } from "../../utils/storage";
import axios from "axios";
import Autocomplete from "../../components/Autocomplete";

axios.interceptors.response.use(undefined, (err) => {
  return err.response;
});

export default function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [group, setGroup] = useState("");
  const [groups, setGroups] = useState([]);

  const fetchGroups = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/group/find/all`
    );
    const data = response.data.data;
    const groupNames = data.map((group) => group.groupName);
    setGroups(groupNames);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const start = async () => {
    if (username.length < 1) {
      alert("닉네임을 입력하세요.");
      throw new Error("닉네임을 입력하세요.");
    }
    if (group.length < 1) {
      alert("소속 그룹을 입력하세요.");
      throw new Error("소속 그룹을 입력하세요.");
    }
    await axios.post(`${import.meta.env.VITE_API_URL}/user/register`, {
      userName: username,
      groupName: group,
    });
    let response = await axios.get(
      `${import.meta.env.VITE_API_URL}/user/getIdByUsername/${username}`
    );
    let userId = response.data.data;
    saveState("uid", userId);
    saveState("username", username);
    saveState("group", group);
  };

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
          {/* <input
            placeholder="소속 그룹 (예: Team A"
            onChange={(e) => {
              setGroup(e.target.value.trim());
            }}
          /> */}
          <Autocomplete options={groups} onSelect={(e) => setGroup(e)} />
        </div>
      </div>

      <div className={styles.startbtnContainer}>
        <button
          className={styles.startbtn}
          onClick={async () => {
            await start();
            navigate("/game");
          }}
        >
          Let's Mix !
        </button>
      </div>
    </div>
  );
}
