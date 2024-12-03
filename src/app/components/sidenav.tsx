// src/app/components/SideNav.tsx

import NavLinks from '@/src/app/components/navlinks';
import styles from './SideNav.module.css';

export default function SideNav() {
  return (
    <div className={styles.sideNavContainer}>
      <div className={styles.navContentWrapper}>
        <NavLinks />
        <div className={styles.placeholder}></div>
      </div>
    </div>
  );
}
