import API from "../api/axiosConfig";

export const login = async (email, password) => {
  const response = await API.post("/login", { email, password });
  return response.data;
};

export const register = async (name, email, password) => {
  const response = await API.post("/register", { name, email, password });
  return response.data;
};

export const logout = async () => {
  try {
    await API.post("/logout");
  } catch (e) {
    console.error("Erreur logout:", e);
  } finally {
    localStorage.removeItem("token");
  }
};
