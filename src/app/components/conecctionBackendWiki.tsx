const baseUrl = "http://localhost:5036/wiki-pages/";

export interface ImgInsertResponse {
    success: boolean;
    error?: string;
    path?: string;
}

export async function ImgInsertHandler(image: File[]): Promise<ImgInsertResponse> {
    try {
        const formData = new FormData();

        // Append each image to FormData with the correct field name
        image.forEach((file) => {
            formData.append('photo', file, file.name);  // 'photo' is the form field name that the backend expects
        });

        const url = `${baseUrl}add-photo`;  // Correct endpoint URL
        const token = localStorage.getItem("token");

        // Send the FormData in the body of the POST request
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,  // Make sure the token is included
            },
            body: formData,  // Send the FormData as the body
        });

        if (!response.ok) {
            return { success: false, error: response.statusText };
        }

        const data = await response.json();
        return { success: true, path: data.url };  // Assuming the response contains a URL field
    } catch (error) {
        console.error("Error while uploading image:", error);
        return { success: false, error: (error as Error).message };
    }
}

export interface CreateWikiResponse {
    success: boolean;
    error?: string;
    title?: string;
  }
  
  export async function CreateWikitHandler(formData: { wikiTitle: string; wikiText: string }): Promise<CreateWikiResponse> {
    if (!formData.wikiTitle || !formData.wikiText) {
      return { success: false, error: "Title and text are required." };
    }
  
    try {
      const url = `${baseUrl}create-page`;
      const token = localStorage.getItem("token");
  
      if (!token) {
        return { success: false, error: "Authentication token is missing." };
      }
  
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          PageTitle: formData.wikiTitle,
          PageText: formData.wikiText,
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, error: errorText || response.statusText };
      }
  
      const data = await response.json();
      return { success: true, title: data.PageTitle };
    } catch (error) {
      console.error("Error while creating the wiki:", error);
      return { success: false, error: (error as Error).message };
    }
  }

  export interface WikiPage {
    id: number;
    pageText: string;
    pageTitle: string;
    ownerName: string;
    createdAt: string;
    updatedAt: string;
    history: {
        id: number;
        pageText: string;
        pageTitle: string;
        createdAt: string;
    }[];
}

export interface GetWikiResponse {
    success: boolean;
    error?: string;
    content?: WikiPage;
}


export async function GetWikiHandler(wikiTitle: string): Promise<GetWikiResponse> {
    try {
        const url = `${baseUrl}search-pages/${wikiTitle}`;
        const token = localStorage.getItem("token");

        if (!token) {
            return { success: false, error: "Authentication token is missing." };
        }

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            return { success: false, error: `Error: ${response.status} - ${response.statusText}` };
        }

        let data;
        try {
            data = await response.json();
        } catch {
            return { success: false, error: "Invalid JSON response from server." };
        }

        if (!Array.isArray(data) || data.length === 0) {
            return { success: false, error: "Wiki page not found." };
        }

        return { success: true, content: data[0] };
    } catch (error) {
        console.error("Error while fetching wiki data:", error);
        return { success: false, error: (error as Error).message };
    }
}

export interface GetAllWikiResponse {
    success: boolean;
    error?: string;
    data?: WikiPage[];
}

export async function GetAllWikiHandler(): Promise<GetAllWikiResponse> {
    try {
        const url = `${baseUrl}get-all`;  // Route for fetching all wiki pages
        const token = localStorage.getItem("token");

        if (!token) {
            return { success: false, error: "Authentication token is missing." };
        }

        const response = await fetch(url, {
            method: "GET", // GET method for fetching data
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            return { success: false, error: response.statusText };
        }

        const data = await response.json();
        return { success: true, data: data };
    } catch (error) {
        console.error("Error while fetching all wiki pages:", error);
        return { success: false, error: (error as Error).message };
    }
}


export interface GetAllPagesResponse {
    success: boolean;
    error?: string;
    pages?: any[]; // Just a flat array of pages
    }

export async function GetAllPagestHandler(): Promise<GetAllPagesResponse> {
    try {
        const url = new URL(`${baseUrl}get-pages`);
        const token = localStorage.getItem("token");
        if (!token) {
            return { success: false, error: "No token found" };
        }
        const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const errorDetails = await response.text();
            return { success: false, error: `${response.statusText} - ${errorDetails}` };
        }
        const data = await response.json();
        return { success: true, pages: data }; // Assuming the response has a 'pages' field
    } catch (error) {
        console.error("Error:", error);
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
        console.error("Error:", error);
        return { success: false, error: (error as Error).message };
    }
}

export interface GetTitlesResponse {
    success: boolean;
    error?: string;
    titles?: string[];
}

export async function GetAllTitlesHandler(): Promise<GetTitlesResponse> {
    try {
        const url = `${baseUrl}get-titles`; // Route for fetching validated wiki titles
        const token = localStorage.getItem("token");

        if (!token) {
            return { success: false, error: "Authentication token is missing." };
        }

        const response = await fetch(url, {
            method: "GET", // GET method for fetching data
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            return { success: false, error: response.statusText };
        }

        const data = await response.json();
        return { success: true, titles: data }; // Titles returned as a string array
    } catch (error) {
        console.error("Error while fetching titles:", error);
        return { success: false, error: (error as Error).message };
    }
}
