'use client'; // Ensure this is a client-side component
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "./Header.module.css";
import Image from "next/image";
import logo from "@/src/assets/logo.png";

export default function Header() {
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isSignedIn, setIsSignedIn] = useState(false); // Track sign-in state

    // Check for token on component mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsSignedIn(!!token); // Update state based on token existence
    }, []);

    // Handle sign out
    const handleSignOut = () => {
        localStorage.removeItem("token");
        setIsSignedIn(false);
        // Optional: Redirect to the home or sign-in page
    };

    // Handle input change and filter suggestions
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Filter suggestions based on query
        if (query) {
            const filteredSuggestions = allSuggestions.filter(item =>
                item.toLowerCase().includes(query.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]); // Clear suggestions if the input is empty
        }
    };

    const allSuggestions = [
        'Mosquito', 'São José do Rio Preto', 'Dengue', 'Perifocal', 'Focal', 
        'Nebulização', 'Prevenção', 'Casos', 'Anchieta', 'Setor Censitário', 
        'Casos por Área', 'Estatística'
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Search query:", searchQuery);
        // Add search functionality here later
    };

    return (
        <div className={styles.header_wrapper}>
            <Link href="/" passHref>
                <div className={styles.logo_title_wrapper}>
                    <Image src={logo} alt="Mosquito" width={300} height={140} />
                </div>
            </Link>
            <div className={styles.search_wrapper}>
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Busque..."
                        value={searchQuery}
                        onChange={handleInputChange}
                        className={styles.search_input}
                    />
                    <button type="submit" className={styles.search_button}>Search</button>
                </form>
                {suggestions.length > 0 && (
                    <div className={styles.suggestions}>
                        {suggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                className={styles.suggestion_item}
                                onClick={() => {
                                    setSearchQuery(suggestion);
                                    setSuggestions([]);
                                }}
                            >
                                {suggestion}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className={styles.buttons_wrapper}>
                {isSignedIn ? (
                    <button onClick={handleSignOut} className={styles.sign_out}>
                        Sign Out
                    </button>
                ) : (
                    <>
                        <Link className={styles.sign_in} href="/account/signin">Sign in</Link>
                        <Link className={styles.register} href="/account/register">Register</Link>
                    </>
                )}
            </div>
        </div>
    );
}
