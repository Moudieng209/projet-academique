import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await register(form.name, form.email, form.password);
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      navigate("/dashboard");
    } catch (err) {
      setError("Erreur lors de l'inscription. Vérifiez vos informations.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">

      {/* Panneau gauche */}
      <div className="hidden lg:flex w-1/2 bg-indigo-950 flex-col justify-between p-12">
        <div className="text-white text-xl font-semibold tracking-tight">
        </div>
        <div>
          <p className="text-indigo-300 text-sm uppercase tracking-widest mb-4">
            Plateforme académique
          </p>
          <h1 className="text-white text-4xl font-bold leading-tight mb-6">
            Rejoignez la<br />
            plateforme.
          </h1>
          <p className="text-indigo-400 text-base leading-relaxed max-w-sm">
            Créez votre compte en quelques secondes et commencez à gérer vos projets académiques dès aujourd'hui.
          </p>
        </div>
        <p className="text-indigo-600 text-xs">
        </p>
      </div>

      {/* Panneau droit */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          

          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Créer un compte
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            C'est gratuit et rapide
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nom complet
              </label>
              <input
                type="text"
                name="name"
                placeholder="Ismaïla Ly"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-950 focus:ring-1 focus:ring-indigo-500 transition"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Adresse email
              </label>
              <input
                type="email"
                name="email"
                placeholder="ismaila@exemple.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-950 focus:ring-1 focus:ring-indigo-500 transition"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mot de passe
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-950 focus:ring-1 focus:ring-indigo-500 transition"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
              />
              <p className="text-xs text-gray-400 mt-1.5">Minimum 6 caractères</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-950 hover:bg-indigo-500 text-white text-sm font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Création en cours..." : "Créer mon compte"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Déjà un compte ?{" "}
            <Link to="/" className="text-indigo-600 font-medium hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}