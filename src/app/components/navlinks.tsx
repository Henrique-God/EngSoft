// src/app/components/navlinks.tsx

import styles from './SideNav.module.css';
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const links = [
  { name: 'Home', href: '/home', icon: HomeIcon },
  { name: 'Wiki', href: '/wiki', icon: DocumentDuplicateIcon },
  { name: 'Forum', href: '/forum', icon: UserGroupIcon },
  { name: 'Estatística', href: '/estatistica', icon: ChartBarIcon },
];

export default function NavLinks() {
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <a
            key={link.name}
            href={link.href}
            className={styles.navLink}
          >
            <LinkIcon className={styles.iconSmall} /> {/* Smaller icon class */}
            <span>{link.name}</span>
          </a>
        );
      })}
    </>
  );
}
