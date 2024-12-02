const baseUrl = "http://localhost:5036/";

// CreateHandler: Handles user registration
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
    url?: string; 
}

export async function AddPhotoHandler(profilePicUrl?: string): Promise<AddPhotoResponse> {
    try {
        const url = new URL(`${baseUrl}users/add-photo`);
        const token = localStorage.getItem("token");

        if (!profilePicUrl) {
            return { success: false, error: "No photo URL provided" };
        }

        const imageResponse = await fetch(profilePicUrl);
        if (!imageResponse.ok) {
            return { success: false, error: "Failed to fetch image" };
        }

        const imageBlob = await imageResponse.blob();

        const formData = new FormData();
        formData.append("photo", imageBlob, "profile-picture.jpg"); 
        const uploadResponse = await fetch(url.toString(), {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            body: formData, 
        });

        if (!uploadResponse.ok) {
            return { success: false, error: uploadResponse.statusText };
        }

        const data = await uploadResponse.json();

        if (data.url) {
            // Store the URL of the uploaded profile picture in localStorage
            localStorage.setItem("profilePic", data.url);
            return { success: true, url: data.url };
        } else {
            return { success: false, error: "No URL returned from server" };
        }
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}


// UserHandler: Fetches user data from the backend
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
        const url = new URL(`${baseUrl}users/get-user`);
        if (nameid) url.searchParams.append("userName", nameid);
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

// UpdateHandler: Handles user data update
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
        if (formData.userName) url.searchParams.append("userName", formData.userName);
        if (formData.role) url.searchParams.append("role", formData.role);
        if (formData.email) url.searchParams.append("email", formData.email);
        if (formData.zipCode) url.searchParams.append("zipCode", formData.zipCode);
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
        console.error("Error while updating:", error);
        return { success: false, error: (error as Error).message };
    }
}

// LoginHandler: Handles user login
export interface LoginResponse {
    success: boolean;
    token?: string;
    error?: string;
    role?: string;  // Add role here if it is part of the response
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
        
        // Store token and role in localStorage
        console.log("Login successful");
        console.log("Token:", data.token);
        console.log("Role:", data.role);  // Print the role
        localStorage.setItem("token", data.token);  // Store the token in localStorage
        localStorage.setItem("role", data.role);  // Store the role in localStorage
        
        return { success: true, token: data.token, role: data.role };
    } catch (error) {
        console.error("Error while logging in:", error);
        return { success: false, error: (error as Error).message };
    }
}

// GetAllUserHandler: Fetches all users from the backend
export interface GetAllUserResponse {
    success: boolean;
    users?: (string)[][];
    error?: string;
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
        return {
            success: true,
            users: data,
        };
    } catch (error) {
        console.error("Error getting users:", error);
        return { success: false, error: (error as Error).message };
    }
}

// Utility function to get role from localStorage
export function getRoleFromLocalStorage(): string | null {
    return localStorage.getItem("role");
}

