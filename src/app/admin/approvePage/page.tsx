"use client"

import React, { Component, FormEvent, useEffect, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import styles from "./page.module.css";
import searchIcon from '@/src/assets/icons/search-svgrepo-com.svg';
import { UserHandler, UserResponse } from "@/src/app/components/backendConnection";
import { GetAllPagesHandler, GetAllPagesResponse, ApprovePageHandler, ApprovePageResponse } from "@/src/app/components/conecctionBackendWiki";
import decodeToken from "@/src/app/components/TokenDecoder";


export default function ApprovePage(){
    const [searchQuery, setSearchQuery] = useState('');
    const [wikis, setWikis] = useState<(string)[][]>([]);   
    const [filteredWikis, setFilteredWikis] = useState<(string)[][]>([]);
    const [roleValue, setRoleValue] = useState("USER");

    const token = localStorage.getItem("token")
    const decodedToken = token ? decodeToken(token) : null;
    useEffect(() => {
        const fetchUserData = async () => {
            if (decodedToken) {
                try {
                    const result: UserResponse = await UserHandler(decodedToken.nameid);
                    if (result.role) {
                        setRoleValue(result.role)
                    }
                } catch (err) {
                }
            } 
        };

        fetchUserData();
    }, [decodedToken]);

    
    useEffect(() => {
        const fetchUserData = async () => {
            if (roleValue) {
                try {
                    const result: GetAllPagesResponse = await GetAllPagesHandler();
                    if (result.pages) {
                        const unvalidatedPages = result.pages.filter((page) => !page.validated);
                        setWikis(unvalidatedPages);
                        setFilteredWikis(unvalidatedPages);
                    }
                } catch (err) {
                }
            } else {
            }
        };
        fetchUserData();
    }, [roleValue]);
    
    const applySearch = () => {
        let filtered = [...wikis]; 
        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            filtered = filteredWikis.filter(wiki => 
                wiki.pageTitle.toLowerCase().includes(lowerCaseQuery) || 
                wiki.ownerName?.toLowerCase().includes(lowerCaseQuery)
            );
        }
        setSearchQuery('');
        setFilteredWikis(filtered);
    }

    const togglevalidated = (id: string) => {
        setWikis((prev) =>
          prev.map((wiki) =>
            wiki.id === id ? { ...wiki, validated: !wiki.validated } : wiki
          )
        );
        setFilteredWikis((prev) =>
            prev.map((wiki) =>
              wiki.id === id ? { ...wiki, validated: !wiki.validated } : wiki
            )
        );
    };

    const saveChangesButton = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault(); 
        const validatedWikis = wikis.filter((wiki) => wiki.validated);

        for (const wiki of validatedWikis) {
            try {
                const result: ApprovePageResponse = await ApprovePageHandler(wiki.id);

                if (result.success) {
                    console.log(`Wiki with ID ${wiki.id} validated successfully!`);
                } else {
                    console.error(`Failed to approve Wiki with ID ${wiki.id}: ${result.error}`);
                }
            } catch (error) {
                console.error(`Error approving Wiki with ID ${wiki.id}:`, error);
            }
        }

        console.log("All validated wikis processed.");
        window.location.reload();
    }
    
    return (
    <div>
        <div className={styles.container}>
            <div className={styles.titleWrapper}><label>Área do administrador</label></div>
            <div className={styles.contentWrapper}>
                <div className={styles.tableWrapper}>
                    <div className={styles.searchAndOrderbyDiv}>
                        <div className={styles.searchDiv}>
                            <Image src={searchIcon} alt="searchIcon" className={styles.searchImg} onClick={applySearch}></Image>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>
                    </div>
                    <div className={styles.divTable}>
                        <h2 className={styles.h2Table}>Telas</h2>
                        <table className={styles.tTable}>
                            <thead className={styles.threadTable}>
                            <tr className={styles.trTable}>
                                <th className={styles.thTable}>Titulo</th>
                                <th className={styles.thTable}>Usuário</th>
                                <th className={styles.thTable}>Aprovar</th>
                            </tr>
                            </thead>
                            <tbody className={styles.tbodyTable}>
                            {filteredWikis.map((wiki) => (
                                <tr className={styles.trTable} key={wiki.id} style={{ textAlign: 'center' }}>
                                    <td className={styles.tdTable}>
                                        <a href={`/wiki?title=${wiki.pageTitle}`} className={styles.linkStyle}>
                                        {wiki.pageTitle}
                                        </a>
                                    </td>
                                    <td className={styles.tdTable}>{wiki.ownerName}</td>
                                    <td className={styles.tdTable}>
                                        <button
                                        className={`${styles.validatedButton} ${
                                            wiki.validated ? styles.yesButton : styles.noButton
                                        }`}
                                        onClick={() => togglevalidated(wiki.id)}
                                        >
                                        {wiki.validated ? "aprovado" : "Não aprovado"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div className={styles.filterButton}>
                        <button type="button" onClick={saveChangesButton} className={styles.saveChangesButton}>Salvar mudanças</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}
