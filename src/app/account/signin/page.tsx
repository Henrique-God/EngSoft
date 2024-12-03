"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import mosquito from "@/src/assets/logo_min.png";

import { LoginHandler, LoginResponse } from "@/src/app/components/backendConnection";

interface FormData {
    usuario: string;
    senha: string;
}

export default function Role() {
    const [inputErrors, setInputErrors] = useState<{ [key: string]: boolean }>({});
    const [formData, setFormData] = useState<FormData>({
        usuario: "",
        senha: "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));

        setInputErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
    };

    const handleValidation = (): boolean => {
        const errors: { [key: string]: boolean } = {};
        Object.keys(formData).forEach((key) => {
            if (formData[key as keyof FormData].trim() === "") {
                errors[key] = true;
            }
        });

        setInputErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (handleValidation()) {
            const credentials = {
                userName: formData.usuario, 
                password: formData.senha,   
            };
            const result: LoginResponse = await LoginHandler(credentials);

            if (result.success && result.token) {
                localStorage.setItem("token", result.token);
                
                window.location.href = "/";
            } else {
                console.error("Login failed:", result.error);
            }
        }
    };

    return (
        <div>
            <div style={{ display: "flex", flexDirection: "row"}}>
                <div className="w-full flex-none md:w-40"></div>
                <div className={styles.container}>
                    <div className={styles.logo_title_wrapper}>
                        <Image src={mosquito} alt="Mosquito" width={300} height={300} />
                    </div>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        {["Usuario", "Senha"].map((field, index) => (
                            <div key={index} className={styles.inputs}>
                                <label className={styles.label}>{field}:</label>
                                <input
                                    type={field === "Senha" ? "password" : "text"}
                                    name={field.toLowerCase()}
                                    value={formData[field.toLowerCase() as keyof FormData] || ""}
                                    onChange={handleChange}
                                    className={`${styles.input} ${
                                        inputErrors[field.toLowerCase()] ? styles.error : ""
                                    }`}
                                />
                            </div>
                        ))}

                        <div className={styles.buttonContainer}>
                            <Link className={styles.backButton} href="/">
                                Voltar
                            </Link>
                            <button type="submit" className={styles.nextButton}>
                                Entrar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
