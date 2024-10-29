import Link from "next/link";
import Image from 'next/image';
import React, { Component } from 'react';
import morador from '@/src/assets/morador.jpg';
import styles from "./page.module.css";
import SideNav from '@/src/app/components/sidenav';
import Header from '@/src/app/components/Header';


export default function Account(){
    return (
    <div>
        <Header />
        <div style={{ display: 'flex', flexDirection: 'row', width: '100vw' }}>
            <div className="w-full flex-none md:w-40">
                <SideNav />
            </div>
        </div>
    </div>
    );
}
