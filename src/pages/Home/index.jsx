import { Link } from "react-router";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <p>Welcome to the Home page!</p>
      <Link to="/game">Go to game page</Link>
    </div>
  );
}
