"use client"; // Enable client-side rendering

import React from 'react';
import MapComponent from '@/src/app/components/MapComponent'; // Importing the MapComponent
import { josefinSans } from '@/src/app/fonts/fonts'; // Importing the font
import styles from './forum.module.css'; // Importing the CSS file

export default function MapPage() {
  return (
    <div className={styles.container} style={{ fontFamily: josefinSans.style.fontFamily }}> {/* Applying the font directly */}
      <h1 className={styles.title}>Mapa de Dengue</h1>
      <p>Aqui você pode visualizar as áreas afetadas pela dengue através de um mapa interativo.</p>
      
      {/* Include the MapComponent wrapped in a div with the new class */}
      <div className={styles['map-container']}>
        <MapComponent />
      </div>
    </div>
  );
}
