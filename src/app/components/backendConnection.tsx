const baseUrl = "http://localhost:5036/api/";

export interface UserResponse {
    success: boolean;
    userName?: string;
    role?: string;
    email?: string;
    socialNumber?: string;
    phoneNumber?: string;
    zipCode?: string;
    address?: string;
    neighbor?: string;
    city?: string;
    state?: string;
    error?: string;
}

export async function UserHandler(id: string): Promise<UserResponse> {
    try {
        const url = new URL(`${baseUrl}users/${id}`);
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
            phoneNumber: data.phoneNumber,
            zipCode: data.zipCode,
            address: data.address,
            neighbor: data.neighbor,
            city: data.city,
            state: data.state,
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

export async function UpdateHandler(formData: { userName: string; 
                                                role: string;
                                                email: string;
                                                phoneNumber: string;
                                                zipCode: string;
                                                address: string;
                                                neighbor: string
                                                city: string;
                                                state: string;
                                                pdf: string; }): Promise<UpdateResponse> {
    try {
        const url = new URL(`${baseUrl}users/`);
        url.searchParams.append("userName", formData.userName);
        url.searchParams.append("role", formData.role);
        url.searchParams.append("email", formData.email);
        url.searchParams.append("phoneNumber", formData.phoneNumber);
        url.searchParams.append("zipCode", formData.zipCode);
        url.searchParams.append("address", formData.address);
        url.searchParams.append("neighbor", formData.neighbor);
        url.searchParams.append("city", formData.city);
        url.searchParams.append("state", formData.state);
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
    id?: string;
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
        return { success: true, token: data.token, id: data.id };
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

export async function CreateHandler(formData: { userName: string; 
                                                password: string;
                                                role: string;
                                                email: string;
                                                phoneNumber: string;
                                                zipCode: string;
                                                address: string;
                                                neighbor: string
                                                city: string;
                                                state: string;
                                                pdf: string; }): Promise<CreateResponse> {
    try {
        const url = new URL(`${baseUrl}users/register`);
        url.searchParams.append("userName", formData.userName);
        url.searchParams.append("password", formData.password);
        url.searchParams.append("role", formData.role);
        url.searchParams.append("email", formData.email);
        url.searchParams.append("phoneNumber", formData.phoneNumber);
        url.searchParams.append("zipCode", formData.zipCode);
        url.searchParams.append("address", formData.address);
        url.searchParams.append("neighbor", formData.neighbor);
        url.searchParams.append("city", formData.city);
        url.searchParams.append("state", formData.state);
        const response = await fetch(url.toString(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
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


export interface GetAllUserResponse {
    success: boolean;
    users?: (string)[][];
    error?: string;
}

export async function GetAllUserHandler(): Promise<GetAllUserResponse> {
    try {
        const url = new URL(`${baseUrl}users/getUsers`);
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
