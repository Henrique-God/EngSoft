import Link from "next/link";
import Image from 'next/image';
import React, { Component } from 'react';
import morador from '@/src/assets/morador.jpg';
import fiscal from '@/src/assets/fiscal.jpg';
import admin from '@/src/assets/admin.jpg';
import styles from "./page.module.css";
import SideNav from '@/src/app/components/sidenav';
import Header from '@/src/app/components/Header';


export default function Register(){
    return (
    <div>
        <Header />
        <div style={{ display: 'flex', flexDirection: 'row', width: '100vw' }}>
            <div className="w-full flex-none md:w-40">
                <SideNav />
            </div>
            <div className={styles.container}>
                <div className={styles.main}>
                    <div className={styles.content}>
                        <h1 className={styles.roletitle}>Cadastro</h1>
                        <div className={styles.grid}>
                            <Link href={{ pathname: '/account/register/role', query: { role: 'morador' } }} className={styles.card}>
                            <div>
                                <Image src={morador} alt="Morador" className={styles.accoutn_type} />
                                <h2 className={styles.roletitle}>Morador</h2>
                            </div>
                            </Link>

                            <Link href={{ pathname: '/account/register/role', query: { role: 'fiscal' } }} className={styles.card}>
                            <div>
                                <Image src={fiscal} alt="Fiscal/Agente Público" className={styles.accoutn_type} />
                                <h2 className={styles.roletitle}>Fiscal/Agente Público</h2>
                            </div>
                            </Link>

                            <Link href={{ pathname: '/account/register/role', query: { role: 'admin' } }} className={styles.card}>
                            <div>
                                <Image src={admin} alt="Administrador" className={styles.accoutn_type} />
                                <h2 className={styles.roletitle}>Administrador</h2>
                            </div>
                            </Link>
                        </div>
                        <Link
                            className={styles.backButton} 
                            href="/">Voltar para tela inicial</Link>    
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}
