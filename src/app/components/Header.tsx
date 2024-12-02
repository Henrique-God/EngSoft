'use client'; // Ensure this is a client-side component
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "./Header.module.css";
import Image from "next/image";
import decodeToken from "@/src/app/components/TokenDecoder";
import logo from "@/src/assets/logo.png";
import { GetWikitHandler, GetAllTitlesHandler } from "./conecctionBackendWiki";
import adminImg from "@/src/assets/admin.jpg";
import fiscalImg from "@/src/assets/fiscal.jpg";
import moradorImg from "@/src/assets/morador.jpg";

export default function Header() {
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [allSuggestions, setAllSuggestions] = useState<string[]>([]);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [username, setUsername] = useState<string | null>(null);
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [wikiContent, setWikiContent] = useState<string | null>(null);

    useEffect(() => {
        const fetchTitles = async () => {
            try {
                const response = await GetAllTitlesHandler();
                if (response.success) {
                    if (response.content) {
                    setAllSuggestions(response.content);
                    }
                } else {
                    console.error("Failed to fetch titles:", response.error);
                }
            } catch (error) {
                console.error("Error fetching titles:", error);
            }
        };

        const token = localStorage.getItem("token");
        const decodedToken = token ? decodeToken(token) : null;
        if (decodedToken) {
            setUsername(decodedToken.nameid);
            setRole(decodedToken.role);
        }

        const userProfilePic = localStorage.getItem("profilePic");
        setIsSignedIn(!!token);
        setProfilePic(userProfilePic);

        fetchTitles();
    }, []);

    const handleSignOut = () => {
        localStorage.clear();
        setIsSignedIn(false);
        setUsername(null);
        setProfilePic(null);
        setRole(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query) {
            const filteredSuggestions = allSuggestions.filter(item =>
                item.toLowerCase().includes(query.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await GetWikitHandler(searchQuery);
            if (response.success) {
                setWikiContent(response.content);
            } else {
                setWikiContent(null);
                alert(response.error || "Search failed");
            }
        } catch (error) {
            console.error("Error during search:", error);
            alert("An error occurred. Please try again.");
        }
    };

    const getDefaultProfilePic = () => {
        if (role === "ADMIN") return adminImg;
        if (role === "OPERATOR") return fiscalImg;
        return moradorImg;
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
                    <>
                        <div className={styles.user_info}>
                            <Image
                                src={profilePic || getDefaultProfilePic()}
                                alt="Profile Picture"
                                width={40}
                                height={40}
                                className={styles.profile_pic}
                            />
                            <span className={styles.username}>{username}</span>
                        </div>
                        <button onClick={handleSignOut} className={styles.sign_in}>
                            Sign Out
                        </button>
                    </>
                ) : (
                    <>
                        <Link className={styles.sign_in} href="/account/signin">Sign in</Link>
                        <Link className={styles.register} href="/account/register">Register</Link>
                    </>
                )}
            </div>

            {wikiContent && (
                <div className={styles.wiki_content}>
                    <h3>Wiki Content:</h3>
                    <p>{wikiContent}</p>
                </div>
            )}
        </div>
    );
}
