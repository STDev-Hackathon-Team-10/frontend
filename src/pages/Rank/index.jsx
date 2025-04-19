import React, { useEffect, useState } from "react";
import styles from "./Rank.module.css";
import Header from "../Header/index.jsx";
import medal1 from "../../Asset/1st_medal.svg";
import medal2 from "../../Asset/2nd_medal.svg";
import medal3 from "../../Asset/3rd_medal.svg";
import axios from "axios";

export default function Rank() {
  const [userRankings, setUserRankings] = useState([]);
  const [organizationRankings, setOrganizationRankings] = useState([]);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/ranking`
        );

        const resData = response.data;
        if (resData.status === "OK") {
          setUserRankings(resData.data.userRankings);
          setOrganizationRankings(resData.data.organizationRankings);
        } else {
          console.error("랭킹 조회 실패:", resData.message);
        }
      } catch (error) {
        console.error("❌ 랭킹 API 요청 에러:", error);
      }
    };

    fetchRankings();
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
      <Header />
      <div className={styles.section}>
        <h2 className={styles.sectionTitle + " " + styles.user}>개인 랭킹</h2>
        <div className={styles.box + " " + styles.userBox}>
          {userRankings.map((user) => (
            <div key={user.userId} className={styles.rankItem}>
              <span className={styles.icon}>{renderRankIcon(user.rank)}</span>
              <span className={styles.name}>{user.username}</span>
              <span className={styles.subInfo}>{user.organization}</span>
              <span className={styles.count}>{user.successCount}회</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle + " " + styles.group}>그룹 랭킹</h2>
        <div className={styles.box + " " + styles.groupBox}>
          {organizationRankings.map((org) => (
            <div key={org.rank} className={styles.rankItem}>
              <span className={styles.icon}>{renderRankIcon(org.rank)}</span>
              <span className={styles.name}>{org.groupName}</span>
              <span className={styles.count}>{org.successCount}회</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
