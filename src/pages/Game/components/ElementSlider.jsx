import styles from "../Game.module.css";
import { elementNames } from "../../../data/elements";

export default function ElementSlider({ elements, onElementClick }) {
  return (
    <section className={styles.sliderSection}>
      <div className={styles.sliderContainer}>
        {elements.map(({ symbol, color }, index) => (
          <div
            key={index}
            className={styles.elementCircle}
            style={{ backgroundColor: color }}
            title={elementNames[symbol] || symbol}
            onClick={() => onElementClick({ symbol, color })}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData(
                "text/plain",
                JSON.stringify({ symbol, color })
              );
            }}
          >
            {symbol}
          </div>
        ))}
      </div>
    </section>
  );
}
