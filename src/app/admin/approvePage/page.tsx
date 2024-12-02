"use client"

import React, { Component, FormEvent, useEffect, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import styles from "./page.module.css";
import searchIcon from '@/src/assets/icons/search-svgrepo-com.svg';
import { UserHandler, UserResponse } from "@/src/app/components/backendConnection";
import { GetAllPagestHandler, GetAllPagesResponse, ApprovePageHandler, ApprovePageResponse } from "@/src/app/components/conecctionBackendWiki";
import decodeToken from "@/src/app/components/TokenDecoder";


export default function ApprovePage(){
    const [searchQuery, setSearchQuery] = useState('');
    const [wikis, setWikis] = useState<(string)[][]>([]);   
    const [filteredWikis, setFilteredWikis] = useState<(string)[][]>([]);
    const [roleValue, setRoleValue] = useState("Morador");

    const token = localStorage.getItem("token")
    const decodedToken = token ? decodeToken(token) : null;
    useEffect(() => {
        const fetchUserData = async () => {
            if (decodedToken) {
                try {
                    const result: UserResponse = await UserHandler(decodedToken.nameid);
                    if (result.userName) {
                        setRoleValue(result.userName)
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
                    const result: GetAllPagesResponse = await GetAllPagestHandler();
                    if (result.pages) {
                        const unapprovedPages = result.pages.filter((page) => !page.approved);
                        setWikis(unapprovedPages);
                        setFilteredWikis(unapprovedPages)
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
                wiki.PageTitle.toLowerCase().includes(lowerCaseQuery) || 
                wiki.OwnerName?.toLowerCase().includes(lowerCaseQuery)
            );
        }
        setSearchQuery('');
        setFilteredWikis(filtered);
    }

    const toggleApproved = (id: string) => {
        setWikis((prev) =>
          prev.map((wiki) =>
            wiki.id === id
              ? { ...wiki, approved: wiki.approved === 'Yes' ? 'No' : 'Yes' }
              : wiki
          )
        );
    };

    const saveChangesButton = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault(); 
        const approvedWikis = wikis.filter((wiki) => wiki.approved);

        for (const wiki of approvedWikis) {
            try {
                const result: ApprovePageResponse = await ApprovePageHandler(wiki.id);

                if (result.success) {
                    console.log(`Wiki with ID ${wiki.id} approved successfully!`);
                } else {
                    console.error(`Failed to approve Wiki with ID ${wiki.id}: ${result.error}`);
                }
            } catch (error) {
                console.error(`Error approving Wiki with ID ${wiki.id}:`, error);
            }
        }

        console.log("All approved wikis processed.");
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
                                        <a href={`/wiki?title=${wiki.PageTitle}`} className={styles.linkStyle}>
                                        {wiki.PageTitle}
                                        </a>
                                    </td>
                                    <td className={styles.tdTable}>{wiki.OwnerName}</td>
                                    <td className={styles.tdTable}>
                                        <button
                                        className={`${styles.approvedButton} ${
                                            wiki.approved === 'Yes' ? styles.yesButton : styles.noButton
                                        }`}
                                        onClick={() => toggleApproved(wiki.id)}
                                        >
                                        {wiki.approved}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div className={styles.filterButton}>
                        <button type="button" onClick={() => saveChangesButton} className={styles.saveChangesButton}>Salvar mudanças</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}
