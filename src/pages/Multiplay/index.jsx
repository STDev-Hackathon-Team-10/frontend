import React, { useState, useRef, useEffect } from "react";
import styles from "./Multiplay.module.css";
import MixArea from "../Game/components/MixArea";
import ElementSlider from "../Game/components/ElementSlider";
import { coloredElements } from "../../data/elements";
import { levels } from "../../data/levels";
import { loadState } from "../../utils/storage";
import trash from "../../Asset/trash.svg";
import { FaRedo, FaUndo } from "react-icons/fa";

export default function Multiplay() {
  const [selectedElements, setSelectedElements] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [page, setPage] = useState(0);
  const [showArrows, setShowArrows] = useState(false);
  const trashRef = useRef(null);
  const elementRefs = useRef({});

  const itemsPerPage = 6;
  const totalPages = Math.ceil(coloredElements.length / itemsPerPage);
  const levelIndex = loadState("level") ?? 0;
  const pagedElements = coloredElements.filter((el) =>
    levels.slice(levelIndex, levelIndex + 5).includes(el.symbol)
  );

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

  return (
    <div className={styles.container}>
      <div className={styles.player1}>
        <h3>플레이어 1</h3>
        <div className={styles.player1Container}></div>
        {/* 향후 상대방의 조합 표시 */}
      </div>

      <div className={styles.timerBar}>
        0초
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
    </div>
  );
}