// src/pages/Game/components/CompoundModal.jsx
import styles from "../Game.module.css";

export default function CompoundModal({ compound, onMove }) {
  if (!compound) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <p className={styles.compoundText}>{compound}</p>
        <p>발견했습니다!</p>
        <button className={styles.moveBtn} onClick={onMove}>
          도감 이동
        </button>
      </div>
    </div>
  );
}
