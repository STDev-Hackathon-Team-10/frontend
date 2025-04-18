import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import styles from "./Honor.module.css";
import Header from "../Header/index.jsx";

export default function Honor() {
  const [titles, setTitles] = useState([]);

  useEffect(() => {
    // 백엔드에서 받아온 데이터 예시
    const sampleData = {
      status: "OK",
      message: "칭호 목록 조회 성공",
      data: [
        {
          titleId: 1,
          titleName: "첫 발견",
          description: "화학 세계에 첫 발을 내딛은 초보 탐험가",
          unlockCondition: "첫 번째 화학 물질 발견하기",
          isUnlocked: true,
          isActive: false,
        },
        {
          titleId: 2,
          titleName: "물과 불의 연금술사",
          description: "물(H2O)과 관련된 화합물에 특별한 관심을 가진 연구자",
          unlockCondition: "물(H2O)을 포함한 화합물 5개 이상 발견하기",
          isUnlocked: false,
          isActive: false,
        },
        // ... 추가 칭호
      ],
    };

    setTitles(sampleData.data);
  }, []);

  return (
    <div className={styles.wrapper}>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>칭호 목록</h1>
        <div className={styles.titleList}>
          {titles.map((title) => (
            <div
              key={title.titleId}
              className={`${styles.titleBox} ${!title.isUnlocked ? styles.locked : ""} ${title.isActive ? styles.active : ""}`}
            >
              <div className={styles.titleName}>
                {title.titleName} {title.isActive && <span className={styles.activeTag}>(활성화됨)</span>}
              </div>
              <div className={styles.description}>{title.description}</div>
              {title.isUnlocked && (
                <div className={styles.condition}>🔓 조건: {title.unlockCondition}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
