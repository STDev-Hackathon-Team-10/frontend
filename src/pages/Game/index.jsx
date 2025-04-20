import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { FaHeart, FaRedo, FaUndo } from "react-icons/fa";

import styles from "./Game.module.css";
import Header from "./components/Header";
import ElementSlider from "./components/ElementSlider";
import CompoundModal from "./components/CompoundModal";
import MixArea from "./components/MixArea";

import { coloredElements } from "../../data/elements";
import { levels } from "../../data/levels";
import { loadState } from "../../utils/storage";
import trash from "../../Asset/trash.svg";
import { io } from "socket.io-client";

// 화학식 변환 유틸리티 함수
const convertToFormula = (elements) => {
  if (!elements?.length) return "";

  let formula = "";
  let count = 1;
  let lastSymbol = elements[0].symbol;

  for (let i = 1; i <= elements.length; i++) {
    const currentSymbol = i < elements.length ? elements[i].symbol : null;

    if (currentSymbol === lastSymbol) {
      count++;
    } else {
      // 원소 기호와 개수 추가
      formula += lastSymbol;
      if (count > 1) formula += count;

      // 다음 원소로 초기화
      lastSymbol = currentSymbol;
      count = 1;
    }
  }

  return formula;
};

export default function Game() {
  const { roomId } = useParams();
  // 상태 관리
  const [selectedElements, setSelectedElements] = useState([]);
  const [playerElements, setPlayerElements] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [foundCompound, setFoundCompound] = useState(null);
  // 배틀 시 찾은 원소들
  const [atoms, setAtoms] = useState([]);

  // 상수 및 참조
  const navigate = useNavigate();
  const trashRef = useRef(null);

  // 레벨 기반 요소 필터링
  const levelIndex = loadState("level") ?? 0;
  const availableLevels = levels.slice(levelIndex, levelIndex + 5);
  const filteredElements = coloredElements.filter((el) =>
    availableLevels.includes(el.symbol)
  );

  // 화학식 검사 및 화합물 찾기
  useEffect(() => {
    const formula = convertToFormula(selectedElements);
    checkFormula(formula, selectedElements);
  }, [selectedElements]);

  // API 호출로 화학식 검사
  const checkFormula = async (formula, elements) => {
    if (roomId && status === "playing" && socketRef.current) {
      socketRef.current.emit("sendFormula", {
        roomId,
        formula,
        elements,
      });
    }
    if (!formula || formula.length < 1) {
      setFoundCompound(null);
      return;
    }

    try {
      const username = loadState("username");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/chemical/formula/search`,
        { userName: username, formula }
      );

      if (response.data?.data) {
        if (response.data.data.success === false && !roomId) return;
        if (!roomId)
          setFoundCompound(response.data.data.chemical?.chemicalNameKo);
        else setAtoms((prev) => [...prev, response.data.data.chemical]);
      }
    } catch (error) {
      console.error("화학식 검색 중 오류 발생:", error);
    }
  };

  // 원소 조작 핸들러
  const handleElementAdd = (element) => {
    // 원소를 무작위 위치에 추가
    const randomX = 150 + Math.random() * 200;
    const randomY = 100 + Math.random() * 200;

    setSelectedElements((prev) => [
      ...prev,
      { ...element, x: randomX, y: randomY, animate: true },
    ]);

    // 새 요소를 추가할 때 되돌리기 스택 초기화
    setUndoStack([]);
  };

  // Undo/Redo 기능
  const handleUndo = () => {
    if (selectedElements.length === 0) return;

    const updated = [...selectedElements];
    const popped = updated.pop();

    setSelectedElements(updated);
    setUndoStack((prev) => [...prev, popped]);
  };

  const handleRedo = () => {
    if (undoStack.length === 0) return;

    const updated = [...undoStack];
    const recovered = updated.pop();

    setSelectedElements((prev) => [...prev, recovered]);
    setUndoStack(updated);
  };

  const handleReset = () => {
    setSelectedElements([]);
    setUndoStack([]);
  };

  // 모달 핸들러
  const handleModalClose = () => {
    setFoundCompound(null);
  };

  const handleDictionaryMove = () => {
    navigate("/dictionary");
  };

  const [time, setTime] = useState(0);
  const [status, setStatus] = useState("ready");
  const [ready, setReady] = useState(false);
  const [users, setUsers] = useState([]);
  const [winner, setWinner] = useState(null);
  const socketRef = useRef(null);
  const username = loadState("username");
  useEffect(() => {
    if (!roomId) return;
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL);
    socketRef.current.emit("joinRoom", roomId, username);
    socketRef.current.on("roomUpdate", (room) => {
      setStatus(room.status);
      setUsers(Object.values(room.players));
    });
    socketRef.current.on("gameStart", () => {
      setSelectedElements([]);
      setPlayerElements([]);
      setUndoStack([]);
      setReady(false);
      setStatus("playing");
    });
    socketRef.current.on("gameEnd", (winner) => {
      setStatus("end");
      setWinner(winner);
    });
    socketRef.current.on("timerUpdate", (seconds) => {
      setTime(seconds);
    });
    socketRef.current.on("receiveFormula", (data) => {
      setPlayerElements((_) => data.elements);
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!roomId) return;
    if (!ready) return;
    if (socketRef.current) {
      socketRef.current.emit("playerReady", roomId);
    }
  }, [ready]);

  return (
    <div className={styles.container}>
      {!roomId && <Header />}
      {roomId && (
        <div className={styles.gameState}>
          {status === "ready" && "대기 중"}
          {status === "playing" && (
            <span className={styles.centerText}>
              <span style={{ fontSize: "15px" }}>
                분자식을 조합하여 상대방과 대결하세요.
              </span>
              <br />
              남은 시간: {time}초
            </span>
          )}
          {status === "end" && (
            <span className={styles.gameState}>게임 종료</span>
          )}
        </div>
      )}

      <section
        id="playArea"
        className={styles.playScreen}
        onDragOver={(e) => e.preventDefault()}
      >
        {/* 제어 버튼 영역 */}
        <div className={styles.topBar}>
          <div className={styles.controls}>
            <div className={styles.arrowBtn} onClick={handleUndo}>
              <FaUndo size={20} />
            </div>
            <img
              ref={trashRef}
              src={trash}
              alt="쓰레기통"
              className={styles.trashBtn}
              onClick={handleReset}
            />
            <div className={styles.arrowBtn} onClick={handleRedo}>
              <FaRedo size={20} />
            </div>
          </div>
        </div>

        {/* 원소 조합 영역 */}
        <MixArea
          selectedElements={playerElements}
          setSelectedElements={() => {}}
          setUndoStack={() => {}}
        >
          <span className={styles.hp}>
            <FaHeart style={{ marginRight: "10px", color: "red" }} />
            {users.find((e) => e.id !== socketRef.current.id)?.hp}
          </span>
        </MixArea>
        <span style={{ borderTop: "2px solid grey" }} />
        <MixArea
          selectedElements={selectedElements}
          setSelectedElements={setSelectedElements}
          setUndoStack={setUndoStack}
        >
          <span className={styles.hp}>
            <FaHeart style={{ marginRight: "10px", color: "red" }} />
            {users.find((e) => e.id === socketRef.current.id)?.hp}
          </span>
        </MixArea>
        {(status === "ready" || status === "end") && (
          <div className={styles.statusContainer}>
            <div className={styles.userStatus}>
              {status === "ready" && (
                <span className={styles.statusText}>
                  {users.length <= 1
                    ? "상대방 기다리는 중..."
                    : users.find((e) => e.id !== socketRef.current.id)?.ready
                    ? "준비 완료"
                    : "준비 중..."}
                </span>
              )}
              {status === "end" && (
                <span>
                  {winner === socketRef.current.id ? (
                    <span
                      className={styles.statusText}
                      style={{
                        color: "green",
                        fontWeight: "bold",
                      }}
                    >
                      승리!
                    </span>
                  ) : (
                    <span
                      className={styles.statusText}
                      style={{
                        color: "red",
                        fontWeight: "bold",
                      }}
                    >
                      패배
                    </span>
                  )}
                </span>
              )}
            </div>
            <div className={styles.userStatus}>
              {status === "ready" && ready && (
                <span className={styles.statusText}>준비 완료</span>
              )}
              {status === "ready" && !ready && (
                <span className={styles.statusText}>
                  <button
                    className={styles.button}
                    onClick={() => setReady(true)}
                  >
                    준비
                  </button>
                </span>
              )}
              {status === "end" && (
                <span className={styles.statusText}>
                  <button
                    className={styles.button}
                    onClick={() => {
                      setReady(true);
                    }}
                  >
                    다시 대결
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </section>

      {/* 화합물 발견 모달 */}
      <CompoundModal
        compound={foundCompound}
        onMove={handleDictionaryMove}
        onClose={handleModalClose}
      />

      {/* 원소 선택 슬라이더 */}
      <ElementSlider
        elements={filteredElements}
        onElementClick={handleElementAdd}
      />
    </div>
  );
}
