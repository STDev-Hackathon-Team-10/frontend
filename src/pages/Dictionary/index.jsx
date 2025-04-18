import { useState } from "react";
import styles from "./Dictionary.module.css";
import CompoundModal from "./components/CompoudModal.jsx";
import Header from "../Header";

export default function Dictionary() {
  const [selectedCompound, setSelectedCompound] = useState(null);
  const [foundCompounds, setFoundCompounds] = useState([
    {
      id: 1,
      name: "H₂O",
      description: "물",
      elements: ["H", "O", "O"],
      info: [
        "이것은 물이다",
        "이것은 물이다",
        "이것은 물이다",
        "이것은 물이다",
        "이것은 물이다",
        "이것은 물이다",
        "이것은 물이다",
        "이것은 물이다",
        "이것은 물이다",
        "이것은 물이다",
        "이것은 물이다",
        "이것은 물이다",
        "이것은 물이다",
        "이것은 물이다",
      ],
    },
    // 추후 백엔드에서 받아온 리스트로 바꾸기
  ]);

  return (
    <div className={styles.container}>
      <Header />

      <section className={styles.body}>
        <h2 className={styles.title}>찾은 혼합물 개수</h2>

        <div className={styles.gridBody}>
          <div className={styles.grid}>
            {Array(20)
              .fill()
              .map((_, index) => {
                const compound = foundCompounds[index % foundCompounds.length];
                return (
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
                );
              })}
          </div>
        </div>
        <br />
        <br />
      </section>
      {/* 모달 삽입 */}
      <CompoundModal
        compound={selectedCompound}
        onClose={() => setSelectedCompound(null)}
      />
    </div>
  );
}
