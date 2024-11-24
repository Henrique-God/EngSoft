"use client"; // Enable client-side rendering

import React from 'react';
import dynamic from 'next/dynamic';
import styles from './forum.module.css';

// Dynamically import MapComponent and ImoveisPorArea to ensure they render client-side only
const MapPlot = dynamic(() => import('@/src/app/components/MapPlot'), { ssr: false });

export default function MapPage() {
  return (
    <div className={styles.container}>
      {/* Property Info and Map Section - Side-by-side */}
      <div className={styles.content}>
        <div className={styles['property-info']}>
          <h2>Casos de Dengue em 2022/2023 por Setor Censitário</h2>
          <p>
            O número total de notificações de dengue tem apresentado variações significativas entre os anos de 2022 e 2023. 
            Em 2022, foram registradas <strong>20.352 notificações</strong>, enquanto em 2023 esse número foi reduzido para 
            <strong>9.777 notificações</strong>.
          </p>
          <h3>Meses com Maiores Notificações</h3>
          <p>
            Os meses de maior incidência em 2022 foram abril (<strong>4.920</strong> notificações), maio (<strong>4.475</strong> notificações) 
            e março (<strong>3.276</strong> notificações). Já em 2023, os meses com maior número de notificações foram abril 
            (<strong>1.954</strong> notificações), março (<strong>1.813</strong> notificações) e maio (<strong>1.413</strong> notificações).
          </p>
          <h3>Setores Censitários com Mais Notificações</h3>
          <p>
            O setor censitário com mais notificações foi <strong>354980505001017</strong> (na área SOLO SAGRADO), que registrou:
          </p>
          <ul>
            <li><strong>2022:</strong> 657 notificações</li>
            <li><strong>2023:</strong> 270 notificações</li>
          </ul>
          <p>
            Esses dados são essenciais para direcionar ações de combate ao Aedes aegypti e de prevenção da dengue, 
            priorizando os meses e regiões mais afetados.
          </p>
        </div>

        <div className={styles['map-container']}>
          <MapPlot />
        </div>
      </div>
    </div>
  );
}
