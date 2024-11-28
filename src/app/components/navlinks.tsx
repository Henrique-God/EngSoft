// src/app/components/navlinks.tsx
"use client"

import styles from './SideNav.module.css';
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  ChartBarIcon,
  PencilSquareIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import decodeToken from "@/src/app/components/TokenDecoder";
import { useEffect } from 'react';

const links = [
  { name: 'Home', href: '/home', icon: HomeIcon },
  { name: 'Wiki', href: '/wiki', icon: DocumentDuplicateIcon },
  { name: 'Forum', href: '/forum', icon: UserGroupIcon },
  { name: 'Estatística', href: '/estatistica', icon: ChartBarIcon },
];

export default function NavLinks() {
  const token = localStorage.getItem("token")
  const decodedToken = token ? decodeToken(token) : null;
  useEffect(() => {
      const fetchUserData = async () => {
          if (decodedToken) {
              try {
                  if (decodedToken.role === "admin") {
                      links.push({
                          name: 'Admin',
                          href: '/admin',
                          icon: Cog6ToothIcon,
                      });
                  }

                  if (decodedToken.role !== "morador") {
                      links.push({
                          name: 'Write Wiki',
                          href: '/page/newPage',
                          icon: PencilSquareIcon,
                      });
                  }
              } catch (err) {
              }
          } 
      };
      fetchUserData();
  }, [decodedToken]);

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
