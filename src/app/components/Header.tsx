import Link from "next/link";
import React from "react";
import styles from "./Header.module.css";
import Image from "next/image";
import logo from "@/src/assets/logo.png";

export default function Header() {
    return (
        <div className={styles.header_wrapper}>
            <Link href="/" passHref>
                <div className={styles.logo_title_wrapper}>
                    <Image src={logo} alt="Mosquito" width={350} height={120} />
                </div>
            </Link>
            <div className={styles.buttons_wrapper}>
             <Link className={styles.sign_in} href="/account/signin">Sign in</Link>
                <Link className={styles.register} href="/account/register">Register</Link>
            </div>
        </div>
    );
}
