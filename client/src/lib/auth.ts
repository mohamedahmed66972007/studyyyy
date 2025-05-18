import { apiRequest } from "./queryClient";

interface AdminCredentials {
  username: string;
  password: string;
}

export const login = async (credentials: AdminCredentials): Promise<boolean> => {
  try {
    const response = await apiRequest("POST", "/api/auth/login", credentials);
    const data = await response.json();
    
    if (response.ok && data.success) {
      localStorage.setItem("isAdmin", "true");
      document.cookie = "connect.sid=" + data.sessionId + "; path=/";
      return true;
    }
    return false;
  } catch (error) {
    console.error("Login failed:", error);
    return false;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await apiRequest("POST", "/api/auth/logout", {});
    localStorage.removeItem("isAdmin");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

export const checkAdminStatus = (): boolean => {
  return localStorage.getItem("isAdmin") === "true";
};
