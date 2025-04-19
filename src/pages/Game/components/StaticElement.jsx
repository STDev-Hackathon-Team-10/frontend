// src/pages/Game/components/DraggableElement.jsx
import React from "react";
import styles from "../Game.module.css";
import { useEffect } from "react";

export default function StaticElement({
  battle = false,
  el,
  idx,
  elementRefs,
  setSelectedElements,
  count,
  setUndoStack,
}) {
  if (!battle) {
    if (!elementRefs.current[el.symbol]) {
      elementRefs.current[el.symbol] = React.createRef();
    }
  }
  const nodeRef = elementRefs?.current?.[el.symbol];

  // 원소 물방울 효과
  useEffect(() => {
    if (el.animate && !battle) {
      const timer = setTimeout(() => {
        setSelectedElements((prev) => {
          const newElements = [...prev];
          const element = newElements[idx];
          const newElement = { ...element, animate: false };
          newElements[idx] = newElement;
          return newElements;
        });
      }, 400); // slimeEffect와 동일한 시간

      return () => clearTimeout(timer);
    }
  }, [el.animate]);

  return (
    <div
      ref={nodeRef}
      className={`${styles.elementCircle} ${
        el.animate ? styles.slimeEffect : ""
      }`}
      style={{ backgroundColor: el.color }}
      onAnimationEnd={() => {
        el.animate = false;
      }}
      onClick={() => {
        setSelectedElements((prev) => {
          // remove clicked element
          const newElements = [...prev];
          const index = newElements.findIndex(
            (item) => item.symbol === el.symbol
          );
          if (index !== -1) {
            newElements.splice(index, 1);
          }
          return newElements;
        });
        setUndoStack((prev) => [...prev, { action: "remove", element: el }]);
      }}
    >
      {el.symbol}
      {count > 1 && <div className={styles.countBadge}>{count}</div>}
    </div>
  );
}
