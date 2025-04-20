import styles from "./CompoundModal.module.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function CompoundModal({ compound, onClose, onMove, userId }) {
  const modalRef = useRef();
  const [chemicalData, setChemicalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // 화학식 검색 API 호출
  useEffect(() => {
    if (!compound) return;

    // 문자열인 경우 화학식으로 간주하고 API 호출
    if (typeof compound === 'string') {
      searchChemicalFormula(compound);
    } 
    // 객체이지만 API에서 가져온 데이터가 아닐 경우 (기존 도감 데이터)
    else if (!compound.data && !compound.chemical && !compound.chemicalNameKo) {
      // 분자식이 있으면 검색
      if (compound.molecularFormula) {
        searchChemicalFormula(compound.molecularFormula);
      } else {
        setChemicalData(compound);
      }
    } else {
      // 이미 API에서 가져온 데이터면 그대로 사용
      setChemicalData(compound.data?.chemical || compound.chemical || compound);
    }
  }, [compound]);

  // 화학식 검색 함수
  const searchChemicalFormula = async (formula) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `/chemical/formula/search${userId ? `?userId=${userId}` : ''}`, 
        { formula }
      );
      
      if (response.data && response.data.status === "OK") {
        setChemicalData(response.data.data.chemical);
      } else {
        setError("화학 물질을 찾을 수 없습니다.");
      }
    } catch (err) {
      setError(`검색 중 오류가 발생했습니다: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // compound가 없는 경우 렌더링하지 않음
  if (!compound) return null;

  // API 호출 중일 때 로딩 표시
  if (loading) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal} ref={modalRef}>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
          <div className={styles.modalContent}>
            <div className={styles.loading}>검색 중...</div>
          </div>
        </div>
      </div>
    );
  }

  // 오류 발생 시
  if (error) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal} ref={modalRef}>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
          <div className={styles.modalContent}>
            <div className={styles.error}>{error}</div>
            {typeof compound === 'string' && (
              <div className={styles.formulaDisplayed}>
                <h3>입력한 화학식: {compound}</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // chemicalData가 null인 경우 (아직 로딩 중이거나 데이터를 받아오지 못한 경우)
  if (!chemicalData) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal} ref={modalRef}>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
          <div className={styles.modalContent}>
            <h2>{typeof compound === 'string' ? compound : '화합물 정보'}</h2>
            <p className={styles.description}>화합물 정보를 불러오는 중입니다...</p>
          </div>
        </div>
      </div>
    );
  }

  // chemicalData가 있는 경우 정보 표시
  return (
    <div className={styles.overlay}>
      <div className={styles.modal} ref={modalRef}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        <div className={styles.modalContent}>
          <h2>{chemicalData.chemicalNameKo || chemicalData.name || '이름 없음'}</h2>
          {(chemicalData.chemicalNameEn || chemicalData.nameEn) && (
            <h3 className={styles.englishName}>{chemicalData.chemicalNameEn || chemicalData.nameEn}</h3>
          )}
          
          {(chemicalData.molecularFormula || chemicalData.formula) && (
            <div className={styles.formulaBox}>
              <span className={styles.formulaLabel}>분자식:</span>
              <span className={styles.formulaValue}>{chemicalData.molecularFormula || chemicalData.formula}</span>
            </div>
          )}
          
          {(chemicalData.chemicalDescriptionKo || chemicalData.description) && (
            <div className={styles.descriptionBox}>
              <h4>설명</h4>
              <p className={styles.description}>{chemicalData.chemicalDescriptionKo || chemicalData.description}</p>
            </div>
          )}

          {chemicalData.educationLevel && (
            <div className={styles.levelBox}>
              <span className={styles.levelLabel}>교육 수준:</span>
              <span className={styles.levelValue}>{chemicalData.educationLevel}</span>
            </div>
          )}

          {/* 기존 elements 배열이 있는 경우에만 표시 */}
          {chemicalData.elements && chemicalData.elements.length > 0 && (
            <div className={styles.elementBox}>
              {chemicalData.elements.map((el, idx) => (
                <div key={idx} className={styles.atom}>{el}</div>
              ))}
            </div>
          )}

          {/* 기존 info 배열이 있는 경우에만 표시 */}
          {chemicalData.info && chemicalData.info.length > 0 && (
            <div className={styles.infoBox}>
              {chemicalData.info.map((line, i) => (
                <p key={i} className={styles.info}>{line}</p>
              ))}
            </div>
          )}
          
          {onMove && (
            <button className={styles.moveBtn} onClick={onMove}>
              도감으로 이동
            </button>
          )}
        </div>
      </div>
    </div>
  );
}