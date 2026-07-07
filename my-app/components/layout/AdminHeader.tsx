import styles from "./AdminHeader.module.css";

interface AdminHeaderProps {
  title?: string;
  searchPlaceholder?: string;
}

export default function AdminHeader({ 
  title = "MyTurn Dashboard", 
  searchPlaceholder = "Search tokens..." 
}: AdminHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.title}>{title}</div>
      
      <div className={styles.rightSection}>
        <div className={styles.searchBox}>
          <svg className={styles.searchIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder={searchPlaceholder} className={styles.searchInput} />
        </div>

        <div className={styles.headerActions}>
          <button className={styles.iconBtn}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <button className={styles.iconBtn}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button className={`${styles.iconBtn} ${styles.iconBtnRed}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.2 9H21L15.3 13.5L17.5 21L12 16.5L6.5 21L8.7 13.5L3 9H9.8L12 2Z" />
            </svg>
          </button>
          
          <div className={styles.avatar}>
            <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="15" r="7" fill="#94a3b8"/>
              <path d="M7 36C7 28.8203 12.8203 23 20 23C27.1797 23 33 28.8203 33 36V40H7V36Z" fill="#94a3b8"/>
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}
