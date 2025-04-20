import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import styles from "./Multiplay.module.css";
import MixArea from "../Game/components/MixArea";
import ElementSlider from "../Game/components/ElementSlider";
import { coloredElements } from "../../data/elements";
import { levels } from "../../data/levels";
import { loadState } from "../../utils/storage";
import trash from "../../Asset/trash.svg";
import { FaRedo, FaUndo } from "react-icons/fa";

// Result Modal Component
const ResultModal = ({ isOpen, result, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.resultText}>
          {result === "win" ? "You WIN!" : "You LOSE!"}
        </h2>
        <button className={styles.homeButton} onClick={() => navigate("/")}>
          홈화면 돌아가기
        </button>
      </div>
    </div>
  );
};

export default function Multiplay() {
  const [selectedElements, setSelectedElements] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [page, setPage] = useState(0);
  const [showArrows, setShowArrows] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30초 타이머 설정
  const [isActive, setIsActive] = useState(true); // 게임 시작 시 타이머 활성화
  const [showResultModal, setShowResultModal] = useState(false);
  const [gameResult, setGameResult] = useState(null); // "win" or "lose"

  const trashRef = useRef(null);
  const elementRefs = useRef({});
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const itemsPerPage = 6;
  const totalPages = Math.ceil(coloredElements.length / itemsPerPage);
  const levelIndex = loadState("level") ?? 0;
  const pagedElements = coloredElements.filter((el) =>
    levels.slice(levelIndex, levelIndex + 5).includes(el.symbol)
  );

  // 타이머 기능 구현
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // 타이머가 0이 되면 게임 종료 처리
      handleTimerEnd();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleTimerEnd = () => {
    // 타이머 종료 시 실행할 로직
    setIsActive(false);

    // 임시로 점수를 계산하여 승패 결정 (실제로는 상대방과 비교 로직이 필요)
    // 여기서는 예시로 selectedElements의 개수가 5개 이상이면 승리로 가정
    const isWinner = selectedElements.length >= 5;
    setGameResult(isWinner ? "win" : "lose");
    setShowResultModal(true);

    console.log("시간 종료!");
  };

  const resetTimer = () => {
    setTimeLeft(30);
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resumeTimer = () => {
    setIsActive(true);
  };

  const handleElementAdd = (el) => {
    const centerX = 150 + Math.random() * 200;
    const centerY = 100 + Math.random() * 200;

    setSelectedElements((prev) => [
      ...prev,
      { ...el, x: centerX, y: centerY, animate: true },
    ]);

    setUndoStack([]);
  };

  const handleUndo = () => {
    if (selectedElements.length === 0) return;
    const updated = [...selectedElements];
    const popped = updated.pop();
    setSelectedElements(updated);
    setUndoStack((prev) => [...prev, popped]);
  };

  const handleRedo = () => {
    if (undoStack.length === 0) return;
    const restored = [...undoStack];
    const recovered = restored.pop();
    setSelectedElements((prev) => [...prev, recovered]);
    setUndoStack(restored);
  };

  const handleReset = () => {
    setSelectedElements([]);
    setUndoStack([]);
  };

  const goPrev = () => {
    setPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const goNext = () => {
    setPage((prev) => (prev + 1) % totalPages);
  };

  const goToPage = (pageIndex) => {
    setPage(pageIndex);
  };

  // 타이머 텍스트 색상 설정 - 10초 미만일 때 빨간색으로 변경
  const getTimerColor = () => {
    return timeLeft <= 10 ? "#ff3b30" : "white";
  };

  return (
    <div className={styles.container}>
      <div className={styles.player1}>
        <h3>플레이어 1</h3>
        <div className={styles.player1Container}></div>
        {/* 향후 상대방의 조합 표시 */}
      </div>

      <div className={styles.timerBar}>
        <span style={{ color: getTimerColor() }}>{timeLeft}초</span>
      </div>

      <div className={styles.player2}>
        <h3>플레이어 2 (나)</h3>
        <div className={styles.playAreaContainer}>
          <MixArea
            selectedElements={selectedElements}
            setSelectedElements={setSelectedElements}
            elementRefs={elementRefs}
            trashRef={trashRef}
            undoStack={undoStack}
            setUndoStack={setUndoStack}
          />

          <div className={styles.controls}>
            <button className={styles.arrowBtn} onClick={handleUndo}>
              <FaUndo size={20} />
            </button>
            <img
              ref={trashRef}
              src={trash}
              alt="쓰레기통"
              className={styles.trashBtn}
              onClick={handleReset}
            />
            <button className={styles.arrowBtn} onClick={handleRedo}>
              <FaRedo size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.sliderSection}>
        <ElementSlider
          page={page}
          totalPages={totalPages}
          pagedElements={pagedElements}
          goPrev={goPrev}
          goNext={goNext}
          goToPage={goToPage}
          onElementClick={(el) => handleElementAdd(el)}
          showArrows={showArrows}
          setShowArrows={setShowArrows}
        />
      </div>

      {/* 결과 모달 */}
      <ResultModal
        isOpen={showResultModal}
        result={gameResult}
        onClose={() => setShowResultModal(false)}
      />
    </div>
  );
}
