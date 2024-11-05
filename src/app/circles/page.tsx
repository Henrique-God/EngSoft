"use client"; // Enable client-side rendering

import React from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation instead of next/router
import styles from './CirclesPage.module.css'; // Import CSS for styling
import Image from 'next/image'; // Ensure this import is included
import Image1 from '@/src/assets/1.png'; // Correctly import your image
import HeatImage from '@/src/assets/2.png'; // Import other images as needed
import BarImage from '@/src/assets/1.png'; // Import bar image

const CirclesPage = () => {
    const router = useRouter(); // Initialize the router

    // Sample data for the circles with images
    const circles = [
        { id: 1, label: "Mapa de calor", image: Image1 },
        { id: 2, label: "Gráficos", image: HeatImage },
        { id: 3, label: "Índices", image: HeatImage },
        { id: 4, label: "Mapa", image: BarImage },
    ];

    const handleCircleClick = () => {
        // Navigate to the map page
        router.push('/map');
    };

    return (
        <div className={styles.container}>
            <div className={styles['main-content']}> {/* Main content area */}
                <h1 className={styles.title}>Mapas, índices e gráficos</h1>
                <div className={styles.circleContainer}>
                    {circles.map(circle => (
                        <div key={circle.id} className={styles.circleWithText}>
                            <div
                                className={styles.circle}
                                onClick={handleCircleClick} // Call the handle function on click
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
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CirclesPage;
