const baseUrl = "http://localhost:5036/api/";

export interface ImgInsertResponse {
    success: boolean;
    error?: string;
    id?: string;
    path?: string;
}

export async function ImgInsertHandler(image: string): Promise<ImgInsertResponse> {
    try {
        const url = new URL(`${baseUrl}wiki/images/insert`);
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

        return { success: true, path: data.path, id: data.id };
    } catch (error) {
        console.error("Error while logging in:", error);
        return { success: false, error: (error as Error).message };
    }
}