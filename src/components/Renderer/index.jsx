import styles from "./Renderer.module.css";
import KekuleViewer from "./Viewer";

export default function AtomRenderer({
  chem = "Cc1cc(-c2csc(N=C(N)N)n2)cn1C",
}) {
  return (
    <div className={styles.container}>
      <KekuleViewer chemObj={chem} format="mol" />
    </div>
  );
}
