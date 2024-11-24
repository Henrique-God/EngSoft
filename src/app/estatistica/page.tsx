"use client"; // Enable client-side rendering

import React from "react";
import { useRouter } from "next/navigation"; // Use next/navigation instead of next/router
import styles from "./CirclesPage.module.css"; // Import CSS for styling
import Image from "next/image"; // Ensure this import is included
import Imovel from "@/src/assets/imovel.png"; // Import property image
import Acao from "@/src/assets/acao.png"; // Import action image
import Case from "@/src/assets/tag_geo.png"; // Import property image
import Graph from "@/src/assets/graph.png"; // Import property image

const CirclesPage = () => {
  const router = useRouter(); // Initialize the router

  // Data for the circles with images and descriptions
  const circles = [
    {
      id: 1,
      label: "Dados de Imóveis por Setor",
      image: Imovel,
      description:
        "Visualização dos imóveis trabalhados e não trabalhados pela equipe de combate à dengue em São José do Rio Preto.",
    },
    {
      id: 2,
      label: "Ações por Setor",
      image: Acao,
      description:
        "Mapa interativo com as ações de combate à dengue por setor censitário em São José de Rio Preto.",
    },
    {
      id: 3,
      label: "Casos por Setor",
      image: Case,
      description:
        "Notificações de casos de dengue em um mapa interativo, dividido pelos setores censitários de São José do Rio Preto.",
    },
    {
      id: 4,
      label: "Análise de Dados por Área",
      image: Graph,
      description:
        "Gráficos e mapas de 2023 e 2022 das notificações por mês em Áreas de São José do Rio Preto, além de dados de ações e imóveis.",
    },
  ];

  const handleCircleClick = (label) => {
    // Navigate based on the clicked circle label
    if (label === "Ações por Setor") {
      router.push("/estatistica/acoes");
    } else if (label === "Dados de Imóveis por Setor") {
      router.push("/estatistica/imoveis");
    } else if (label === "Casos por Setor") {
      router.push("/estatistica/casos");
    } else {
      router.push("/estatistica/casos_por_area");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles["main-content"]}>
        {/* Description Container */}
        <div className={styles["description-container"]}>
          <h1 className={styles.title}>Estatística de São José do Rio Preto</h1>
          <p>
            Esta seção é destinada para análise de dados relacionados ao combate à dengue, com foco na cidade de São José do Rio Preto. Através dessa plataforma, é possível acessar informações detalhadas sobre os casos de dengue, as ações realizadas pela equipe local de combate e os dados sobre os imóveis envolvidos. Além disso, as informações provêm de uma integração com a API Sisaweb, que reúne dados epidemiológicos fornecidos pelo Sistema de Vigilância Epidemiológica da Secretaria de Saúde do Estado de São Paulo (SISAWEB).
          </p>
          <p>
            A análise desses dados é fundamental para a elaboração de estratégias eficazes no controle da dengue. Através dos gráficos e mapas interativos, profissionais de saúde pública, pesquisadores e a população em geral podem entender melhor a distribuição de casos e as ações implementadas nos diferentes setores de São José do Rio Preto. Esse estudo serve não apenas como uma ferramenta de gestão e planejamento, mas também como um modelo para outras cidades no combate a doenças endêmicas. A visualização dos dados de forma clara e acessível é um passo importante na tomada de decisões para proteger a saúde da população.
          </p>
        </div>

        <div className={styles.circleWrapper}>
          <div className={styles.circleContainer}>
            {circles.slice(0, 2).map((circle) => (
              <div key={circle.id} className={styles.circleWithText}>
                <div
                  className={styles.circle}
                  onClick={() => handleCircleClick(circle.label)} // Call the handle function with the label
                >
                  <Image
                    src={circle.image}
                    alt={circle.label}
                    className={styles.circleImage}
                    width={200}
                    height={200}
                    objectFit="cover"
                  />
                </div>
                <span className={styles.circleLabel}>{circle.label}</span>
                <p className={styles.circleDescription}>{circle.description}</p>{" "}
                {/* Display the description */}
              </div>
            ))}
          </div>
          <div className={styles.circleContainer}>
            {circles.slice(2, 4).map((circle) => (
              <div key={circle.id} className={styles.circleWithText}>
                <div
                  className={styles.circle}
                  onClick={() => handleCircleClick(circle.label)} // Call the handle function with the label
                >
                  <Image
                    src={circle.image}
                    alt={circle.label}
                    className={styles.circleImage}
                    width={200}
                    height={200}
                    objectFit="cover"
                  />
                </div>
                <span className={styles.circleLabel}>{circle.label}</span>
                <p className={styles.circleDescription}>{circle.description}</p>{" "}
                {/* Display the description */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CirclesPage;
