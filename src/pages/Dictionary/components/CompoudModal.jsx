import styles from "./CompoundModal.module.css";
import { useEffect, useRef } from "react";

export default function CompoundModal({ compound, onClose }) {
  const modalRef = useRef();

  // 모달 바깥 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!compound) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        <div className={styles.modalContent}>
          <h2>H₂O</h2>
          <p className={styles.description}>물</p>

          <div className={styles.elementBox}>
            {compound.elements.map((el, idx) => (
              <div key={idx} className={styles.atom}>
                {el}
              </div>
            ))}
          </div>

          {compound.info.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
