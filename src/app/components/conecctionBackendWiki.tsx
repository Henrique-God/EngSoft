const baseUrl = "http://localhost:5036/wiki-pages/";

export interface ImgInsertResponse {
    success: boolean;
    error?: string;
    path?: string;
}

export async function ImgInsertHandler(image: string): Promise<ImgInsertResponse> {
    try {
        const url = new URL(`${baseUrl}add-photo`);
        url.searchParams.append("image", image);
        const token = localStorage.getItem("token");
        const response = await fetch(url.toString(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,

            },
        });
        if (!response.ok) {
            return { success: false, error: response.statusText };
        }
        const data = await response.json(); 

        return { success: true, path: data.picture };
    } catch (error) {
        console.error("Error while logging in:", error);
        return { success: false, error: (error as Error).message };
    }
}



export interface CreateWikiResponse {
    success: boolean;
    error?: string;
    title?: string;
}

export async function CreateWikitHandler(formData: { wikiTitle: string; wikiText: string }): Promise<CreateWikiResponse> {
    try {
        const url = new URL(`${baseUrl}create-page`);
        url.searchParams.append("PageText", formData.wikiText);
        url.searchParams.append("PageTitle", formData.wikiTitle);
        const token = localStorage.getItem("token");
        const response = await fetch(url.toString(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,

            },
        });
        if (!response.ok) {
            return { success: false, error: response.statusText };
        }
        const data = await response.json();

        return { success: true, title: data[0].PageTitle};
    } catch (error) {
        console.error("Error while logging in:", error);
        return { success: false, error: (error as Error).message };
    }
}


export interface GetWikiResponse {
    success: boolean;
    error?: string;
    content?: string;
}

export async function GetWikiHandler(wikiTitle: string): Promise<GetWikiResponse> {
    try {
        const url = new URL(`${baseUrl}search-pages/`);
        url.searchParams.append("PageTitle", wikiTitle);
        const token = localStorage.getItem("token");
        const response = await fetch(url.toString(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,

            },
        });
        if (!response.ok) {
            return { success: false, error: response.statusText };
        }
        const data = await response.json();

        return { success: true, content: data[0]};
    } catch (error) {
        console.error("Error while logging in:", error);
        return { success: false, error: (error as Error).message };
    }
}


export interface GetAllPagesResponse {
    success: boolean;
    error?: string;
    pages?: (any)[][];
}

export async function GetAllPagestHandler(): Promise<GetAllPagesResponse> {
    try {
        const url = new URL(`${baseUrl}get-all;`);
        const token = localStorage.getItem("token");
        const response = await fetch(url.toString(), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,

            },
        });
        if (!response.ok) {
            return { success: false, error: response.statusText };
        }
        const data = await response.json();

        return { success: true, pages: data};
    } catch (error) {
        console.error("Error while logging in:", error);
        return { success: false, error: (error as Error).message };
    }
}


export interface ApprovePageResponse {
    success: boolean;
    error?: string;
    page?: (any)[];
}

export async function ApprovePageHandler(wikiId: string): Promise<ApprovePageResponse> {
    try {
        const url = new URL(`${baseUrl}approve/${wikiId}`);
        const token = localStorage.getItem("token");
        const response = await fetch(url.toString(), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,

            },
        });
        if (!response.ok) {
            return { success: false, error: response.statusText };
        }
        const data = await response.json();

        return { success: true, page: data};
    } catch (error) {
        console.error("Error while logging in:", error);
        return { success: false, error: (error as Error).message };
    }
}