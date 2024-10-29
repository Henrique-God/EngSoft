"use client"; 

import Link from "next/link";
import React, { Component } from 'react';
import { useState } from 'react';
import styles from "./page.module.css";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SideNav from '@/src/app/components/sidenav';
import Header from '@/src/app/components/Header';

export default function NewPage() {

    const [images, setImages] = useState(null);
    const [inputErrors, setInputErrors] = useState({})
    const [linkedText, setLinkedText] = useState('');

    const [formData, setFormData] = useState({
        titulo: "",
        texto: "",
    });

    const fetchTitles = async () => {
        return [
            { title: 'teste', link: '/account/register/role', query: { title: 'Morador' } },
            { title: 'fiscal', link: '/account/register/role', query: { title: 'fiscal' } },
            { title: 'admin', link: '/account/register/role', query: { title: 'admin' } }
        ];
    };
    
    const handleCreateLinks = async () => {
        // Fetch titles ordered by length in descending order
        const titles = await fetchTitles();
        titles.sort((a, b) => b.title.length - a.title.length);
    
        let updatedText = formData.texto;
    
        titles.forEach(({ title, link, query }) => {
            const markdownLink = `[${title}](${link}?title=${encodeURIComponent(query.title)})`;
    
            // Case-insensitive regex to check if the title is already a link
            const linkRegex = new RegExp(`\\[${title}\\]\\(${link}\\?title=${encodeURIComponent(query.title)}\\)`, 'gi');
    
            if (!linkRegex.test(updatedText)) {
                const regex = new RegExp(`\\b${title}\\b`, 'gi');
                updatedText = updatedText.replace(regex, (match) => {
                    return `[${match}](${link}?title=${encodeURIComponent(query.title)})`;
                });
            }
        });
    
        setLinkedText(updatedText);
        setFormData((prevData) => ({
            ...prevData,
            texto: updatedText,
        }));
    };

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        
        setInputErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
    };


    const handleValidation = () => {
        const errors = {};
        Object.keys(formData).forEach((key) => {
            if (formData[key].trim() === "") {
                errors[key] = true;
            }
        });

        setInputErrors(errors);

        // Retornar verdadeiro se não houver erros
        return Object.keys(errors).length === 0;
    };

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        setImages(files);
    };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (handleValidation()) {
            window.location.href = `/`;
        } else {
            alert("Por favor, preencha todos os campos obrigatórios.");
        }
    };

    const renderers = {
        link: ({ href, children }) => {
          const url = new URL(href);
          const title = url.searchParams.get('title');
    
          return (
            <Link href={{ pathname: url.pathname, query: { title } }}>
              {children}
            </Link>
          );
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
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.inputs}>
                            <label className={styles.label}>Título: </label>
                            <input
                                type="text"
                                name="titulo"
                                onChange={handleChange}
                                className={`${styles.inputTitle} ${inputErrors.titulo ? styles.error : ""}`}
                            />
                        </div>
                        <div  className={styles.inputs}>
                            <label className={styles.label}>Texto: </label>
                            <textarea
                                name="texto"
                                onChange={handleChange}
                                className={`${styles.inputText} ${inputErrors.texto ? styles.error : ""}`}
                            />
                        </div>
                        <div  className={styles.inputs}>
                            <label className={styles.label}>Imagens: </label>
                            <input
                                type="file" 
                                multiple 
                                accept="image/*" 
                                onChange={handleImageChange} 
                            />
                        </div>
                        <div>
                        {images != null && images.length > 0 && (
                            <div>
                            <ul>
                                {images.map((image, index) => (
                                <li key={index}>
                                    <img 
                                    src={URL.createObjectURL(image)} 
                                    alt={`Preview ${index + 1}`} 
                                    style={{ width: '400px', height: 'auto' }} 
                                    />
                                </li>
                                ))}
                            </ul>
                            </div>
                        )}  
                        </div>

                        <div className={styles.buttonContainer}>
                            <button type="button" onClick={handleCreateLinks} className={styles.backButton}>Inserir links</button> 
                            <button type="submit" className={styles.nextButton}>Finalizar</button>
                        </div>

                        {linkedText && (
                            <div>
                            <label className={styles.label}>Linked Text Preview:</label>
                            <ReactMarkdown 
                                className={styles.preview}
                                children={linkedText} 
                                remarkPlugins={[remarkGfm]} 
                                components={renderers} 
                            />
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}


