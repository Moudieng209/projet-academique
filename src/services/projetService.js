import API from "../api/axiosConfig";

export const getProjets = () => API.get("/projets");

export const getProjet = (id) => API.get(`/projets/${id}`);

export const addProjet = (data) => API.post("/projets", data);

export const updateProjet = (id, data) => API.put(`/projets/${id}`, data);

export const deleteProjet = (id) => API.delete(`/projets/${id}`);
