const baseUrl = "http://localhost:5036/";

export async function CreateHandler(formData: { userName: string; 
    password: string;
    role: string;
    email: string;
    zipCode: string;
    socialNumber: number; }): Promise<CreateResponse> {
    try {
        const url = new URL(`${baseUrl}users/register`);
        const response = await fetch(url.toString(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData)
        });
        if (!response.ok) {
            return { success: false, error: response.statusText };
        }
        const data = await response.json();

        return { success: true, token: data.token, id: data.id };
    } catch (error) {
        console.error("Error while logging in:", error);
        return { success: false, error: (error as Error).message };
    }
}

export interface AddPhotoResponse {
    success: boolean;
    error?: string;
}

export async function AddPhotoHandler(profilePic?: string): Promise<AddPhotoResponse> {
    try {
        const url = new URL(`${baseUrl}users/`);
        if(profilePic) url.searchParams.append("profilePic", profilePic);
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
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export interface UserResponse {
    success: boolean;
    userName?: string;
    role?: string;
    email?: string;
    socialNumber?: string;
    zipCode?: string;
    profilePic?: string;
    error?: string;
}

export async function UserHandler(nameid: string): Promise<UserResponse> {
    try {
        console.log(nameid)

        const url = new URL(`${baseUrl}users/get-user`);
        if(nameid) url.searchParams.append("userName", nameid);
        const token = localStorage.getItem("token");
        const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            return { success: false, error: response.statusText };
        }
        const data = await response.json();
        return {
            success: true,
            userName: data.userName, 
            role: data.role,
            email: data.email,
            socialNumber: data.socialNumber,
            zipCode: data.zipCode,
            profilePic: data.profilePic,
        };
    } catch (error) {
        console.error("Error getting user:", error);
        return { success: false, error: (error as Error).message };
    }
}

export interface UpdateResponse {
    success: boolean;
    error?: string;
}

export async function UpdateHandler(formData: { userName?: string; 
                                                role?: string;
                                                email?: string;
                                                zipCode?: string; }): Promise<UpdateResponse> {
    try {
        const url = new URL(`${baseUrl}users/update-user`);
        if(formData.userName) url.searchParams.append("userName", formData.userName);
        if(formData.role) url.searchParams.append("role", formData.role);
        if(formData.email) url.searchParams.append("email", formData.email);
        if(formData.zipCode) url.searchParams.append("zipCode", formData.zipCode);
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
        return { success: true };
    } catch (error) {
        console.error("Error while logging in:", error);
        return { success: false, error: (error as Error).message };
    }
}


export interface LoginResponse {
    success: boolean;
    token?: string;
    error?: string;
}

export async function LoginHandler(formData: { userName: string; password: string }): Promise<LoginResponse> {
    try {
        const url = new URL(`${baseUrl}users/login`);
        url.searchParams.append("userName", formData.userName);
        url.searchParams.append("password", formData.password);
        const response = await fetch(url.toString(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });
        if (!response.ok) {
            return { success: false, error: response.statusText };
        }
        const data = await response.json();
        return { success: true, token: data.token};
    } catch (error) {
        console.error("Error while logging in:", error);
        return { success: false, error: (error as Error).message };
    }
}


export interface CreateResponse {
    success: boolean;
    error?: string;
    id?: string;
    token?: string;
}

export interface GetAllUserResponse {
    success: boolean;
    users?: (string)[][];
    error?: string;
}

export interface WikiPageSuggestion {
    id: number;
    pageText: string;
    pageTitle: string;
    ownerName: string;
    createdAt: string;
    updatedAt: string;
}

export async function SearchWikiPageHandler(pageTitle: string): Promise<WikiPageSuggestion[]> {
    try {
        const url = new URL(`${baseUrl}wiki-pages/search-pages/${pageTitle}`);
        
        const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return [];  // Return an empty array in case of error (could also throw error if needed)
        }

        const data = await response.json();

        return data; // Assuming the server returns a list of wiki page suggestions
    } catch (error) {
        console.error("Error fetching wiki page suggestions:", error);
        return [];  // Return empty array in case of error
    }
}

export async function GetAllUserHandler(): Promise<GetAllUserResponse> {
    try {
        const url = new URL(`${baseUrl}users/get-users`);
        const token = localStorage.getItem("token");
        const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            return { success: false, error: response.statusText };
        }
        const data = await response.json();
        console.log(data)
        return {
            success: true,
            users: data,
        };
    } catch (error) {
        console.error("Error getting user:", error);
        return { success: false, error: (error as Error).message };
    }
}
