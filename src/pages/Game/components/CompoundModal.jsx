// src/pages/Game/components/CompoundModal.jsx
import styles from "../Game.module.css";
import { useEffect, useRef } from "react";

export default function CompoundModal({ compound, onMove, onClose }) {
  if (!compound) return null;

  const modalRef = useRef();

  // 모달 바깥 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose(); // 닫기 함수 호출
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}  ref={modalRef}>
                <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>
        <p className={styles.compoundText}>{compound}</p>
        <p>발견했습니다!</p>
        <button className={styles.moveBtn} onClick={onMove}>
          도감 이동
        </button>
      </div>
    </div>
  );
}
