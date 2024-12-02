// Page.tsx
'use client'
import { useEffect, useState } from "react";
import { GetAllWikiHandler, GetAllWikiResponse } from "@/src/app/components/conecctionBackendWiki";

export default function Page() {
    const [wikiPages, setWikiPages] = useState<string[]>([]); // Estado para armazenar os títulos das páginas
    const [error, setError] = useState<string | null>(null); // Estado para armazenar erros

    useEffect(() => {
        const fetchWikiPages = async () => {
            const response: GetAllWikiResponse = await GetAllWikiHandler();

            if (response.success) {
                const pageTitles = response.data?.map((page) => page.title) || []; // Extraindo os títulos das páginas
                setWikiPages(pageTitles);
            } else {
                setError(response.error || "Unknown error");
            }
        };

        fetchWikiPages();
    }, []);

    return (
        <div>
            <h1>Página de Aprovação da Wiki</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <ul>
                {wikiPages.map((title, index) => (
                    <li key={index}>{title}</li>
                ))}
            </ul>
        </div>
    );
}
