"use client"; // Enable client-side rendering

import React from 'react';
import dynamic from 'next/dynamic';
import styles from './forum.module.css';

// Dynamically import MapComponent and ImoveisPorArea to ensure they render client-side only
const MapComponentAction = dynamic(() => import('@/src/app/components/MapComponentAction'), { ssr: false });

export default function MapPage() {
  return (
    <div className={styles.container}>
      {/* Property Info and Map Section - Side-by-side */}
      <div className={styles.content}>
        <div className={styles['property-info']}>
          <h2>Ações Realizadas nos Imóveis</h2>
          <p>
            As ações realizadas nos imóveis são parte de um esforço contínuo no combate ao *Aedes aegypti*, o mosquito transmissor da dengue. O foco é eliminar larvas e mosquitos adultos em diferentes tipos de criadouros. Essas ações incluem:
          </p>

          <h3>Tratamento Focal</h3>
          <p>
            Eliminação de larvas nos criadouros com larvicida, aplicado em locais como recipientes de água parada.
          </p>
        

          <h3>Tratamento Perifocal</h3>
          <p>
            Aplicação de adulticida em pontos estratégicos para eliminar mosquitos adultos.
          </p>
      

          <h3>Ação Mecânica</h3>
          <p>
            Eliminação de focos de larvas por remoção de resíduos e materiais acumuladores de água.
          </p>
      

          <h3>Nebulização</h3>
          <p>
            Pulverização de inseticida no ambiente para controlar mosquitos adultos em áreas próximas a casos confirmados.
          </p>
      

          <h3>Ações Alternativas</h3>
          <p>
            Medidas preventivas tomadas pelos proprietários, como eliminar recipientes com água parada e limpar calhas.
          </p>
        </div>

        <div className={styles['map-container']}>
          <MapComponentAction />
        </div>
      </div>
    </div>
  );
}
