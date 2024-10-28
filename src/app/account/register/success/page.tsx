"use client"; 

import Link from "next/link";
import React, { Component, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from "./page.module.css";

export default function Success(){
    const searchParams = useSearchParams();
    const role = searchParams.get("role");
    return (
    <div className={styles.container}>
        <div className={styles.main}>
            <div className={styles.content}>
                {(role === "fiscal" || role === "admin") && (
                    <div>
                        <h1 className={styles.title}>Solicitação de Cadastro Realizada!</h1>
                        <h2 className={styles.semiTitle}>Um Administrador irá validar sua conta.</h2>
                    </div>
                )}
                {(role === "morador") && (
                    <div>
                        <h1 className={styles.title}>Cadastro Realizado com sucesso!</h1>
                    </div>
                )}
                <div className={styles.buttonDiv}><Link
                    className={styles.backButton} 
                    href="/">Voltar para tela inicial</Link> </div>
                   
            </div>
        </div>
    </div>
    );
}
