import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";
import { getProjets } from "../services/projetService";

export default function Dashboard() {
  const [stats, setStats] = useState({ projets: 0, taches: 0, terminees: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getProjets();
      const projets = res.data;
      const toutesLesTaches = projets.flatMap((p) => p.taches || []);
      const terminees = toutesLesTaches.filter((t) => t.statut === "termine");
      setStats({
        projets: projets.length,
        taches: toutesLesTaches.length,
        terminees: terminees.length,
      });
    } catch (error) {
      console.error("Erreur chargement statistiques :", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const progression =
    stats.taches > 0
      ? Math.round((stats.terminees / stats.taches) * 100)
      : 0;

  return (
    /* h-screen force la hauteur à 100% de la vue, w-full la largeur */
    <div className="h-screen w-full bg-gray-50 flex flex-col overflow-hidden">

      {/* Navbar - Fixée en haut */}
      <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center shrink-0">
        <span className="text-indigo-900 text-xl font-bold tracking-tight">
          EC2LT Dashboard
        </span>
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-indigo-900">{user.name}</p>
            <p className="text-sm font-semibold text-indigo-900">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-gray-600 hover:text-red-600 border border-gray-200 hover:border-red-100 px-4 py-2 rounded-xl transition-all bg-white hover:bg-red-50"
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* Zone de contenu principale - Prend tout l'espace restant (flex-1) */}
      <main className="flex-1 overflow-y-auto px-8 py-10">
        <div className="max-w-6xl mx-auto h-full flex flex-col">
          
          {/* En-tête */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bonjour, {user.name?.split(" ")[0]} 
            </h1>
            <p className="text-gray-500">
              Voici l'état actuel de vos projets et tâches.
            </p>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center gap-3 text-gray-400">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
              <span>Récupération de vos données...</span>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Cartes stats - Grid qui s'adapte */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 transition hover:shadow-md">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Projets</p>
                  <p className="text-5xl font-black text-indigo-500">{stats.projets}</p>
                  <p className="text-sm text-gray-400 mt-2">Dossiers actifs</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 transition hover:shadow-md">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Tâches</p>
                  <p className="text-5xl font-black text-indigo-500">{stats.taches}</p>
                  <p className="text-sm text-gray-400 mt-2">Assignées au total</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 transition hover:shadow-md">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Terminées</p>
                  <p className="text-5xl font-black text-indigo-500">{stats.terminees}</p>
                  <p className="text-sm text-gray-400 mt-2">Objectifs remplis</p>
                </div>
              </div>

              {/* Section Progression */}
              {stats.taches > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <p className="text-sm text-gray-400">Progression globale des tâches</p>
                    </div>
                    <p className="text-3xl font-black text-indigo-900">{progression}%</p>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-indigo-900 h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${progression}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Bouton d'action principal */}
              <div className="pt-4">
                <button
                  onClick={() => navigate("/projets")}
                  className="group bg-indigo-900 hover:bg-indigo-500 text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 flex items-center gap-3"
                >
                  Accéder à tous les projets
                  <span className="group-hover:translate-x-1 transition-transform"></span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}