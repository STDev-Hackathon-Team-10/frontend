import styles from "../Game.module.css";
import StaticElement from "./StaticElement";

export default function MixArea({
  battle = false,
  selectedElements,
  setSelectedElements,
  elementRefs,
  trashRef,
  undoStack,
  setUndoStack,
}) {
  const counts = {};
  selectedElements.forEach((el) => {
    const keyValue = el.symbol;
    counts[keyValue] = (counts[keyValue] || 0) + 1;
  });

  const groupedElements = [];
  let currentObject = null;
  let currentCount = 0;

  for (let i = 0; i < selectedElements.length; i++) {
    const element = selectedElements[i];
    const elementValue = element.symbol;

    if (currentObject && elementValue === currentObject.symbol) {
      currentCount++;
    } else {
      if (currentObject) {
        groupedElements.push({ object: currentObject, count: currentCount });
      }
      currentObject = element;
      currentCount = 1;
    }

    // 마지막 객체 처리
    if (i === selectedElements.length - 1) {
      groupedElements.push({ object: currentObject, count: currentCount });
    }
  }

  return (
    <div className={styles.mixContainer}>
      {groupedElements.map((group, i) => (
        <StaticElement
          key={i}
          battle={battle}
          el={group.object}
          count={group.count}
          setSelectedElements={setSelectedElements}
          selectedElements={selectedElements}
          idx={i}
          elementRefs={elementRefs}
          trashRef={trashRef}
          undoStack={undoStack}
          setUndoStack={setUndoStack}
        />
      ))}
    </div>
  );
}
