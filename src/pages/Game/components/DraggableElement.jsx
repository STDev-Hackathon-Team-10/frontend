// src/pages/Game/components/DraggableElement.jsx
import React from "react";
import Draggable from "react-draggable";
import styles from "../Game.module.css";
import { useEffect } from "react";

export default function DraggableElement({
  el,
  idx,
  elementRefs,
  selectedElements,
  setSelectedElements,
  trashRef,
  setUndoStack,   

}) {
  if (!elementRefs.current[el.symbol]) {
    elementRefs.current[el.symbol] = React.createRef();
  }
  const nodeRef = elementRefs.current[el.symbol];

  // 원소 드래그 할 때
  const handleStop = (e, data) => {
    const updated = [...selectedElements];

    const trashBox = trashRef?.current?.getBoundingClientRect?.();
    const elementBox = nodeRef?.current?.getBoundingClientRect?.();

    if (trashBox && elementBox) {
      const isOverlapping =
        elementBox.right > trashBox.left &&
        elementBox.left < trashBox.right &&
        elementBox.bottom > trashBox.top &&
        elementBox.top < trashBox.bottom;

      if (isOverlapping) {
        const deleted = updated[idx];
        updated.splice(idx, 1);

        setSelectedElements(updated);
        setUndoStack((prev) => [...prev, deleted]); // 🔥 삭제한 걸 되돌리기용으로 push
        return;
      }
    }

    // 겹치지 않으면 위치 업데이트
    updated[idx] = {
      ...updated[idx],
      x: data.x,
      y: data.y,

    };
    setSelectedElements(updated);
  };

  // 원소 물방울 효과
  useEffect(() => {
    if (el.animate) {
      const timer = setTimeout(() => {
        const updated = [...selectedElements];
        updated[idx] = {
          ...updated[idx],
          animate: false,
        };
        setSelectedElements(updated);
      }, 400); // slimeEffect와 동일한 시간

      return () => clearTimeout(timer);
    }
  }, [el.animate]);
  

  return (
    <Draggable key={idx} nodeRef={nodeRef} onStop={handleStop} bounds="parent">
      <div
        ref={nodeRef}
        className={`${styles.elementCircle} ${
          el.animate ? styles.slimeEffect : ""
        }`}
        style={{ backgroundColor: el.color }}
        onAnimationEnd={() => {
          el.animate = false;
        }}
      >
        {el.symbol}
      </div>
    </Draggable>
  );
}
