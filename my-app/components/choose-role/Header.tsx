import Link from "next/link";
import styles from "./choose-role.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <Link href="/" className={styles.logo}>
          MyTurn
        </Link>

        <Link href="/" className={styles.backButton}>
          ← Back to Home
        </Link>
      </div>
    </header>
  );
}