import { useState, useEffect } from "react";
import styles from "./Dictionary.module.css";
import CompoundModal from "./components/CompoudModal.jsx";
import Header from "../Header";
import axios from "axios";
import { loadFoundCompounds } from "../../utils/storage";

export default function Dictionary() {
  const [selectedCompound, setSelectedCompound] = useState(null);
  const [foundCompounds, setFoundCompounds] = useState([]);
  
  // localStorage에서 저장된 화합물 불러오기
  useEffect(() => {
    const compounds = loadFoundCompounds();
    if (compounds && compounds.length > 0) {
      setFoundCompounds(compounds);
    } else {
      // 예시 데이터 (실제 데이터가 없을 경우)
      setFoundCompounds([{
        id: 1,
        name: "H₂O",
        description: "물",
        elements: ["H", "O"],
        info: ["이것은 물이다", "이것은 물이다"],
      }]);
    }
  }, []);

  // 백엔드에서 사용자가 발견한 화합물 목록 가져오기 (선택적)
  const fetchUserCompounds = async () => {
    try {
      const username = localStorage.getItem('username');
      if (!username) return;
      
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/collection/find/all`);
      if (response.data?.data) {
        // 백엔드 데이터와 로컬 데이터 합치기
        const backendCompounds = response.data.data;
        const localCompounds = loadFoundCompounds();
        
        // 중복 제거하여 합치기
        const mergedCompounds = [...localCompounds];
        
        backendCompounds.forEach(compound => {
          if (!mergedCompounds.some(c => c.name === compound.name)) {
            mergedCompounds.push(compound);
          }
        });
        
        setFoundCompounds(mergedCompounds);
      }
    } catch (error) {
      console.error("화합물 목록 가져오기 오류:", error);
    }
  };

  return (
    <div className={styles.container}>
      <Header />

      <section className={styles.body}>
        <h2 className={styles.title}>찾은 혼합물 개수: {foundCompounds.length}</h2>

        <div className={styles.grid}>
          {foundCompounds.map((compound, index) => (
            <div
              key={index}
              className={styles.card}
              onClick={() => setSelectedCompound(compound)}
            >
              <div className={styles.visual}>
                {compound.elements.map((el, idx) => (
                  <div key={idx} className={styles.atom}>
                    {el}
                  </div>
                ))}
              </div>
              <p className={styles.name}>{compound.name}</p>
            </div>
          ))}
          
          {foundCompounds.length === 0 && (
            <div className={styles.noCompounds}>
              아직 발견한 화합물이 없습니다. 게임에서 원소를 조합해보세요!
            </div>
          )}
        </div>
      </section>
      
      {/* 화합물 상세 정보 모달 */}
      {selectedCompound && (
        <CompoundModal
          compound={selectedCompound}
          onClose={() => setSelectedCompound(null)}
        />
      )}
    </div>
  );
}