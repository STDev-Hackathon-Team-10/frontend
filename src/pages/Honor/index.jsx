import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import styles from "./Honor.module.css";
import Header from "../Header/index.jsx";
import { levelData } from "../../data/levels.js";

export default function Honor() {
  const [titles, setTitles] = useState([]);

  useEffect(() => {
    setTitles(levelData);
  }, []);

  return (
    <div className={styles.wrapper}>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>도전과제</h1>
        <div className={styles.titleList}>
          {titles.map((title) => (
            <div
              key={title.titleId}
              className={`${styles.titleBox} ${
                !title.isUnlocked ? styles.locked : ""
              } ${title.isActive ? styles.active : ""}`}
            >
              <div className={styles.titleName}>
                {title.titleName}{" "}
                {title.isActive && (
                  <span className={styles.activeTag}>(활성화됨)</span>
                )}
              </div>
              <div className={styles.description}>{title.description}</div>
              {title.isUnlocked && (
                <div className={styles.condition}>
                  🔓 조건: {title.unlockCondition}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
