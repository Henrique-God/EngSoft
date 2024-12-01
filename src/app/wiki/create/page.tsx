"use client";

import Link from "next/link";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import styles from "./page.module.css";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface FormData {
  titulo: string;
  texto: string;
}

interface InputErrors {
  titulo?: boolean;
  texto?: boolean;
}

interface TitleLink {
  title: string;
  link: string;
  query: { title: string };
}

export default function NewPage() {
  const [images, setImages] = useState<File[]>([]);
  const [inputErrors, setInputErrors] = useState<InputErrors>({});
  const [linkedText, setLinkedText] = useState('');
  const [formData, setFormData] = useState<FormData>({ titulo: "", texto: "" });

  const fetchTitles = async (): Promise<TitleLink[]> => {
    return [
      { title: 'teste', link: '/account/register/role', query: { title: 'Morador' } },
      { title: 'fiscal', link: '/account/register/role', query: { title: 'fiscal' } },
      { title: 'admin', link: '/account/register/role', query: { title: 'admin' } }
    ];
  };
  
  const handleCreateLinks = async () => {
    const titles = await fetchTitles();
    titles.sort((a, b) => b.title.length - a.title.length);

    let updatedText = formData.texto;

    titles.forEach(({ title, link, query }) => {
      const markdownLink = `[${title}](${link}?title=${encodeURIComponent(query.title)})`;
      const linkRegex = new RegExp(`\\[${title}\\]\\(${link}\\?title=${encodeURIComponent(query.title)}\\)`, 'gi');

      if (!linkRegex.test(updatedText)) {
        const regex = new RegExp(`\\b${title}\\b`, 'gi');
        updatedText = updatedText.replace(regex, (match) => `[${match}](${link}?title=${encodeURIComponent(query.title)})`);
      }
    });

    setLinkedText(updatedText);
    setFormData((prevData) => ({ ...prevData, texto: updatedText }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setInputErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
  };

  const handleValidation = (): boolean => {
    const errors: InputErrors = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key as keyof FormData].trim() === "") {
        errors[key as keyof FormData] = true;
      }
    });
    setInputErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setImages(files);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (handleValidation()) {
      window.location.href = `/`;
    } else {
      alert("Por favor, preencha todos os campos obrigatórios.");
    }
  };

  const renderers = {
    link: ({ href, children }: { href: string; children: React.ReactNode }) => {
      try {
        const url = new URL(href, window.location.href);
        const title = url.searchParams.get('title') || '';
        return (
          <Link href={{ pathname: url.pathname, query: { title } }}>
            {children}
          </Link>
        );
      } catch (error) {
        console.error("Invalid URL in link renderer:", error);
        return <span>{children}</span>;
      }
    }
  };
  

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Escreva o conteúdo da página que deseja adicionar ao nosso site:</h1>
      <form onSubmit={handleSubmit} className={styles.form}></form>
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
        <div className={styles.inputs}>
          <label className={styles.label}>Texto: </label>
          <textarea
            name="texto"
            onChange={handleChange}
            className={`${styles.inputText} ${inputErrors.texto ? styles.error : ""}`}
          />
        </div>
        <div className={styles.inputs}>
          <label className={styles.label}>Imagens: </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        {images.length > 0 && (
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
  );
}
