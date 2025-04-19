import React, { useState, useRef, useEffect } from "react";
import styles from "./Game.module.css";
import Header from "./components/Header";
import ElementSlider from "./components/ElementSlider";
import PlayArea from "./components/PlayArea";
import { coloredElements } from "../../data/elements";
import trash from "../../Asset/trash.svg";
import CompoundModal from "./components/CompoundModal";
import { useNavigate } from "react-router";
import MixArea from "./components/MixArea";
import { FaRedo, FaUndo } from "react-icons/fa";
import axios from "axios";
import { levels } from "../../data/levels";
import { loadState } from "../../utils/storage";

const convertToFormula = (elements) => {
  if (!elements || elements.length === 0) {
    return "";
  }

  let formula = "";
  let count = 0;
  let lastSymbol = "";

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];

    if (element.symbol === lastSymbol) {
      count++;
    } else {
      if (lastSymbol !== "") {
        formula += count > 1 ? count : "";
      }
      formula += element.symbol;
      lastSymbol = element.symbol;
      count = 1;
    }

    // 마지막 요소인 경우 남은 count를 formula에 추가
    if (i === elements.length - 1) {
      formula += count > 1 ? count : "";
    }
  }

  return formula;
};

export default function Game() {
  const [selectedElements, setSelectedElements] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [page, setPage] = useState(0);
  const [showArrows, setShowArrows] = useState(false);
  const [foundCompound, setFoundCompound] = useState(null);
  const navigate = useNavigate();
  const MAX_ELEMENTS = 90;
  const trashRef = useRef(null);
  const elementRefs = useRef({});
  const [modalVisible, setModalVisible] = useState(false);
  const [atomIndex, setAtomIndex] = useState(0);

  // 페이징 설정
  const itemsPerPage = 6;
  const totalPages = Math.ceil(coloredElements.length / itemsPerPage);
  const levelIndex = loadState("level") ?? 0;
  const pagedElements = coloredElements.filter((el) =>
    levels.slice(levelIndex, levelIndex + 5).includes(el.symbol)
  );

  useEffect(() => {
    let state = loadState("uid");
    if (!state) {
      navigate("/");
      return;
    }
  }, []);

  // 페이지 이동
  const goPrev = () => {
    setPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const goNext = () => {
    setPage((prev) => (prev + 1) % totalPages);
  };

  // undo/redo
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

  // 쓰레기통 초기화
  const handleReset = () => {
    setSelectedElements([]);
    setUndoStack([]);
  };

  // 클릭하여 원소 추가
  const handleElementAdd = async (el) => {
    const centerX = 150 + Math.random() * 200;
    const centerY = 100 + Math.random() * 200;

    setSelectedElements((prev) => [
      ...prev,
      { ...el, x: centerX, y: centerY, animate: true },
    ]);

    setUndoStack([]);

    // let response = await axios.get(`${import.meta.env.VITE_API_URL}/collection/find/${}`)
  };

  useEffect(() => {
    if (selectedElements.length === 0) return;
    checkFormula(convertToFormula(selectedElements));
  }, [selectedElements]);

  const checkFormula = async (formula) => {
    if (formula.length === 0) {
      setFoundCompound(null);
      return;
    }
    try {
      let username = loadState("username");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/chemical/formula/search`,
        {
          userName: username,
          formula,
        }
      );
      if (response.data?.data) {
        if (response.data?.data?.success === false) return;
        setFoundCompound(response.data.data?.chemical?.chemicalNameKo);
      }
    } catch (e) {
      console.error("Error fetching compound data:", e);
    }
  };

  // 드래그하여 원소 추가
  const handleDrop = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setSelectedElements((prev) => [
      ...prev,
      {
        ...data,
        x,
        y,
        animate: true, // 새 필드
      },
    ]);
  };

  // 슬라이더 버튼 클릭시 이동
  const goToPage = (pageIndex) => {
    setPage(pageIndex);
  };

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <Header />
      {/* 모달 테스트용 */}
      {/* <button onClick={() => setFoundCompound("H₂O")}>모달 테스트 열기</button> */}

      {/* 플레이 화면 */}
      <section
        id="playArea"
        className={styles.playScreen}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
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
        {/* PlayArea를 MixArea로 변경 */}
        {/* <PlayArea
          selectedElements={selectedElements}
          setSelectedElements={setSelectedElements}
          elementRefs={elementRefs}
          trashRef={trashRef}
          undoStack={undoStack}
          setUndoStack={setUndoStack}
        /> */}
        <MixArea
          selectedElements={selectedElements}
          setSelectedElements={setSelectedElements}
          elementRefs={elementRefs}
          trashRef={trashRef}
          undoStack={undoStack}
          setUndoStack={setUndoStack}
          setFoundCompound={setFoundCompound}
          setModalVisible={setModalVisible}
          atomIndex={atomIndex}
        />
      </section>

      {/* 모달 테스트 */}
      <CompoundModal
        compound={foundCompound}
        onMove={() => navigate("/dictionary")}
        onClose={() => {
          setFoundCompound(null);
        }}
      />

      {/* 원소 슬라이더 */}
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
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setAtomIndex={setAtomIndex}
      />
    </div>
  );
}
