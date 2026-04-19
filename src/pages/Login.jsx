import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(email, motDePasse);
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      navigate("/dashboard");
    } catch (error) {
      setError("Email ou mot de passe incorrect.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">

      {/* Panneau gauche — décoratif */}
      <div className="hidden lg:flex w-1/2 bg-indigo-950 flex-col justify-between p-12">
        <div className="text-white text-xl font-semibold tracking-tight">
          <image src="" alt="Logo EC2LT" className="w-32 mb-8" />
        </div>
        <div>
          <p className="text-indigo-300 text-sm uppercase tracking-widest mb-4">
            Plateforme académique
          </p>
          <h1 className="text-white text-4xl font-bold leading-tight mb-6">
            Gérez vos projets,<br />
            suivez vos tâches.
          </h1>
          <p className="text-indigo-400 text-base leading-relaxed max-w-sm">
            Un espace centralisé pour organiser vos projets académiques,
            assigner des tâches et collaborer efficacement.
          </p>
        </div>
        <p className="text-indigo-600 text-xs">
        </p>
      </div>

      {/* Panneau droit — formulaire */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <p className="lg:hidden text-indigo-900 text-lg font-semibold mb-8">
            UniProjet
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">
          
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            Connectez-vous à votre espace
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Adresse email
              </label>
              <input
                type="email"
                placeholder="vous@exemple.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-950 focus:ring-1 focus:ring-indigo-500 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mot de passe
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-950 focus:ring-1 focus:ring-indigo-500 transition"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full  bg-indigo-950 hover:bg-indigo-500 text-white text-sm font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Pas encore de compte ?{" "}
            <Link
              to="/register"
              className="text-indigo-500 font-medium hover:underline"
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}