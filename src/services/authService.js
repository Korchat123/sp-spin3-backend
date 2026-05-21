import api from "../utils/api";

export const loginAPI = async (username, password) => {
  try {
    const response = await api.post("/auth/login", { username, password });
    // Assuming the backend returns an object with a token and user info
    if (response.token) {
      localStorage.setItem("token", response.token);
    }
    return response;
  } catch (err) {
    console.error("Auth Service Error:", err);
    throw new Error(err.message || "ระบบตรวจสอบข้อมูลขัดข้อง");
  }
};
