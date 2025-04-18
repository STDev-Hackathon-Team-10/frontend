import styles from "./Renderer.module.css";
import KekuleViewer from "./Viewer";

export default function AtomRenderer({ chem = "C1=CC=C(C=C1)C(=O)O" }) {
  return (
    <div className={styles.container}>
      <KekuleViewer chemObj={chem} format="mol" />
    </div>
  );
}
