'use client'; // Ensure this is a client-side component
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "./Header.module.css";
import Image from "next/image";
import logo from "@/src/assets/logo.png";
import { GetWikitHandler } from "./conecctionBackendWiki";

export default function Header() {
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isSignedIn, setIsSignedIn] = useState(false); // Track sign-in state
    const [role, setRole] = useState<string | null>(null); // Track user role
    const [wikiContent, setWikiContent] = useState<string | null>(null); // State for wiki content
    const [username, setUsername] = useState<string | null>(null); // Track username
    const [profilePic, setProfilePic] = useState<string | null>(null); // Track profile picture URL

    // Check for token and role on component mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        const userName = localStorage.getItem("username"); // Assuming username is stored in localStorage
        const userProfilePic = localStorage.getItem("profilePic"); // Assuming profilePic is stored in localStorage

        setIsSignedIn(!!token); // Update state based on token existence
        setUsername(userName); // Set username from localStorage if present
        setProfilePic(userProfilePic); // Set profilePic from localStorage if present
    }, []);

    // Handle sign out
    const handleSignOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        localStorage.removeItem("profilePic"); // Remove profile pic when signing out
        setIsSignedIn(false);
        setRole(null); // Clear role from state
        setUsername(null); // Clear username from state
        setProfilePic(null); // Clear profile pic from state
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

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Search query:", searchQuery);
        const response = await GetWikitHandler(searchQuery);
        if (response.success) {
            setWikiContent(response.content); // Update the state with the content
        } else {
            setWikiContent(null); // Reset content if the search fails
            alert(response.error || "Search failed");
        }
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
                            {profilePic && (
                                <Image
                                    src={profilePic}
                                    alt="Profile Picture"
                                    width={40}
                                    height={40}
                                    className={styles.profile_pic} // Add a class to style the image
                                />
                            )}
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

            {/* Display the wiki content */}
            {wikiContent && (
                <div className={styles.wiki_content}>
                    <h3>Wiki Content:</h3>
                    <p>{wikiContent}</p>
                </div>
            )}
        </div>
    );
}
