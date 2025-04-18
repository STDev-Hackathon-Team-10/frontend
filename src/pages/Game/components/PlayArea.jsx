// src/pages/Game/components/PlayArea.jsx
import styles from "../Game.module.css";
import React from "react";
import DraggableElement from "./DraggableElement";

export default function PlayArea({
  selectedElements,
  setSelectedElements,
  elementRefs,
  trashRef,
  undoStack,
  setUndoStack,
}) {


  return (
    <div
      className={styles.selectedArea}
      id="playArea"
      onDragOver={(e) => e.preventDefault()}
      // onDrop={handleDrop}
    >
      {selectedElements.map((el, idx) => (
        <DraggableElement
          key={idx}
          el={el}
          idx={idx}
          elementRefs={elementRefs}
          selectedElements={selectedElements}
          setSelectedElements={setSelectedElements}

          trashRef={trashRef}
          undoStack={undoStack}
          setUndoStack={setUndoStack}
        />
      ))}
    </div>
  );
}