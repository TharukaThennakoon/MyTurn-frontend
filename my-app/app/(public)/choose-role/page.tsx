import styles from "./page.module.css";


import HeroSection from "@/components/choose-role/HeroSection";
import CitizenCard from "@/components/choose-role/CitizenCard";
import AdminCard from "@/components/choose-role/AdminCard";


export default function ChooseRolePage() {
  return (
    <div className={styles.page}>
      

      <main className={styles.main}>
        <HeroSection />

        <section className={styles.grid}>
          <CitizenCard />
          <AdminCard />
        </section>
      </main>

      
    </div>
  );
}