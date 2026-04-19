import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjetForm from "../components/ProjetForm";
import { FaArrowCircleLeft } from 'react-icons/fa';
import { FaUserCircle } from 'react-icons/fa';
import  {  FaCalendar, FaCalendarAlt, FaCalendarCheck, FaCalendarWeek } from 'react-icons/fa';
import {
  getProjets,
  addProjet,
  updateProjet,
  deleteProjet,
} from "../services/projetService";
import { logout } from "../services/authService";

export default function Projets() {
  const [projets, setProjets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchProjets = async () => {
    try {
      const res = await getProjets();
      setProjets(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Erreur chargement projets :", error);
      setProjets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjets();
  }, []);

  const handleSubmit = async (data) => {
    try {
      if (selected) {
        await updateProjet(selected.id, data);
        setSelected(null);
      } else {
        await addProjet(data);
      }
      fetchProjets();
    } catch (error) {
      const msg = error.response?.data?.message || "Erreur lors de l'opération";
      alert(msg);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer ce projet ? Toutes ses tâches seront supprimées.")) {
      try {
        await deleteProjet(id);
        fetchProjets();
      } catch (error) {
        const msg = error.response?.data?.message || "Suppression impossible";
        alert(msg);
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const statutBadge = (taches = []) => {
    const total = taches.length;
    if (total === 0) return <span className="text-xs text-gray-400">Aucune tâche</span>;
    const terminees = taches.filter((t) => t.statut === "termine").length;
    return (
      <span className="text-xs text-gray-500">
        {terminees}/{total} tâches terminées
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header>
      <div className=" text-indigo-900 px-6 py-4 flex justify-between items-center shadow">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm opacity-80 hover:opacity-100"
          >
            <FaArrowCircleLeft className="text-indigo-900 text-2xl("/>
          </button>
          <h1 className="text-xl font-bold">Mes Projets</h1>
        </div>
        <div className="flex items-center gap-4">
          <FaUserCircle className="text-2xl text-indigo-900"/>
          <span className="text-sm opacity-90 text-indigo-900">{user.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-gray-600 hover:text-red-600 border border-gray-200 hover:border-red-100 px-4 py-2 rounded-xl transition-all bg-white hover:bg-red-50"
          >
            Déconnexion
          </button>
        </div>
      </div>
      </header>

      <div className="max-w-5xl mx-auto p-8">
        {/* Formulaire */}
        <ProjetForm
          onSubmit={handleSubmit}
          selected={selected}
          onCancel={() => setSelected(null)}
        />

        {/* Liste */}
        {loading ? (
          <p className="text-gray-500">Chargement...</p>
        ) : projets.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center text-gray-400 shadow">
            Aucun projet pour le moment. Créez votre premier projet !
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {projets.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-5"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-800">{p.titre}</h3>
                  {p.utilisateur_id === user.id && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                      Mon projet
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {p.description}
                </p>

                <div className="text-xs text-gray-400 mb-1">
                  <FaCalendar className="inline mr-1" />
                  {p.date_debut} → {p.date_fin}
                </div>

                <div className="mb-4">{statutBadge(p.taches)}</div>

                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => navigate(`/projets/${p.id}`)}
                    className="bg-blue-900 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-sm transition"
                  >
                    Voir les tâches
                  </button>

                  {p.utilisateur_id === user.id && (
                    <>
                      <button
                        onClick={() => setSelected(p)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg text-sm transition"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm transition"
                      >
                        Supprimer
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
