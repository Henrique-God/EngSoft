import Link from "next/link";
import React from 'react';
import styles from "./Header.module.css";

import Image from 'next/image';
import mosquito from "@/src/assets/mosquito.png";


export default function Header() {
    return (
        <div className={styles.header_wrapper}>
            <Link href="/" passHref>
                <div className={styles.logo_title_wrapper}>
                    <Image src={mosquito} alt="Mosquito" width={24} height={24} />
                    <h1 className={styles.title}>Tchau Dengue</h1>
                </div>
            </Link>
            <div className={styles.buttons_wrapper}>
                <Link className={styles.sign_in} href="/account/signin">Sign in</Link>
                <Link className={styles.register} href="/account/register">Register</Link>
            </div>
        </div>
    );
}
