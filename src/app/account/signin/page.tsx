"use client"; 

import Link from "next/link";
import React, { Component } from 'react';
import { useState } from 'react';
import styles from "./page.module.css";
import Image from 'next/image';
import mosquito from "@/src/assets/mosquito.png";
import SideNav from '@/src/app/components/sidenav';
import Header from '@/src/app/components/Header';


export default function Role() {
    const [inputErrors, setInputErrors] = useState({})

    const [formData, setFormData] = useState({
        email: "",
        senha: "",
    });
    
    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        
        setInputErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
    };

    const handleValidation = () => {
        const errors = {};
        // Verificar se todos os campos de texto estão preenchidos
        Object.keys(formData).forEach((key) => {
            if (formData[key].trim() === "") {
                errors[key] = true;
            }
        });

        setInputErrors(errors);

        // Retornar verdadeiro se não houver erros
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (handleValidation()) {
            window.location.href = `/`;
        }
    };

    


    return (
        <div>
            <Header />
            <div style={{ display: 'flex', flexDirection: 'row', width: '100vw' }}>
                <div className="w-full flex-none md:w-40">
                    <SideNav />
                </div>
                <div className={styles.container}>
                    <div className={styles.logo_title_wrapper}>
                        <Image src={mosquito} alt="Mosquito" width={64} height={64} />
                        <h1 className={styles.title}>Tchau Dengue</h1>
                    </div>            
                    <form onSubmit={handleSubmit} className={styles.form}>
                        {["Email", "Senha"].map((field, index) => (
                            <div key={index}  className={styles.inputs}>
                                <label className={styles.label}>{field}:</label>
                                <input
                                    type="text"
                                    name={field.toLowerCase().replace(/ /g, "")}
                                    value={formData[field.toLowerCase().replace(/ /g, "")] || ""}
                                    onChange={handleChange}
                                    className={`${styles.input} ${inputErrors[field.toLowerCase().replace(/ /g, "")] ? styles.error : ""}`}
                                />
                            </div>
                        ))}

                        <div className={styles.buttonContainer}>
                            <Link
                                className={styles.backButton} 
                                href="/">Voltar</Link> 
                            <button type="submit" className={styles.nextButton}>Entrar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}