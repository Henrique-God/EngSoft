"use client"

import React, { Component, useEffect, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import styles from "./page.module.css";
import searchIcon from '@/src/assets/icons/search-svgrepo-com.svg';
import { GetAllUserHandler, GetAllUserResponse, UserHandler, UserResponse } from "@/src/app/components/backendConnection";
import decodeToken from "@/src/app/components/TokenDecoder";


export default function Admin(){
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<(string)[][]>([]);
    const [validateFilter, setValidateFilter] = useState('');
    const [roleChecked, setRoleChecked] = useState({
        Administrador: false,
        Fiscal: false,
        Morador: false,
    });
    const [dMin, setDMin] = useState('');
    const [mMin, setMMin] = useState('');
    const [yMin, setYMin] = useState('');
    const [dMax, setDMax] = useState('');
    const [mMax, setMMax] = useState('');
    const [yMax, setYMax] = useState('');
    const [users, setUsers] = useState<(string)[][]>([]);   
    const [roleValue, setRoleValue] = useState("Morador");
    const [orderOption, setOrderOption] = useState("");


    const validateOptions = ["", "Validados", "Em Análise", "Inválidos"];
    const orderOptions = ["", "Mais recente", "Mais antigo"];
    const options = ['Administrador', 'Fiscal', 'Morador'];


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
                    const result: GetAllUserResponse = await GetAllUserHandler();
                    if (result.users) {
                        setUsers(result.users);
                        setFilteredUsers(result.users)
                    }
                } catch (err) {
                }
            } else {
            }
        };
        fetchUserData();
    }, [roleValue]);

    const applyFilters = () => {
        let filteredUsers = [...users];
    
        // Filter by validated status
        if (validateFilter) {
            if (validateFilter === "Validados") {
                filteredUsers = filteredUsers.filter(user => user.validated === "Válido");
            } else if (validateFilter === "Em Análise") {
                filteredUsers = filteredUsers.filter(user => user.validated === "em análise");
            } else if (validateFilter === "Inválidos") {
                filteredUsers = filteredUsers.filter(user => user.validated === "Inválido");
            }
        }
    
        // Filter by role
        
        const selectedRoles = Object.entries(roleChecked)
                .filter(([key, value]) => value)
                .map(([key]) => key); 
        console.log(selectedRoles)
        if (selectedRoles.length > 0) {
            filteredUsers = filteredUsers.filter(user => selectedRoles.includes(user.role));
        }
    
        // Filter by creation date range
        const minDate = new Date(`${yMin}-${mMin}-${dMin}`);
        const maxDate = new Date(`${yMax}-${mMax}-${dMax}`);
        if (!isNaN(minDate.getTime()) && !isNaN(maxDate.getTime())) {
            filteredUsers = filteredUsers.filter(user => {
                const userDate = new Date(user.createdAt);
                return userDate >= minDate && userDate <= maxDate;
            });
        }
        setFilteredUsers(filteredUsers);
    };
    
    const applySearch = () => {
        let filtered = [...filteredUsers]; 
        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            filtered = filteredUsers.filter(user => 
                user.userName.toLowerCase().includes(lowerCaseQuery) || 
                user.email?.toLowerCase().includes(lowerCaseQuery)
            );
        }
        setSearchQuery('');
        setFilteredUsers(filtered);
    }

    const applyOrder = () => {
        let orderedUsers = [...filteredUsers]; // Start with the filtered list
        if (orderOption === "Mais recente") {
            orderedUsers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (orderOption === "Mais antigo") {
            orderedUsers.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        }

        setFilteredUsers(orderedUsers); // Update the state with the ordered list
    }
    
    return (
    <div>
        <div className={styles.container}>
            <div className={styles.titleWrapper}><label>Área do administrador</label></div>
            <div className={styles.contentWrapper}>
                <div className={styles.filterWrapper}>
                    <label className={styles.filterTile}>Filtros:</label>
                    <div className={styles.selectDiv}>
                        <label className={`${styles.filterLabel} ${styles.additionalSize}`}>Válidado:</label>
                        <select 
                            className={styles.validate}
                            onChange={(e) => setValidateFilter(e.target.value)}
                        >
                            {validateOptions.map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.roleDiv}>
                        <label className={styles.filterLabel} >Cargo:</label>
                        {options.map(option => (
                            <label key={option} className={styles.roleLabel}>
                                <input
                                    className={styles.roleInput}
                                    type="checkbox"
                                    key={option}
                                    onChange={(e) =>
                                        setRoleChecked((prev) => ({
                                            ...prev,
                                            [option]: e.target.checked,
                                        }))
                                    }
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                    <div className={styles.dateDiv}>
                        <label className={styles.filterLabel} >Data de criação:</label>
                        <div className={styles.dateMaxDiv}>
                            <label className={`${styles.filterLabel} ${styles.additionalStyle}`}>de:</label>
                            <input
                                type="text"
                                name={"dMin"}
                                maxLength={2}
                                pattern="\d*"
                                placeholder="dd"
                                className={styles.inputDate}
                                onChange={(e) => setDMin(e.target.value)}

                            />
                            <label className={styles.filterLabel}>/</label>
                            <input
                                type="text"
                                name={"mMin"}
                                maxLength={2}
                                pattern="\d*"
                                placeholder="mm"
                                className={styles.inputDate}
                                onChange={(e) => setMMin(e.target.value)}

                            />
                            <label className={styles.filterLabel}>/</label>
                            <input
                                type="text"
                                name={"yMin"}
                                maxLength={4}
                                pattern="\d*"
                                placeholder="yyyy"
                                className={styles.inputDate}
                                onChange={(e) => setYMin(e.target.value)}
                            />
                        </div>
                        <div className={styles.dateMinDiv}>
                            <label className={`${styles.filterLabel} ${styles.additionalStyle}`}>até:</label>
                            <input
                                type="text"
                                name={"dMax"}
                                maxLength={2}
                                pattern="\d*"
                                placeholder="dd"
                                className={styles.inputDate}
                                onChange={(e) => setDMax(e.target.value)}

                            />
                            <label className={styles.filterLabel}>/</label>
                            <input
                                type="text"
                                name={"mMax"}
                                maxLength={2}
                                pattern="\d*"
                                placeholder="mm"
                                className={styles.inputDate}
                                onChange={(e) => setMMax(e.target.value)}
                            />
                            <label className={styles.filterLabel}>/</label>
                            <input
                                type="text"
                                name={"yMax"}
                                maxLength={4}
                                pattern="\d*"
                                placeholder="yyyy"
                                className={styles.inputDate}
                                onChange={(e) => setYMax(e.target.value)}

                            />
                        </div>
                    </div>
                    <div className={styles.filterButton}>
                        <button className={styles.saveChangesButton} onClick={applyFilters}>Aplicar filtros</button>
                    </div>
                </div>
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
                        <label className={styles.filterLabel}>ordenar por:</label>
                        <select 
                            className={styles.orderSelect} 
                            onChange={(e) => {
                                setOrderOption(e.target.value);
                                applyOrder();
                            }}>
                            {orderOptions.map((option, index) => (
                                    <option key={index} value={option}>
                                        {option}
                                    </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.divTable}>
                        <h2 className={styles.h2Table}>Usuários</h2>
                        <table className={styles.tTable}>
                            <thead className={styles.threadTable}>
                            <tr className={styles.trTable}>
                                <th className={styles.thTable}>Nome</th>
                                <th className={styles.thTable}>Email</th>
                                <th className={styles.thTable}>Cargo</th>
                                <th className={styles.thTable}>Validado</th>
                                <th className={styles.thTable}>Documento</th>
                                <th className={styles.thTable}>Data de criação</th>
                                <th className={styles.thTable}>CPF</th>
                            </tr>
                            </thead>
                            <tbody className={styles.tbodyTable}>
                            {filteredUsers.map((user) => (
                                <tr className={styles.trTable} key={user.id} style={{ textAlign: 'center' }}>
                                <td className={styles.tdTable}>{user.userName}</td>
                                <td className={styles.tdTable}>{user.email}</td>
                                <td className={styles.tdTable}>{user.role}</td>
                                <td className={styles.tdTable}>{user.validated}</td>
                                <td className={styles.tdTable}>{user.socialNumber}</td>
                                <td className={styles.tdTable}>{user.createdAt}</td>
                                <td className={styles.tdTable}>{user.cpf}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div className={styles.filterButton}>
                        <button type="submit" className={styles.saveChangesButton}>Salvar mudanças</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}
