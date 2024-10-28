"use client"; 

import Link from "next/link";
import Image, { StaticImageData } from 'next/image';
import React, { Component } from 'react';
import morador from '@/src/assets/morador.jpg';
import fiscal from '@/src/assets/fiscal.jpg';
import admin from '@/src/assets/admin.jpg';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import styles from "./page.module.css";


export default function Role() {
    const searchParams = useSearchParams();
    const role = searchParams.get("role");

    const [pdfFile, setPdfFile] = useState(null);
    const [inputErrors, setInputErrors] = useState({})

    const [formData, setFormData] = useState({
        nomecompleto: "",
        cpf: "",
        logradouro: "",
        bairro: "",
        cidade: "",
        estado: "",
        cep: "",
        email: "",
        telefone: "",
    });
    let roleImg: StaticImageData | undefined;
    if (role === "morador") {
        roleImg = morador;
    } else if (role === "fiscal") {
        roleImg = fiscal;
    } else {
        roleImg = admin;
    }
    
     const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        
        setInputErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
    };

    const handleFileChange = (e: { target: { files: any[]; }; }) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            setPdfFile(file);
            setInputErrors((prevErrors) => ({ ...prevErrors, pdf: false }));
        } else {
            alert("Por favor, selecione um arquivo PDF.");
        }
    };

    const handleValidation = () => {
        const errors = {};
        // Verificar se todos os campos de texto estão preenchidos
        Object.keys(formData).forEach((key) => {
            if (formData[key].trim() === "") {
                errors[key] = true;
            }
        });

        // Verificar se o PDF está presente para fiscal e admin
        if ((role === "fiscal" || role === "admin") && !pdfFile) {
            errors.pdf = true;
        }

        setInputErrors(errors);

        // Retornar verdadeiro se não houver erros
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (handleValidation()) {
            const queryString = new URLSearchParams({ role }).toString();
            window.location.href = `/account/register/success?${queryString}`;
        } else {
            alert("Por favor, preencha todos os campos obrigatórios.");
        }
    };

    


    return (
        <div className={styles.container}>
            <div className={styles.Header}>
                <h1 className={styles.title}>Morador</h1>
                <Image src={roleImg} alt="Morador" className={styles.image} />
            </div>
            
            <form onSubmit={handleSubmit} className={styles.form}>
                {["Nome Completo", "CPF", "Logradouro", "Bairro", "Cidade", "Estado", "CEP", "Email", "Telefone"].map((field, index) => (
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
                
                {(role === "fiscal" || role === "admin") && (
                    <div>
                        <label className={styles.label}>Insira um comprovante de cargo (PDF):</label>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className={`${styles.input} ${inputErrors.pdf ? styles.error : ""}`}
                        />
                    </div>
                )}

                <div className={styles.buttonContainer}>
                    <Link
                        className={styles.backButton} 
                        href="/account/register">Voltar</Link> 
                    <button type="submit" className={styles.nextButton}>Próximo</button>
                </div>
            </form>
        </div>
    );
}