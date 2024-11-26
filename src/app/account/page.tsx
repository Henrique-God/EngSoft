"use client"

import Link from "next/link";
import Image from 'next/image';
import React, { Component, useState, useEffect, FormEvent } from 'react';
import morador from '@/src/assets/morador.jpg';
import admin from '@/src/assets/admin.jpg';
import fiscal from '@/src/assets/fiscal.jpg';
import editIcon from '@/src/assets/icons/pencil-svgrepo-com.svg';
import dEditIcon from '@/src/assets/icons/pencil-slash-svgrepo-com.svg';
import styles from "./page.module.css";
import { UpdateHandler, UpdateResponse, UserHandler, UserResponse } from "@/src/app/components/backendConnection";
import { Result } from "postcss";


export default function Account(){
    const [nomeValue, setNomeValue] = useState("Nome Completo");
    const [cargoValue, setCargoValue] = useState("Morador");
    const [cpfValue, setCpfValue] = useState("CPF");
    const [emailValue, setEmailValue] = useState("Email");
    const [cepValue, setCepValue] = useState("CEP");
    const [profilePic, setProfilePic] = useState("");

    const cargoOptions = ["Morador", "Fiscal", "Administrador"];
    const [fileUploaded, setFileUploaded] = useState('');
    const [accountVerified, setAccountVerified] = useState(false);
    const [shouldShowDiv, setShouldShowDiv] = useState(false);
    const [shouldShowAlert, setShouldShowAlert] = useState(!accountVerified);
    const [pdfFile, setPdfFile] = useState("");
    const [pdfError, setPdfError] = useState(false)

    const [isNomeEditable, setIsNomeEditable] = useState(false);
    const [inputNomeValue, setInputNomeValue] = useState(nomeValue);
    const [isCargoEditable, setIsCargoEditable] = useState(false);
    const [inputCargoValue, setInputCargoValue] = useState(cargoValue);
    const [isEmailEditable, setIsEmailEditable] = useState(false);
    const [inputEmailValue, setInputEmailValue] = useState(emailValue);
    const [isCepEditable, setIsCepEditable] = useState(false);
    const [inputCepValue, setInputCepValue] = useState(cepValue);
    const id = localStorage.getItem("id")
    useEffect(() => {
        const fetchUserData = async () => {
            if (id) {
                try {
                    const result: UserResponse = await UserHandler(id);
                    if (result.userName) {
                        setNomeValue(result.userName);
                        setInputNomeValue(result.userName);
                    }
                    if (result.role) {
                        setCargoValue(result.role);
                        setInputCargoValue(result.role);
                    }
                    if (result.socialNumber) {
                        setCpfValue(result.socialNumber);
                    }
                    if (result.email) {
                        setEmailValue(result.email);
                        setInputEmailValue(result.email);
                    }
                    if (result.zipCode) {
                        setCepValue(result.zipCode);
                        setInputCepValue(result.zipCode);
                    }
                    if(result.profilePic) {
                        setProfilePic(result.profilePic);
                    }
                } catch (err) {
                }
            } else {
            }
        };

        fetchUserData();
    }, [id]);

    const handleEditClick = (value : string) => {
        if (value === "Nome") {
            if  (isNomeEditable) {
                setInputNomeValue(nomeValue);
            } else {
                setInputNomeValue("");
            }
            setIsNomeEditable(!isNomeEditable);
        } else if (value === "Cargo") {
            if  (isCargoEditable) {
                setInputCargoValue(cargoValue);
                if (cargoValue == "Morador") {
                    setShouldShowDiv(false);
                }
            } else {
                setInputCargoValue("");
            }
            setIsCargoEditable(!isCargoEditable);
        } else if (value === "Email") {
            if  (isEmailEditable) {
                setInputEmailValue(emailValue);
            } else {
                setInputEmailValue("");
            }
            setIsEmailEditable(!isEmailEditable);
        } else if (value === "CEP") {
            if  (isCepEditable) {
                setInputCepValue(cepValue);
            } else {
                setInputCepValue("");
            }
            setIsCepEditable(!isCepEditable);
        }
    };

    const handleInputChange = (value : string, e : any) => {
        const inputValue = e.target.value;
        if (value === "Nome") {
            setInputNomeValue(inputValue);
        } else if (value === "Cargo") {
            setInputCargoValue(inputValue);
            setShouldShowDiv(inputValue !== "Morador" && !fileUploaded && !accountVerified);
        } else if (value === "Email") {
            setInputEmailValue(inputValue);
        } else if (value === "CEP") {
            setInputCepValue(inputValue);
        } 
    };


    const handleFileChange = (e: { target: { files: any[]; }; }) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            setPdfFile(file);
            setPdfError(false)
        } else {
            setPdfFile("");
            alert("Por favor, selecione um arquivo PDF.");
            
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if ((inputCargoValue == "Fiscal" || inputCargoValue == "Administrador") && pdfFile == "") {
            setPdfError(true);
            alert("Por favor, adicione um PDF de comprovante.");
        } else {
            const accountInfo = {
                userName: inputNomeValue, 
                role: inputCargoValue,
                email: inputEmailValue,
                zipCode: inputCepValue,
                pdf: pdfFile,  
                profilePic: profilePic,
            };
            const result: UpdateResponse = await UpdateHandler(accountInfo);
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
          const newImageUrl = URL.createObjectURL(file);
          setProfilePic(newImageUrl);
        }
    };

    const getImageSrc = () => {
        if (profilePic) return profilePic;
        if (cargoValue === "Morador") return morador;
        if (cargoValue === "Fiscal") return fiscal;
        if (cargoValue === "Admin") return admin;
        return morador
    };

    return (
    <div>
       
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div className="w-full flex-none md:w-40">
               
            </div>
            <form onSubmit={handleSubmit} className={styles.container}>
                <div className={styles.profileHeader}>
                    <div className={styles.FirstHeader}>
                    <div className={styles.profileContainer}>
                        <label htmlFor="fileInput" className={styles.imageWrapper}>
                            <Image
                            fill={true}
                            src={getImageSrc()}
                            alt="Profile"
                            className={styles.profileImage}
                            />
                            <div className={styles.editIconContainer} style={{ filter: "invert(1)" }}>
                                <Image src={editIcon} alt="Edit" className={styles.editIcon} />
                            </div>
                        </label>
                        <input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            className={styles.inputImage}
                            onChange={handleImageChange}
                        />
                    </div>

                        <div className={styles.nameAndRole}>
                            <div className={styles.editWrapper}>
                                <input
                                    type="text"
                                    className={styles.name}
                                    onChange={(e) => handleInputChange("Nome", e)}
                                    value={inputNomeValue}
                                    placeholder={nomeValue}
                                    disabled={!isNomeEditable}
                                    autoFocus={isNomeEditable}
                                />
                                <button type="button" onClick={() => handleEditClick("Nome")} className={styles.toggleButton}>
                                    {isNomeEditable ? <Image src={dEditIcon} alt="Stop editing" className={styles.editIcon} /> : <Image src={editIcon} alt="Edit" className={styles.editIcon} />}
                                </button>
                            </div>
                            <div className={styles.editDropWrapper}>
                                {cargoValue == "Fiscal" ? 
                                    <select 
                                        className={styles.role}
                                        onChange={(e) => handleInputChange("Cargo", e)}
                                        value={inputCargoValue}
                                        disabled={!isCargoEditable}
                                        autoFocus={isCargoEditable}
                                    >
                                        <option key={"main"} value={ "Fiscal"}>{ "Fiscal"}</option>
                                        {cargoOptions
                                            .filter(option => option !==  "Fiscal")
                                            .map((option, index) => (
                                                <option key={index} value={option}>
                                                    {option}
                                                </option>
                                            ))}

                                    </select>
                                    : (cargoValue == "Admin" ? 
                                        <select 
                                            className={styles.role}
                                            onChange={(e) => handleInputChange("Cargo", e)}
                                            value={inputCargoValue}
                                            disabled={!isCargoEditable}
                                            autoFocus={isCargoEditable}
                                        >
                                            <option key={"main"} value={"Admin"}>{"Admin"}</option>
                                            {cargoOptions
                                                .filter(option => option !== "Admin")
                                                .map((option, index) => (
                                                    <option key={index} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                        </select>    
                                        : 
                                        <select 
                                            className={styles.role}
                                            onChange={(e) => handleInputChange("Cargo", e)}
                                            value={inputCargoValue}
                                            disabled={!isCargoEditable}
                                            autoFocus={isCargoEditable}
                                        >
                                            <option key={"main"} value={"Morador"}>{"Morador"}</option>
                                            {cargoOptions
                                                .filter(option => option !== "Morador")
                                                .map((option, index) => (
                                                    <option key={index} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                        </select>   
                                    )
                                }
                               
                                <button type="button" onClick={() => handleEditClick("Cargo")} className={styles.toggleButton}>
                                    {isCargoEditable ? <Image src={dEditIcon} alt="Stop editing" className={styles.editIcon} /> : <Image src={editIcon} alt="Edit" className={styles.editIcon} />}
                                </button>
                            </div>
                            <div className={styles.inputs} style={{ display: shouldShowDiv ? 'flex' : 'none' }}>
                            
                                <label className={styles.label}>Insira um comprovante de cargo (PDF):</label>
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className={`${styles.input} ${pdfError ? styles.error : ""}`}
                                />
                            </div>
                            <div style={{ display: shouldShowAlert ? 'block' : 'none', marginTop: '8px' }}>
                                <label className={styles.inAnalisys}>Cargo em análise!</label>
                            </div>
                        </div>
                    </div>
                    <Link
                            className={styles.backButton} 
                            href="/">Voltar</Link>   
                </div>
                <div className={styles.form}>
                    <div className={styles.firstCol}>
                        <div className={styles.fieldRow}>
                            <label>CPF:</label>
                            <input type="text" className={styles.input} value={cpfValue} disabled />
                        </div>
                        <div className={styles.fieldRow}>
                            <label>Email:</label>
                            <div className={styles.editWrapper}>
                                <input
                                    type="text"
                                    className={styles.input}
                                    onChange={(e) => handleInputChange("Email", e)}
                                    value={inputEmailValue}
                                    placeholder={emailValue}
                                    disabled={!isEmailEditable}
                                    autoFocus={isEmailEditable}
                                />
                                <button type="button" onClick={() => handleEditClick("Email")} className={styles.toggleButton}>
                                    {isEmailEditable ? <Image src={dEditIcon} alt="Stop editing" className={styles.editIcon} /> : <Image src={editIcon} alt="Edit" className={styles.editIcon} />}
                                </button>
                            </div>
                        </div>
                        <div className={styles.fieldRow}>
                            <label>CEP:</label>
                            <div className={styles.editWrapper}>
                                <input
                                    type="text"
                                    className={styles.input}
                                    onChange={(e) => handleInputChange("CEP", e)}
                                    value={inputCepValue}
                                    placeholder={cepValue}
                                    disabled={!isCepEditable}
                                    autoFocus={isCepEditable}
                                />
                                <button type="button" onClick={() => handleEditClick("CEP")} className={styles.toggleButton}>
                                    {isCepEditable ? <Image src={dEditIcon} alt="Stop editing" className={styles.editIcon} /> : <Image src={editIcon} alt="Edit" className={styles.editIcon} />}
                                </button>
                            </div>
                        </div>
                    </div>                       
                </div>
                <div className={styles.buttonContainer}>
                    <button className={styles.changePasswordButton}>Alterar senha</button>
                    <button type="submit" className={styles.saveChangesButton}>Salvar mudanças</button>
                </div>
            </form>
        </div>
    </div>
    );
}
