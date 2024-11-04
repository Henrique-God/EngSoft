import Link from "next/link";
import React from 'react';
import styles from "./Header.module.css";
import { josefinSans } from '@/src/app/fonts/fonts'; // Importing the font
import Image from 'next/image';
import mosquito from "@/src/assets/mosquito.png";

export default function Header() {
    return (
        <div className={styles.header_wrapper}>
            <Link href="/" passHref>
                <div className={styles.logo_title_wrapper}>
                    <Image src={mosquito} alt="Mosquito" width={24} height={24} />
                    <h1 className={`${styles.title} ${josefinSans.className}`}> {/* Apply the font class here */}
                        Tchau Dengue
                    </h1>
                </div>
            </Link>
            <div className={styles.buttons_wrapper}>
                <Link className={`${styles.sign_in} ${josefinSans.className}`} href="/account/signin">Sign in</Link> {/* Apply font class here */}
                <Link className={`${styles.register} ${josefinSans.className}`} href="/account/register">Register</Link> {/* Apply font class here */}
            </div>
        </div>
    );
}
