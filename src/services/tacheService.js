import API from "../api/axiosConfig";

export const getTaches = (projetId) => API.get(`/projets/${projetId}/taches`);

export const addTache = (projetId, data) => API.post(`/projets/${projetId}/taches`, data);

export const updateStatut = (tacheId, statut) =>
  API.put(`/taches/${tacheId}/statut`, { statut });

export const deleteTache = (tacheId) => API.delete(`/taches/${tacheId}`);
