"use client";

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
import { useEffect, useState } from 'react';

// Base links (static)
const baseLinks = [
  { name: 'Home', href: '/home', icon: HomeIcon },
  { name: 'Wiki', href: '/wiki', icon: DocumentDuplicateIcon },
  { name: 'Forum', href: '/forum', icon: UserGroupIcon },
  { name: 'Estatística', href: '/estatistica', icon: ChartBarIcon },
];

export default function NavLinks() {
  const [dynamicLinks, setDynamicLinks] = useState(baseLinks);

  useEffect(() => {
    const fetchUserData = () => {
      // Ensure we're on the client side
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("token");
      const decodedToken = token ? decodeToken(token) : null;

      if (decodedToken) {
        const additionalLinks = [];
        if (decodedToken.role === "admin") {
          additionalLinks.push({
            name: 'Admin',
            href: '/admin',
            icon: Cog6ToothIcon,
          });
        }
        if (decodedToken.role !== "morador") {
          additionalLinks.push({
            name: 'Write Wiki',
            href: '/page/newPage',
            icon: PencilSquareIcon,
          });
        }

        // Update links
        setDynamicLinks((prevLinks) => [...prevLinks, ...additionalLinks]);
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      {dynamicLinks.map((link) => {
        const LinkIcon = link.icon;
        return (
          <a
            key={link.name}
            href={link.href}
            className={styles.navLink}
          >
            <LinkIcon className={styles.iconSmall} />
            <span>{link.name}</span>
          </a>
        );
      })}
    </>
  );
}
