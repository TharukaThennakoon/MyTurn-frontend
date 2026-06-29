import LeftBanner from "@/components/auth/LeftBanner";
import styles from "./layout.module.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* LEFT */}
        <div className={styles.left}>
          <LeftBanner />
        </div>

        {/* RIGHT */}
        <div className={styles.right}>
          <div className={styles.rightInner}>
            {children}
          </div>
          <p className={styles.powered}>
            Powered by FuelPass Velocity Framework
          </p>
        </div>
      </div>
    </div>
  );
}