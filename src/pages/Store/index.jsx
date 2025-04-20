import { useState } from "react";
import styles from "./Store.module.css";
import Header from "../Header";
import { coloredElements } from "../../data/elements";

export default function Store() {
  const [page, setPage] = useState(0);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(coloredElements.length / itemsPerPage);

  const pagedElements = coloredElements.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  const goPrev = () => {
    setPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const goNext = () => {
    setPage((prev) => (prev + 1) % totalPages);
  };

  return (
    <div className={styles.storeContainer}>
      <Header />

      <section className={styles.sectionBox}>
        <h2 className={styles.sectionTitle}>원소 상점</h2>

        <div className={styles.gridSection}>
          <div className={styles.grid}>
            {pagedElements.map((el) => (
              <div key={el.symbol} className={styles.elementCard}>
                <div
                  className={styles.atom}
                  style={{ backgroundColor: el.color }}
                >
                  {el.symbol}
                </div>
                <button className={styles.buyBtn}>5P</button>
              </div>
            ))}
          </div>

          <div className={styles.pagination}>
            <button onClick={goPrev} className={styles.pageBtn}>
              이전
            </button>
            <span>
              {page + 1} / {totalPages}
            </span>
            <button onClick={goNext} className={styles.pageBtn}>
              다음
            </button>
          </div>
        </div>
      </section>
      <section className={styles.sectionBox}>
        <h2 className={styles.sectionTitle}>도전 과제 힌트</h2>
        <div className={styles.honorBox}>
          <p className={styles.honorComing}>곧 업데이트될 예정입니다...</p>
        </div>
      </section>

      <section className={styles.coinBox}>
        <h3 className={styles.coinTitle}>💰 코인이 부족한가요?</h3>
        <button className={styles.rewardBtn}>광고 보고 5코인 받기</button>
        {/* 또는 출석 보상으로 변경 가능 */}
      </section>
    </div>
  );
}
