import { Outlet } from "react-router";
import styles from "./App.module.css";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    // window.Kekule = Kekule;
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
