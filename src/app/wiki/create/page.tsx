"use client"; 

import Link from "next/link";
import React, { Component, FormEvent } from 'react';
import { useState } from 'react';
import styles from "./page.module.css";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ImgInsertHandler, ImgInsertResponse, CreateWikitHandler, CreateWikiResponse } from "@/src/app/components/conecctionBackendWiki";
import { Result } from "postcss";


export default function NewPage() {

    const [image, setImage] = useState(null);
    const [savedImages, setSavedImages] = useState<string[]>([]);
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

        // Replace image placeholders
        const imagePlaceholderRegex = /!\[.*?\]\(<image-(\d+)>\)/g;
        updatedText = updatedText.replace(imagePlaceholderRegex, (match, imageIndex) => {
            const index = parseInt(imageIndex, 10) - 1;
            if (index >= 0 && index < savedImages.length) {
                return `![Image](${savedImages[index]})`;
            }
            return match;
        });
    
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
        setImage(files);

    };

    const handleSaveImg = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (image) {
            const result: ImgInsertResponse = await ImgInsertHandler(image);
            setImage(null);
            if (result.success && result.path) {
                setSavedImages([...savedImages, result.path]);
            }
        }
        
        return
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
    
        if (!handleValidation()) {
          alert("Por favor, preencha todos os campos obrigatórios.");
          return;
        }
    
        try {
          const response = await CreateWikitHandler({
            wikiTitle: formData.titulo.trim(),
            wikiText: formData.texto.trim(),
          });
    
          if (response.success) {
            alert(`Página criada com sucesso: ${response.title}`);
            window.location.href = `/wiki/${encodeURIComponent(response.title || "")}`;
          } else {
            console.error("Erro ao criar página:", response.error);
            alert(`Erro ao criar a página: ${response.error || "Erro desconhecido"}`);
          }
        } catch (error) {
          console.error("Erro inesperado:", error);
          alert("Ocorreu um erro inesperado ao tentar criar a página.");
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
            <div style={{ display: 'flex', flexDirection: 'row'}}>
                <div className="w-full flex-none md:w-40">
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
                            <label className={styles.label}
                                style={{ color: 'darkgrey', fontSize: '14px' }}

                            >
                                Para inserir imagens, escreva {"![<alt-text>](<image-numeroDaImagemInserida>)"}
                            </label>                            
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
                            <button type="button" onClick={handleSaveImg} className={styles.backButton}>Salvar Imagem</button>
                        </div>
                        {savedImages.length > 0 && (
                            <div className={styles.imageContainer}>
                                {savedImages.map((path, index) => (
                                    <img key={index} src={path} alt={`Uploaded ${index}`} className={styles.uploadedImage} />
                                ))}
                            </div>
                        )}

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
