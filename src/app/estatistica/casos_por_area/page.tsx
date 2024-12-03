"use client"; // Enable client-side rendering

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import styles from "./forum.module.css";

// Dynamically import components to ensure client-side rendering
const DataVisualization = dynamic(() => import("@/src/app/components/Graph"), { ssr: false });
const NotificationRankingChart = dynamic(() => import("@/src/app/components/NotificationRankingChart"), { ssr: false });
const MapArea = dynamic(() => import("@/src/app/components/MapArea"), { ssr: false }); // Dynamically import MapArea
const AcoesPorArea = dynamic(() => import("@/src/app/components/AcoesPorArea"), { ssr: false }); // Dynamically import MapArea
const ImoveisPorArea = dynamic(() => import("@/src/app/components/ImoveisPorArea"), { ssr: false }); // Dynamically import MapArea

// Error Boundary for catching map rendering issues
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Error in MapArea:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong while loading the map.</h2>;
    }
    return this.props.children;
  }
}

export default function MapPage() {
  // State for active tab
  const [activeTab, setActiveTab] = useState("graph");

  // Function to handle tab click
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <Head>
        <title>Dengue Statistics 2022/2023</title>
        <meta
          name="description"
          content="View dengue case statistics and affected areas through interactive maps and visualizations."
        />
      </Head>

      <div className={styles.container}>
        <h1 className={styles.title}>Estatística dos casos de dengue 2022/2023</h1>
        <p>Aqui você pode visualizar as áreas afetadas pela dengue através de um mapa interativo.</p>

        <div className={styles["main-content"]}>
          {/* Description Container */}
          <div className={styles["description-container"]}>
            <h2>São José do Rio Preto</h2>
            <p>
              <strong>Área Territorial:</strong> 431,944 km² [2022]
            </p>
            <p>
              <strong>População residente:</strong> 480.393 pessoas [2022]
            </p>
            <p>
              <strong>Densidade demográfica:</strong> 1.112,17 hab/km² [2022]
            </p>
            <p>
              Para análise dos dados do município, dividiu-se em 29 <a href="/wiki/área">áreas</a> para visualização no gráfico. A área com maior
              quantidade de casos em 2022 foi São Francisco com 2397 notificacoes em 2023 foi Estoril com 1058 notificações. São áreas vizinhas no sudoeste de São José do Rio Preto.
            </p>
          </div>

          {/* Graph Container */}
          <div className={styles["graph-container"]}>
            {/* Tabs container */}
            <div className={styles["tabs-container"]}>
              <div
                className={`${styles.tab} ${activeTab === "graph" ? styles.active : ""}`}
                onClick={() => handleTabClick("graph")}
                role="tab"
                aria-selected={activeTab === "graph"}
              >
                Notificações por Mês
              </div>
              <div
                className={`${styles.tab} ${activeTab === "ranking" ? styles.active : ""}`}
                onClick={() => handleTabClick("ranking")}
                role="tab"
                aria-selected={activeTab === "ranking"}
              >
                Ranking de Áreas
              </div>
              <div
                className={`${styles.tab} ${activeTab === "casos" ? styles.active : ""}`}
                onClick={() => handleTabClick("casos")}
                role="tab"
                aria-selected={activeTab === "casos"}
              >
                Mapa de Casos por Área
              </div>
              <div
                className={`${styles.tab} ${activeTab === "acoes" ? styles.active : ""}`}
                onClick={() => handleTabClick("acoes")}
                role="tab"
                aria-selected={activeTab === "acoes"}
              >
                Mapa de Ações por Área
              </div>
              <div
                className={`${styles.tab} ${activeTab === "imoveis" ? styles.active : ""}`}
                onClick={() => handleTabClick("imoveis")}
                role="tab"
                aria-selected={activeTab === "imoveis"}
              >
                Mapa de Imóveis Trabalhados e Não Trabalhados por Área
              </div>
            </div>

            {/* Tab content */}
            <div className={`${styles["tabs-content"]} ${activeTab === "graph" ? styles.active : ""}`}>
              {activeTab === "graph" && <DataVisualization />}
            </div>

            <div className={`${styles["tabs-content"]} ${activeTab === "ranking" ? styles.active : ""}`}>
              {activeTab === "ranking" && <NotificationRankingChart />}
            </div>

            <div className={`${styles["tabs-content"]} ${activeTab === "casos" ? styles.active : ""}`}>
              {activeTab === "casos" && (
                <ErrorBoundary>
                  <MapArea />
                </ErrorBoundary>
              )}
            </div>
            <div className={`${styles["tabs-content"]} ${activeTab === "acoes" ? styles.active : ""}`}>
              {activeTab === "acoes" && (
                <ErrorBoundary>
                  <AcoesPorArea />
                </ErrorBoundary>
              )}
            </div>
            <div className={`${styles["tabs-content"]} ${activeTab === "imoveis" ? styles.active : ""}`}>
              {activeTab === "imoveis" && (
                <ErrorBoundary>
                  <ImoveisPorArea />
                </ErrorBoundary>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
