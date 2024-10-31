"use client"

import Link from "next/link";
import Image from 'next/image';
import React, { Component, useState } from 'react';
import morador from '@/src/assets/morador.jpg';
import editIcon from '@/src/assets/icons/pencil-svgrepo-com.svg';
import dEditIcon from '@/src/assets/icons/pencil-slash-svgrepo-com.svg';
import styles from "./page.module.css";
import SideNav from '@/src/app/components/sidenav';
import Header from '@/src/app/components/Header';


export default function Account(){
    const [nomeValue, setNomeValue] = useState("Nome Completo");
    const [cargoValue, setCargoValue] = useState("Morador");
    const [cpfValue, setCpfValue] = useState("CPF");
    const [emailValue, setEmailValue] = useState("Email");
    const [telefoneValue, setTelefoneValue] = useState("Telefone");
    const [cepValue, setCepValue] = useState("CEP");
    const [enderecoValue, setEnderecoValue] = useState("Endereço");
    const [bairroValue, setBairroValue] = useState("Bairro");
    const [cidadeValue, setCidadeValue] = useState("Cidade");
    const [estadoValue, setEstadoValue] = useState("Estado");

    const cargoOptions = ["Morador", "Fiscal", "Administrador"];
    const [fileUploaded, setFileUploaded] = useState('');
    const [accountVerified, setAccountVerified] = useState(false);
    const [shouldShowDiv, setShouldShowDiv] = useState(false);
    const [shouldShowAlert, setShouldShowAlert] = useState(!accountVerified);
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfError, setPdfError] = useState(false)
    


    const [isNomeEditable, setIsNomeEditable] = useState(false);
    const [inputNomeValue, setInputNomeValue] = useState(nomeValue);
    const [isCargoEditable, setIsCargoEditable] = useState(false);
    const [inputCargoValue, setInputCargoValue] = useState(cargoValue);
    const [isEmailEditable, setIsEmailEditable] = useState(false);
    const [inputEmailValue, setInputEmailValue] = useState(emailValue);
    const [isTelefoneEditable, setIsTelefoneEditable] = useState(false);
    const [inputTelefoneValue, setInputTelefoneValue] = useState(telefoneValue);
    const [isCepEditable, setIsCepEditable] = useState(false);
    const [inputCepValue, setInputCepValue] = useState(cepValue);
    const [isEnderecoEditable, setIsEnderecoEditable] = useState(false);
    const [inputEnderecoValue, setInputEnderecoValue] = useState(enderecoValue);
    const [isBairroEditable, setIsBairroEditable] = useState(false);
    const [inputBairroValue, setInputBairroValue] = useState(bairroValue);
    const [isCidadeEditable, setIsCidadeEditable] = useState(false);
    const [inputCidadeValue, setInputCidadeValue] = useState(cidadeValue);
    const [isEstadoEditable, setIsEstadoEditable] = useState(false);
    const [inputEstadoValue, setInputEstadoValue] = useState(estadoValue);

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
        } else if (value === "Telefone") {
            if  (isTelefoneEditable) {
                setInputTelefoneValue(telefoneValue);
            } else {
                setInputTelefoneValue("");
            }
            setIsTelefoneEditable(!isTelefoneEditable);
        } else if (value === "CEP") {
            if  (isCepEditable) {
                setInputCepValue(cepValue);
            } else {
                setInputCepValue("");
            }
            setIsCepEditable(!isCepEditable);
        } else if (value === "Endereço") {
            if  (isEnderecoEditable) {
                setInputEnderecoValue(enderecoValue);
            } else {
                setInputEnderecoValue("");
            }
            setIsEnderecoEditable(!isEnderecoEditable);
        } else if (value === "Bairro") {
            if  (isBairroEditable) {
                setInputBairroValue(bairroValue);
            } else {
                setInputBairroValue("");
            }
            setIsBairroEditable(!isBairroEditable);
        } else if (value === "Cidade") {
            if  (isCidadeEditable) {
                setInputCidadeValue(cidadeValue);
            } else {
                setInputCidadeValue("");
            }
            setIsCidadeEditable(!isCidadeEditable);
        } else if (value === "Estado") {
            if  (isEstadoEditable) {
                setInputEstadoValue(estadoValue);
            } else {
                setInputEstadoValue("");
            }
            setIsEstadoEditable(!isEstadoEditable);
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
        } else if (value === "Telefone") {
            setInputTelefoneValue(inputValue);
        } else if (value === "CEP") {
            setInputCepValue(inputValue);
        } else if (value === "Endereço") {
            setInputEnderecoValue(inputValue);
        } else if (value === "Bairro") {
            setInputBairroValue(inputValue);
        } else if (value === "Cidade") {
            setInputCidadeValue(inputValue);
        } else if (value === "Estado") {
            setInputEstadoValue(inputValue);
        } 
    };


    const handleFileChange = (e: { target: { files: any[]; }; }) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            setPdfFile(file);
            setPdfError(false)
        } else {
            setPdfFile(null);
            alert("Por favor, selecione um arquivo PDF.");
            
        }
    };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if ((inputCargoValue == "Fiscal") && !pdfFile) {
            setPdfError(true);
            alert("Por favor, adicione um PDF de comprovante.");
        } else {
            // const queryString = new URLSearchParams({ role }).toString();
            // window.location.href = `/account/register/success?${queryString}`;
        }
    };

    return (
    <div>
        <Header />
        <div style={{ display: 'flex', flexDirection: 'row', width: '100vw' }}>
            <div className="w-full flex-none md:w-40">
                <SideNav />
            </div>
            <form onSubmit={handleSubmit} className={styles.container}>
                <div className={styles.profileHeader}>
                    <div className={styles.FirstHeader}>
                        <Image src={morador} alt="Profile" className={styles.profileImage} />
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
                            <label>Telefone:</label>
                            <div className={styles.editWrapper}>
                                <input
                                    type="text"
                                    className={styles.input}
                                    onChange={(e) => handleInputChange("Telefone", e)}
                                    value={inputTelefoneValue}
                                    placeholder={telefoneValue}
                                    disabled={!isTelefoneEditable}
                                    autoFocus={isTelefoneEditable}
                                />
                                <button type="button" onClick={() => handleEditClick("Telefone")} className={styles.toggleButton}>
                                    {isTelefoneEditable ? <Image src={dEditIcon} alt="Stop editing" className={styles.editIcon} /> : <Image src={editIcon} alt="Edit" className={styles.editIcon} />}
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
                    <div className={styles.secondCol}>
                        <div className={styles.fieldRow}>
                            <label>Endereço:</label>
                            <div className={styles.editWrapper}>
                                <input
                                    type="text"
                                    className={styles.input}
                                    onChange={(e) => handleInputChange("Endereço", e)}
                                    value={inputEnderecoValue}
                                    placeholder={enderecoValue}
                                    disabled={!isEnderecoEditable}
                                    autoFocus={isEnderecoEditable}
                                />
                                <button type="button" onClick={() => handleEditClick("Endereço")} className={styles.toggleButton}>
                                    {isEnderecoEditable ? <Image src={dEditIcon} alt="Stop editing" className={styles.editIcon} /> : <Image src={editIcon} alt="Edit" className={styles.editIcon} />}
                                </button>
                            </div>
                        </div>
                        <div className={styles.fieldRow}>
                            <label>Bairro:</label>
                            <div className={styles.editWrapper}>
                                <input
                                    type="text"
                                    className={styles.input}
                                    onChange={(e) => handleInputChange("Bairro", e)}
                                    value={inputBairroValue}
                                    placeholder={bairroValue}
                                    disabled={!isBairroEditable}
                                    autoFocus={isBairroEditable}
                                />
                                <button type="button" onClick={() => handleEditClick("Bairro")} className={styles.toggleButton}>
                                    {isBairroEditable ? <Image src={dEditIcon} alt="Stop editing" className={styles.editIcon} /> : <Image src={editIcon} alt="Edit" className={styles.editIcon} />}
                                </button>
                            </div>
                        </div>
                        <div className={styles.fieldRow}>
                            <label>Cidade:</label>
                            <div className={styles.editWrapper}>
                                <input
                                    type="text"
                                    className={styles.input}
                                    onChange={(e) => handleInputChange("Cidade", e)}
                                    value={inputCidadeValue}
                                    placeholder={cidadeValue}
                                    disabled={!isCidadeEditable}
                                    autoFocus={isCidadeEditable}
                                />
                                <button type="button" onClick={() => handleEditClick("Cidade")} className={styles.toggleButton}>
                                    {isCidadeEditable ? <Image src={dEditIcon} alt="Stop editing" className={styles.editIcon} /> : <Image src={editIcon} alt="Edit" className={styles.editIcon} />}
                                </button>
                            </div>
                        </div>
                        <div className={styles.fieldRow}>
                            <label>Estado:</label>
                            <div className={styles.editWrapper}>
                                <input
                                    type="text"
                                    className={styles.input}
                                    onChange={(e) => handleInputChange("Estado", e)}
                                    value={inputEstadoValue}
                                    placeholder={estadoValue}
                                    disabled={!isEstadoEditable}
                                    autoFocus={isEstadoEditable}
                                />
                                <button type="button" onClick={() => handleEditClick("Estado")} className={styles.toggleButton}>
                                    {isEstadoEditable ? <Image src={dEditIcon} alt="Stop editing" className={styles.editIcon} /> : <Image src={editIcon} alt="Edit" className={styles.editIcon} />}
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
