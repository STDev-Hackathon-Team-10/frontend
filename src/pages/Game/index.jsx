import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { FaRedo, FaUndo } from "react-icons/fa";

import styles from "./Game.module.css";
import Header from "./components/Header";
import ElementSlider from "./components/ElementSlider";
import CompoundModal from "./components/CompoundModal";
import MixArea from "./components/MixArea";

import { coloredElements } from "../../data/elements";
import { levels } from "../../data/levels";
import { loadState } from "../../utils/storage";
import trash from "../../Asset/trash.svg";

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
  // 상태 관리
  const [selectedElements, setSelectedElements] = useState([]);
  const [playerElements, setPlayerElements] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [foundCompound, setFoundCompound] = useState(null);

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
    return;
    if (selectedElements.length > 0) {
      const formula = convertToFormula(selectedElements);
      checkFormula(formula);
    }
  }, [selectedElements]);

  // API 호출로 화학식 검사
  const checkFormula = async (formula) => {
    if (!formula) {
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
        if (response.data.data.success === false) return;
        setFoundCompound(response.data.data.chemical?.chemicalNameKo);
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

  return (
    <div className={styles.container}>
      <Header />

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
          setSelectedElements={setPlayerElements}
          setUndoStack={() => {}}
        />
        <span style={{ borderTop: "2px solid grey" }} />
        <MixArea
          selectedElements={selectedElements}
          setSelectedElements={setSelectedElements}
          setUndoStack={setUndoStack}
        />
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
