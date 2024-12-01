"use client"; 

import Link from "next/link";
import Image, { StaticImageData } from 'next/image';
import React, { Component, FormEvent } from 'react';
import morador from '@/src/assets/morador.jpg';
import fiscal from '@/src/assets/fiscal.jpg';
import admin from '@/src/assets/admin.jpg';
import ShowPass from '@/src/assets/icons/show_pass.svg';
import HidePass from '@/src/assets/icons/dont_show_pass.svg';
import editIcon from '@/src/assets/icons/pencil-svgrepo-com.svg';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import styles from "./page.module.css";
import { AddPhotoHandler, AddPhotoResponse, CreateHandler, CreateResponse } from "@/src/app/components/backendConnection";


export default function Role() {
    
    const searchParams = useSearchParams();
    const role = searchParams.get("role");

    const [pdfFile, setPdfFile] = useState("");
    const [inputErrors, setInputErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const [profilePic, setProfilePic] = useState("");
    const [formData, setFormData] = useState({
        nomecompleto: "",
        cpf: 0,
        cep: "",
        email: "",
        senha: "",
        senha2: "",
    });
    let roleImg: StaticImageData | undefined;
    if (role === "morador") {
        roleImg = morador;
    } else if (role === "fiscal") {
        roleImg = fiscal;
    } else {
        roleImg = admin;
    }
    
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const togglePassword2Visibility = () => {
        setShowPassword2(!showPassword2);
    };
    
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

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (handleValidation() && role) {
            const accountInfo = {
                userName: formData.nomecompleto, 
                password: formData.senha,
                role: role,
                email: formData.email,
                zipCode: formData.cep,
                socialNumber: formData.cpf,
            };
            const result: CreateResponse = await CreateHandler(accountInfo);
            if (result.success && result.token) {
                localStorage.setItem("token", result.token);
                const resultPhoto: AddPhotoResponse = await AddPhotoHandler(profilePic);
                if(resultPhoto.success) {
                    window.location.href = `/account/register/success`;
                } else {
                    alert("Algo deu errado com sua foto de perfil, mas seu cadastro foi realizado");
                    window.location.href = `/account/register/success`;
                }
            } else {
                alert("Algo deu errado, tente novamente mais tarde");
            }            
        } else {
            alert("Por favor, preencha todos os campos obrigatórios.");
        }
    };

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
          const newImageUrl = URL.createObjectURL(file);
          setProfilePic(newImageUrl);
        }
    };

    const getImageSrc = () => {
        if (profilePic) return profilePic;
        if (role === "Morador") return morador;
        if (role === "Fiscal") return fiscal;
        if (role === "Admin") return admin;
        return morador
    };

    return (
        <div>
        <div style={{ display: 'flex', flexDirection: 'row'}}>
            <div className="w-full flex-none md:w-40">
            </div>
                <div className={styles.container}>
                    <div className={styles.Header}>
                        <h1 className={styles.title}>
                            {role === "admin" && "Administrador"}
                            {role === "fiscal" && "Fiscal"}
                            {role === "morador" && "Morador"}
                        </h1>
                        <div className={styles.profileContainer}>
                            <label htmlFor="fileInput" className={styles.imageWrapper}>
                                <Image
                                fill={true}
                                src={getImageSrc()}
                                alt="Profile"
                                className={styles.image}
                                />
                                <div className={styles.editIconContainer} style={{ filter: "invert(1)" }}>
                                    <Image src={editIcon} alt="Edit" className={styles.editIcon} />
                                </div>
                            </label>
                            <input
                                id="fileInput"
                                type="file"
                                accept="image/*"
                                className={styles.inputImage}
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>
                    
                    <form onSubmit={handleSubmit} className={styles.form}>
                        {["Nome Completo", "CPF", "CEP", "Email"].map((field, index) => (
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
                        
                        <div className={styles.inputs}>
                            <label className={styles.label}>Senha:</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="senha"
                                    value={formData["senha"] || ""}
                                    onChange={handleChange}
                                    className={`${styles.input} ${inputErrors.senha ? styles.error : ""}`}
                                />
                                <button type="button" onClick={togglePasswordVisibility} className={styles.toggleButton}>
                                    {showPassword ? <Image src={HidePass} alt="Hide Password" width={24} height={24} /> : <Image src={ShowPass} alt="Show Password" width={24} height={24} />}
                                </button>   
                            </div>

                        </div>
                        <div className={styles.inputs}>
                            <label className={styles.label}>Digite a senha novamente:</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type={showPassword2 ? "text" : "password"}
                                    name="senha2"
                                    value={formData["senha2"] || ""}
                                    onChange={handleChange}
                                    className={`${styles.input} ${inputErrors.senha2 ? styles.error : ""}`}
                                />
                                <button type="button" onClick={togglePassword2Visibility} className={styles.toggleButton}>
                                    {showPassword2 ? <Image src={HidePass} alt="Hide Password" width={24} height={24} /> : <Image src={ShowPass} alt="Show Password" width={24} height={24} />}
                                </button>
                            </div>
                        </div>

                        {(role === "fiscal" || role === "admin") && (
                            <div className={styles.inputs}>
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
            </div>
        </div>
    );
}