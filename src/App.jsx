import { Outlet } from "react-router";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
