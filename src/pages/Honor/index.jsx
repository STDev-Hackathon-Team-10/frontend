import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import styles from "./Honor.module.css";
import Header from "../Header/index.jsx";

export default function Honor() {
  const [aiTitles, setAiTitles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(1); // Placeholder - replace with actual user ID logic

  // Fetch AI-generated titles for the user
  useEffect(() => {
    const fetchAiTitles = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/title/ai/${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch AI titles');
        }
        
        const data = await response.json();
        setAiTitles(data);
      } catch (err) {
        console.error("Error fetching AI titles:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAiTitles();
  }, [userId]);

  // Handle activating a title
  const handleActivateTitle = async (title) => {
    try {
      const response = await fetch(`/title/ai/${userId}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titleName: title.titleName,
          description: title.description,
          unlockCondition: title.unlockCondition
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to activate title');
      }

      // Update the local state to reflect the change
      setAiTitles(prevTitles => 
        prevTitles.map(t => ({
          ...t,
          isActive: t.titleId === title.titleId
        }))
      );
    } catch (err) {
      console.error("Error activating title:", err);
      setError(err.message);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>AI 생성 칭호</h1>
        <p className={styles.subtitle}>
          당신의 활동을 분석한 AI가 생성한 맞춤형 칭호입니다.
        </p>
        
        {loading && <div className={styles.loading}>칭호 분석 중...</div>}
        {error && <div className={styles.error}>오류가 발생했습니다: {error}</div>}
        
        <div className={styles.titleList}>
          {aiTitles.map((title) => (
            <div
              key={title.titleId}
              className={`${styles.titleBox} ${title.isActive ? styles.active : ""}`}
            >
              <div className={styles.titleName}>
                {title.titleName}{" "}
                {title.isActive && (
                  <span className={styles.activeTag}>(활성화됨)</span>
                )}
              </div>
              <div className={styles.description}>{title.description}</div>
              <div className={styles.condition}>
                🔍 분석: {title.unlockCondition}
              </div>
              {!title.isActive && (
                <button 
                  className={styles.activateButton}
                  onClick={() => handleActivateTitle(title)}
                >
                  활성화하기
                </button>
              )}
            </div>
          ))}
        </div>

        {aiTitles.length === 0 && !loading && (
          <div className={styles.noTitles}>
            <p>현재 생성된 칭호가 없습니다.</p>
            <p>더 많은 활동을 하면 AI가 당신만의 특별한 칭호를 생성해 드립니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}