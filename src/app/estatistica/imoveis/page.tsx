"use client"; // Enable client-side rendering

import React from 'react';
import dynamic from 'next/dynamic';
import styles from './forum.module.css'; // Make sure to style accordingly

// Dynamically import MapComponent and ImoveisPorArea to ensure they render client-side only
const MapComponent = dynamic(() => import('@/src/app/components/MapComponent'), { ssr: false });
const ImoveisPorArea = dynamic(() => import('@/src/app/components/ImoveisPorArea'), { ssr: false });

export default function MapPage() {
  return (
    <div className={styles.container}>

      {/* Property Info and Map Section - Side-by-side */}
      <div className={styles.content}>
        <div className={styles['property-info']}>
          <h2>Imóveis em São José do Rio Preto</h2>
          <p> No mapa, vemos a quantidade de <a href="/wiki/imóvel">imóveis</a> trabalhados e <a href="/wiki/visitas-à-imóveis:-classificação">não trabalhados</a> em alguns setores de São José do Rio Preto. Essas são as classificações dos imóveis quanto à sua situação no momento da visita:</p>          <ul>
            <li>
              <strong> Imóvel Trabalhado:</strong> 
              É todo imóvel no qual foi possível o acesso para realização das ações previstas na atividade em desenvolvimento.
            </li>
            <li>
              <strong> Imóvel Não Trabalhado (Pendente):</strong> 
              São considerados cinco tipos de pendência:
              <ul>
                <li><strong>Fechado:</strong> Imóvel no qual não foi possível o acesso por estar fechado e não se obteve a informação de que está desocupado.</li>
                <li><strong>Desocupado:</strong> Imóvel no qual não foi possível o acesso e se obteve a informação de que está desocupado.</li>
                <li><strong>Temporada:</strong> Imóvel no qual não foi possível o acesso e se obteve a informação de que o imóvel é de temporada.</li>
                <li><strong>Parcial:</strong> Imóvel no qual não foi permitido o acesso a parte do imóvel.</li>
                <li><strong>Recusa:</strong> Imóvel cujo responsável não permitiu o acesso.</li>
              </ul>
            </li>
          </ul>

          <p>Imóveis trabalhados podem ser tratados com alguma ação, caso sejam encontrados focos da larva do mosquito transmissor da dengue.</p>

        </div>

        <div className={styles['map-container']}>
          <MapComponent />
          {/* <ImoveisPorArea /> */}
        </div>
      </div>
    </div>
  );
}
