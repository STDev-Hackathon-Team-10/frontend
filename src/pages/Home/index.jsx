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
  const [playMode, setPlayMode] = useState("");
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

  const handleSingleStart = async () => {
    if (username.length < 1) {
      alert("닉네임을 입력하세요.");
      return;
    }

    if (group.length < 1) {
      alert("소속 그룹을 입력하세요.");
      return;
    }

    await registerUser(username, group);
    navigate("/game");
  };

  const handleMultiStart = async () => {
    if (username.length < 1) {
      alert("닉네임을 입력하세요.");
      return;
    }

    await registerUser(username, null);
    navigate("/game/multiplay");
  };

  // 공통 등록 함수
  const registerUser = async (name, group) => {
    await axios.post(`${import.meta.env.VITE_API_URL}/user/register`, {
      userName: name,
      groupName: group,
    });

    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/user/getIdByUsername/${name}`
    );

    const userId = response.data.data;
    saveState("uid", userId);
    saveState("username", name);
    saveState("group", group);
  };

  return (
    <div className={styles.container}>
      <div className={styles.logoBox}>
        <img src={logo} alt="logo" className={styles.logoImg} />
        <p>Mix different chemicals and discover new compounds!</p>
      </div>

      {/* 플레이 모드 선택 */}
      <div className={styles.startbtnContainer}>
        <button
          onClick={() => setPlayMode("single")}
          className={styles.startbtn}
        >
          🧪 Single Play
        </button>
        <button
          onClick={() => setPlayMode("multi")}
          className={styles.startbtn}
        >
          ⚔️ Multi Play
        </button>
      </div>

      {/* 닉네임/그룹 입력 */}
      {playMode && (
        <div className={styles.inputBox}>
          <div className={styles.nickname}>
            <input
              placeholder="닉네임을 입력하세요"
              onChange={(e) => setUsername(e.target.value.trim())}
              value={username}
            />
          </div>

          {playMode === "single" && (
            <>
              <div className={styles.group}>
                <Autocomplete
                  options={groups}
                  onSelect={(e) => setGroup(e)}
                  onChange={(e) => {
                    setGroup(e);
                  }}
                />
              </div>
              <button className={styles.startbtn} onClick={handleSingleStart}>
                시작하기
              </button>
            </>
          )}

          {playMode === "multi" && (
            <button
              className={styles.startbtn}
              onClick={() => handleMultiStart()}
            >
              시작하기
            </button>
          )}
        </div>
      )}
    </div>
  );
}
