import styles from "../Game.module.css";
import { elementNames } from "../data/elements";

export default function ElementSlider({
  page,
  totalPages,
  pagedElements,
  goPrev,
  goNext,
  goToPage,
  onElementClick,
  showArrows,
  setShowArrows,
}) {
  return (
    <section
      className={styles.sliderSection}
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      {showArrows && (
        <div className={styles.sliderControls}>
          <button className={styles.sliderArrow} onClick={goPrev}>
            {"\u276E"}
          </button>
          <button className={styles.sliderArrow} onClick={goNext}>
            {"\u276F"}
          </button>
        </div>
      )}

      <div className={styles.sliderContainer}>
        {pagedElements.map(({ symbol, color }, index) => (
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

      <div className={styles.pageIndicator}>
        {Array.from({ length: totalPages }).map((_, i) => (
          <span
            key={i}
            className={`${styles.dot} ${i === page ? styles.activeDot : ""}`}
            onClick={() => goToPage(i)} 
      style={{ cursor: "pointer" }}
          >
            ●
          </span>
        ))}
      </div>
    </section>
  );
}