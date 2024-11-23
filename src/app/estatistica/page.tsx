"use client"; // Enable client-side rendering

import React from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation instead of next/router
import styles from './CirclesPage.module.css'; // Import CSS for styling
import Image from 'next/image'; // Ensure this import is included
import Image1 from '@/src/assets/1.png'; // Correctly import your image
import HeatImage from '@/src/assets/2.png'; // Import other images as needed
import Acao from '@/src/assets/acao.png'; // Import action image
import Imovel from '@/src/assets/imovel.png'; // Import property image

const CirclesPage = () => {
    const router = useRouter(); // Initialize the router

    // Data for the circles with images and descriptions
    const circles = [
        { 
            id: 1, 
            label: "Imóveis", 
            image: Imovel, 
            description: "Visualização dos imóveis trabalhados e não trabalhados pela equipe de combate à dengue em São José do Rio Preto."
        },
        { 
            id: 2, 
            label: "Ações", 
            image: Acao, 
            description: "Informações detalhadas sobre as ações de combate à dengue, como inspeções e fumacê." 
        },
        { 
            id: 3, 
            label: "Casos", 
            image: HeatImage, 
            description: "Dados atualizados sobre o número de casos de dengue na cidade, permitindo o acompanhamento das áreas mais afetadas." 
        },
        { 
            id: 4, 
            label: "Mapa", 
            image: Acao, 
            description: "Mapa interativo destacando as áreas de risco e as zonas mais impactadas pelos casos de dengue." 
        },
    ];

    const handleCircleClick = (label) => {
        // Navigate based on the clicked circle label
        if (label === "Ações") {
            router.push('/estatistica/acoes');
        } else if (label == "Imóveis") {
            router.push('/estatistica/imoveis'); // You can set other conditions based on other labels
        } else {
            router.push('/estatistica/casos');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles['main-content']}> {/* Main content area */}
                <h1 className={styles.title}>Estatística</h1>
                <div className={styles.circleContainer}>
                    {circles.map(circle => (
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
                            <p className={styles.circleDescription}>{circle.description}</p> {/* Display the description */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CirclesPage;
