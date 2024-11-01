"use client"

import React, { Component, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import styles from "./page.module.css";
import SideNav from '@/src/app/components/sidenav';
import Header from '@/src/app/components/Header';
import searchIcon from '@/src/assets/icons/search-svgrepo-com.svg';



export default function Account(){
    const [searchQuery, setSearchQuery] = useState('');

    const validateOptions = ["", "Validados", "Em Análise", "Inválidos"];
    const orderOptions = ["", "Mais recente", "Mais antigo"];
    const options = ['Administrador', 'Fiscal', 'Morador'];

    const handleChange = (value : string, e : any) => {
        if (value == "validateFilter") {

        }
    };


    //teste
    const users = [
        {
          nome: 'Pessoa a',
          cargo: 'Morador',
          validado: true,
          documento: '123456789',
          dataCriacao: '2024-10-01',
          active: "ativo",
        },
        {
          nome: 'Pessoa B',
          cargo: 'Morador',
          validado: false,
          documento: '987654321',
          dataCriacao: '2023-09-15',
          active: "ativo",
        },
        {
          nome: 'Pessoa C',
          cargo: 'Fiscal',
          validado: true,
          documento: '456123789',
          dataCriacao: '2022-05-30',
          active: "ativo",
        },
        {
          nome: 'Pessoa D',
          cargo: 'Aministrador',
          validado: true,
          documento: '321789654',
          dataCriacao: '2021-11-20',
          active: "ativo",
        },
      ];



    return (
    <div>
        <Header />
        <div style={{ display: 'flex', flexDirection: 'row', width: '100vw' }}>
            <div className="w-full flex-none md:w-40">
                <SideNav />
            </div>
            <div className={styles.container}>
                <div className={styles.titleWrapper}><label>Area do administrador</label></div>
                <div className={styles.contentWrapper}>
                    <div className={styles.filterWrapper}>
                        <label className={styles.filterTile}>Filtros:</label>
                        <div className={styles.selectDiv}>
                            <label className={`${styles.filterLabel} ${styles.additionalSize}`}>Válidado:</label>
                            <select 
                                className={styles.validate}
                                onChange={(e) => handleChange("validateFilter", e)}
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
                                />
                                <label className={styles.filterLabel}>/</label>
                                <input
                                    type="text"
                                    name={"mMin"}
                                    maxLength={2}
                                    pattern="\d*"
                                    placeholder="mm"
                                    className={styles.inputDate}
                                />
                                <label className={styles.filterLabel}>/</label>
                                <input
                                    type="text"
                                    name={"yMin"}
                                    maxLength={4}
                                    pattern="\d*"
                                    placeholder="yyyy"
                                    className={styles.inputDate}
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
                                />
                                <label className={styles.filterLabel}>/</label>
                                <input
                                    type="text"
                                    name={"mMax"}
                                    maxLength={2}
                                    pattern="\d*"
                                    placeholder="mm"
                                    className={styles.inputDate}
                                />
                                <label className={styles.filterLabel}>/</label>
                                <input
                                    type="text"
                                    name={"yMax"}
                                    maxLength={4}
                                    pattern="\d*"
                                    placeholder="yyyy"
                                    className={styles.inputDate}
                                />
                            </div>
                        </div>
                        <div className={styles.filterButton}>
                            <button className={styles.saveChangesButton}>Aplicar filtros</button>
                        </div>
                    </div>
                    <div className={styles.tableWrapper}>
                        <div className={styles.searchAndOrderbyDiv}>
                            <div className={styles.searchDiv}>
                                <Image src={searchIcon} alt="searchIcon" className={styles.searchImg}></Image>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={styles.searchInput}
                                />
                            </div>
                            <label className={styles.filterLabel}>ordenar por:</label>
                            <select className={styles.orderSelect}>
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
                                    <th className={styles.thTable}>Cargo</th>
                                    <th className={styles.thTable}>Validado</th>
                                    <th className={styles.thTable}>Documento</th>
                                    <th className={styles.thTable}>Data de criação</th>
                                    <th className={styles.thTable}>Status perfil</th>
                                </tr>
                                </thead>
                                <tbody className={styles.tbodyTable}>
                                {users.map((user, index) => (
                                    <tr className={styles.trTable} key={index} style={{ textAlign: 'center' }}>
                                    <td className={styles.tdTable}>{user.nome}</td>
                                    <td className={styles.tdTable}>{user.cargo}</td>
                                    <td className={styles.tdTable}>{user.validado ? 'Sim' : 'Não'}</td>
                                    <td className={styles.tdTable}>{user.documento}</td>
                                    <td className={styles.tdTable}>{user.dataCriacao}</td>
                                    <td className={styles.tdTable}>{user.active}</td>
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
    </div>
    );
}
