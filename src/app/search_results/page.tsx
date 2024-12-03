"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { GetWikiHandler } from "../components/conecctionBackendWiki";
import styles from "./SearchResults.module.css";

export default function SearchResults() {
    const searchParams = useSearchParams();
    const [searchResults, setSearchResults] = useState<{ title: string; snippet: string }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const suggestionsParam = searchParams.get("suggestions");
        if (suggestionsParam) {
            const suggestions = JSON.parse(decodeURIComponent(suggestionsParam));

            const fetchResults = async () => {
                try {
                    const results = await Promise.all(
                        suggestions.map(async (suggestion: string) => {
                            const response = await GetWikiHandler(suggestion);
                            if (response.success && response.content) {
                                return {
                                    title: response.content.pageTitle,
                                    snippet: response.content.pageText.split(" ").slice(0, 20).join(" ") + "..."
                                };
                            }
                            return null;
                        })
                    );
                    setSearchResults(results.filter((result) => result !== null) as { title: string; snippet: string }[]);
                } catch (error) {
                    console.error("Error fetching search results:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchResults();
        }
    }, [searchParams]);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className={styles.search_results_wrapper}>
            <h1>Resultados da pesquisa</h1>
            <div className={styles.results}>
                {searchResults.map((result, index) => {
                    const slug = result.title.replace(/\s+/g, "-").toLowerCase(); // Create URL slug
                    return (
                        <div key={index} className={styles.result_item}>
                            <h3>
                                <Link href={`/wiki/${slug}`}>
                                    {result.title}
                                </Link>
                            </h3>
                            <p>{result.snippet}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
