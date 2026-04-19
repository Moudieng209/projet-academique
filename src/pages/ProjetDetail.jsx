import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TacheForm from "../components/TacheForm";
import { getProjet } from "../services/projetService";
import { FaArrowCircleLeft } from 'react-icons/fa';
import { FaUserCircle } from 'react-icons/fa';
import { FaArrowAltCircleLeft } from "react-icons/fa";
import {
  getTaches,
  addTache,
  updateStatut,
  deleteTache,
} from "../services/tacheService";
import { logout } from "../services/authService";

const STATUTS = ["en_attente", "en_cours", "termine"];

const statutConfig = {
  en_attente: {
    label: "En attente",
    classes: "bg-gray-100 text-gray-500",
  },
  en_cours: {
    label: "En cours",
    classes: "bg-amber-50 text-amber-600",
  },
  termine: {
    label: "Terminée",
    classes: "bg-emerald-50 text-emerald-600",
  },
};

export default function ProjetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projet, setProjet] = useState(null);
  const [taches, setTaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchData = async () => {
    try {
      const [projetRes, tachesRes] = await Promise.all([
        getProjet(id),
        getTaches(id),
      ]);
      setProjet(projetRes.data);
      setTaches(Array.isArray(tachesRes.data) ? tachesRes.data : []);
    } catch (error) {
      console.error("Erreur chargement :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAddTache = async (data) => {
    try {
      await addTache(id, data);
      setShowForm(false);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Erreur ajout tâche");
    }
  };

  const handleStatut = async (tacheId, statut) => {
    try {
      await updateStatut(tacheId, statut);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Modification non autorisée");
    }
  };

  const handleDelete = async (tacheId) => {
    if (window.confirm("Supprimer cette tâche ?")) {
      try {
        await deleteTache(tacheId);
        fetchData();
      } catch (error) {
        console.error("Erreur suppression tâche :", error);
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400 text-sm">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-indigo-500 rounded-full animate-spin"></div>
          Chargement du projet...
        </div>
      </div>
    );
  }

  if (!projet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-400 text-sm">Projet introuvable.</p>
      </div>
    );
  }

  const isCreateur = projet.utilisateur_id === user.id;
  const terminees = taches.filter((t) => t.statut === "termine").length;
  const pct = taches.length > 0 ? Math.round((terminees / taches.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <header >
        <div className=" text-indigo-900 px-6 py-4 flex justify-between items-center shadow">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate("/projets")}
                    className="text-sm opacity-80 hover:opacity-100"
                  >
                    <FaArrowCircleLeft className="text-indigo-900 text-2xl("/>
                  </button>
                  <h1 className="text-xl font-bold">Mes Tâches</h1>
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

      <main className="max-w-3xl mx-auto px-6 py-10">

        {/* Info projet */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{projet.titre}</h1>
            {isCreateur && (
              <span className="text-xs bg-indigo-50 text-indigo-900 px-2 py-0.5 rounded-full">
                Créateur
              </span>
            )}
          </div>
          <p className="text-gray-400 text-sm mb-3">{projet.description}</p>
          <p className="text-xs text-gray-300">
            {projet.date_debut} → {projet.date_fin}
          </p>

          {/* Progression */}
          {taches.length > 0 && (
            <div className="mt-5">
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span>{terminees}/{taches.length} tâches terminées</span>
                <span>{pct}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="bg-indigo-900 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Tâches header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-base font-semibold text-gray-800">
            Tâches
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({taches.length})
            </span>
          </h2>
          {isCreateur && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="text-sm text-indigo-900 border border-indigo-100 hover:bg-indigo-50 px-4 py-1.5 rounded-lg transition"
            >
              + Ajouter
            </button>
          )}
        </div>

        {/* Formulaire tâche */}
        {showForm && isCreateur && (
          <div className="relative">
            <TacheForm onSubmit={handleAddTache} />
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-5 right-5 text-gray-300 hover:text-gray-500 text-lg leading-none"
            >
              ×
            </button>
          </div>
        )}

        {/* Liste tâches */}
        {taches.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
            <p className="text-gray-400 text-sm">
              Aucune tâche pour ce projet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {taches.map((t) => {
              const canEdit =
                user.id === t.utilisateur_id || user.id === t.createur_id;
              const cfg = statutConfig[t.statut] || statutConfig.en_attente;

              return (
                <div
                  key={t.id}
                  className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-medium text-gray-800 text-sm">
                        {t.titre}
                      </h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.classes}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{t.description}</p>
                    {t.assigne_a && (
                      <p className="text-xs text-gray-300 mt-1">
                        Assigné à {t.assigne_a.name}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {canEdit && (
                      <select
                        value={t.statut}
                        onChange={(e) => handleStatut(t.id, e.target.value)}
                        className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none focus:border-indigo-400 transition bg-white"
                      >
                        {STATUTS.map((s) => (
                          <option key={s} value={s}>
                            {statutConfig[s].label}
                          </option>
                        ))}
                      </select>
                    )}

                    {isCreateur && (
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="text-sm text-red-400 border border-red-100 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}