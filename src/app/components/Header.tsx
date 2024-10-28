import Link from "next/link";
import React from 'react';
import styles from "./Header.module.css";

import Image from 'next/image';
import mosquito from "../assets/mosquito.png";

type HeaderProps = {
     page: string
}

export function Header({ page }: HeaderProps) {
    return (
        <div className={styles.header_wrapper}>
            <div className={styles.logo_title_wrapper}>
                <Image src={mosquito} alt="Mosquito" width={24} height={24} />
                <h1 className={styles.title}>Tchau Dengue</h1>
            </div>
            <div className={styles.buttons_wrapper}>
                <Link className={styles.sign_in} href="/signin">Sign in</Link>
                <Link className={styles.register} href="/register">Register</Link>
            </div>
        </div>
    );
}
