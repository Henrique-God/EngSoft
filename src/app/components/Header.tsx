'use client'
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import styles from "./Header.module.css";
import Image from "next/image";
import decodeToken from "@/src/app/components/TokenDecoder";
import logo from "@/src/assets/logo.png";
import { GetAllTitlesHandler } from "./conecctionBackendWiki";
import adminImg from "@/src/assets/admin.jpg";
import fiscalImg from "@/src/assets/fiscal.jpg";
import moradorImg from "@/src/assets/morador.jpg";

// Import Font Awesome Icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [allSuggestions, setAllSuggestions] = useState<string[]>([]);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [username, setUsername] = useState<string | null>(null);
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    
    const searchWrapperRef = useRef<HTMLDivElement | null>(null); // Reference to search wrapper

    const router = useRouter(); // Use useRouter for navigation

    useEffect(() => {
        setIsClient(true);

        const fetchTitles = async () => {
            try {
                const response = await GetAllTitlesHandler();
                if (response.success) {
                    if (response.titles) {
                        setAllSuggestions(response.titles);
                    }
                } else {
                    console.error("Failed to fetch titles:", response.error);
                }
            } catch (error) {
                console.error("Error fetching titles:", error);
            }
        };

        if (!isClient) return;

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
    }, [isClient]);

    // Close suggestion list if clicked outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target as Node)) {
                setSuggestions([]); // Close suggestions
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSuggestionClick = (suggestion: string) => {
        setSearchQuery(suggestion); // Update the input with the clicked suggestion
        setSuggestions([]); // Close the suggestion list
        router.push(`/wiki/${suggestion.toLowerCase().replace(/\s+/g, "-")}`); // Navigate to the suggestion's link
    };

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
            const filteredSuggestions = allSuggestions.filter((item) =>
                item.toLowerCase().includes(query.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    const handleSearchSubmit = () => {
        setSuggestions([]); // Close the suggestion list
        const queryString = encodeURIComponent(JSON.stringify(suggestions)); // Encode the suggestions
        router.push(`/search_results?suggestions=${queryString}`);
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
            <div className={styles.search_wrapper} ref={searchWrapperRef}> {/* Add ref here */}
                <form onSubmit={(e) => e.preventDefault()}>

                    <input
                        type="text"
                        placeholder="Busque..."
                        value={searchQuery}
                        onChange={handleInputChange}
                        className={styles.search_input}
                    />
                    <button
                        type="button"
                        className={styles.search_button}
                        onClick={handleSearchSubmit}
                    >
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>

                </form>
                {suggestions.length > 0 && (
                    <div className={styles.suggestions}>
                        {suggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                className={styles.suggestion_item}
                                onClick={() => handleSuggestionClick(suggestion)}
                            >
                                {suggestion}
                            </li>
                        ))}
                    </div>
                )}
            </div>
            <div className={styles.buttons_wrapper}>
                {isSignedIn ? (
                    <>
                        <div className={styles.user_info}>
                        <Link href="/account">
                            <Image
                                src={profilePic || getDefaultProfilePic()}
                                alt="Profile Picture"
                                width={40}
                                height={40}
                                className={styles.profile_pic}
                            />
                            </Link>
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
        </div>
    );
}
