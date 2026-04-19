import { useState, useEffect } from "react";

function ProjetForm({ onSubmit, selected, onCancel }) {
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    date_debut: "",
    date_fin: "",
  });

  useEffect(() => {
    if (selected) {
      setFormData({
        titre: selected.titre || "",
        description: selected.description || "",
        date_debut: selected.date_debut?.slice(0, 10) || "",
        date_fin: selected.date_fin?.slice(0, 10) || "",
      });
    } else {
      setFormData({ titre: "", description: "", date_debut: "", date_fin: "" });
    }
  }, [selected]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    if (!selected) {
      setFormData({ titre: "", description: "", date_debut: "", date_fin: "" });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
      <h4 className="text-base font-semibold text-gray-800 mb-5">
        {selected ? "Modifier le projet" : "Nouveau projet"}
      </h4>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Titre
          </label>
          <input
            type="text"
            name="titre"
            placeholder="Ex : Application de gestion des notes"
            value={formData.titre}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Décrivez brièvement le projet..."
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-900 focus:ring-1 focus:ring-indigo-500 transition resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Date de début
            </label>
            <input
              type="date"
              name="date_debut"
              value={formData.date_debut}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-indigo-900 focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Date de fin
            </label>
            <input
              type="date"
              name="date_fin"
              value={formData.date_fin}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-indigo-900 focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition ${
              selected
                ? "bg-amber-500 hover:bg-amber-600"
                : "bg-indigo-900 hover:bg-indigo-500"
            }`}
          >
            {selected ? "Enregistrer les modifications" : "Créer le projet"}
          </button>

          {selected && (
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-500 border border-gray-200 hover:bg-gray-50 transition"
            >
              Annuler
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ProjetForm;