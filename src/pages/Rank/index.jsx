import React, { useEffect, useState } from "react";
import styles from "./Rank.module.css";
import Header from "../Header/index.jsx";
import medal1 from "../../Asset/1st_medal.svg";
import medal2 from "../../Asset/2nd_medal.svg";
import medal3 from "../../Asset/3rd_medal.svg";

export default function Rank() {
  const [userRankings, setUserRankings] = useState([]);
  const [organizationRankings, setOrganizationRankings] = useState([]);

  useEffect(() => {
    // 실제 API 요청 대체용 샘플 데이터
    const sampleData = {
      status: "OK",
      message: "랭킹 조회 성공",
      data: {
        userRankings: [
          { rank: 1, username: "일등이", successCount: 15 },
          { rank: 2, username: "이등이", successCount: 10 },
          { rank: 3, username: "삼등이", successCount: 8 },
        ],
        organizationRankings: [
          { rank: 1, organization: "일등이다", successCount: 25 },
          { rank: 2, organization: "이등이다", successCount: 18 },
          { rank: 3, organization: "삼등이다", successCount: 12 },
        ],
      },
    };

    setUserRankings(sampleData.data.userRankings);
    setOrganizationRankings(sampleData.data.organizationRankings);
  }, []);

  const renderRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <img src={medal1} alt="1st" />;
      case 2:
        return <img src={medal2} alt="2nd" />;
      case 3:
        return <img src={medal3} alt="3rd" />;
      default:
        return `${rank}위`;
    }
  };

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <Header />
      {/* 개인 랭킹 */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle + " " + styles.user}>개인 랭킹</h2>
        <div className={styles.box + " " + styles.userBox}>
          {userRankings.map((user) => (
            <div key={user.rank} className={styles.rankItem}>
              <span className={styles.icon}>{renderRankIcon(user.rank)}</span>
              <span className={styles.name}>{user.username}</span>
            </div>
          ))}
        </div>
      </div>
      {/* 그룹랭킹 */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle + " " + styles.group}>그룹 랭킹</h2>
        <div className={styles.box + " " + styles.groupBox}>
          {organizationRankings.map((org) => (
            <div key={org.rank} className={styles.rankItem}>
              <span className={styles.icon}>{renderRankIcon(org.rank)}</span>
              <span className={styles.name}>{org.organization}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
