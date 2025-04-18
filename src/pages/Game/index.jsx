import { Link } from "react-router";
import styles from "./Game.module.css";

export default function Game() {
  return (
    <div>
      <h1>Game Page</h1>
      <p>Welcome to the Game page!</p>
      <Link to="/">Return to Home page</Link>
    </div>
  );
}
