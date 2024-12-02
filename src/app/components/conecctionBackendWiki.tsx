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
    content?: WikiPage;  // Use WikiPage structure for the response content
}


export async function GetWikitHandler(wikiTitle: string): Promise<GetWikiResponse> {
    try {
        const url = `${baseUrl}search-pages/${wikiTitle}`; // Corrected path with pageTitle
        const token = localStorage.getItem("token");

        if (!token) {
            return { success: false, error: "Authentication token is missing." };
        }

        const response = await fetch(url, {
            method: "GET", // Correct HTTP method for fetching data
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            return { success: false, error: response.statusText };
        }

        const data = await response.json();
        if (data.length === 0) {
            return { success: false, error: "Wiki page not found." };
        }

        // Assuming the response is an array, return the first element as content
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