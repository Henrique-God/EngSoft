import { jwtDecode }  from "jwt-decode";

interface DecodedToken {
  nameid: string;
  role: string;
  expirationDate: string;
}

const decodeToken = (token: string): DecodedToken | null => {
  try {
    // Decode the JWT token
    const decoded: any = jwtDecode(token);

    // Ensure the decoded token is an object and contains the required properties
    if (decoded && typeof decoded === "object") {
      const { nameid, role, exp } = decoded;
      
      // Convert the exp (expiration timestamp) to a human-readable date
      const expirationDate = exp ? new Date(exp * 1000).toLocaleString() : "No expiration date";
      
      return { nameid, role, expirationDate };
    }

    return null;  // Return null if decoding fails or does not return an object
  } catch (err) {
    console.error("Error decoding token:", err);
    return null;
  }
};

export default decodeToken;
