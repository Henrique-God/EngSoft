"use client"; // Enable client-side rendering

import React from 'react';
import dynamic from 'next/dynamic';
import styles from './forum.module.css';

// Dynamically import MapComponent to ensure it renders client-side only
const MapComponentAction = dynamic(() => import('@/src/app/components/MapComponentAction'), { ssr: false });

export default function MapPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Mapa de Dengue</h1>
      <p>Aqui você pode visualizar as áreas afetadas pela dengue através de um mapa interativo.</p>
      <div className={styles['map-container']}>
        <MapComponentAction />
      </div>
    </div>
  );
}
