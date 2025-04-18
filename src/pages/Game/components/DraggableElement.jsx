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
}) {
  if (!elementRefs.current[idx]) {
    elementRefs.current[idx] = React.createRef();
  }
  const nodeRef = elementRefs.current[idx];

  // 원소 드래그 할 때 
  const handleStop = (e, data) => {
    const updated = [...selectedElements];
    updated[idx] = {
      ...updated[idx],
      x: data.x,
      y: data.y,
      
    };
    setSelectedElements(updated);
  };

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
