import { useState } from "react";

function TacheForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    utilisateur_id: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ titre: "", description: "", utilisateur_id: "" });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
      <h4 className="text-sm font-semibold text-gray-800 mb-4">
        Ajouter une tâche
      </h4>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Titre
          </label>
          <input
            type="text"
            name="titre"
            placeholder="Ex : Créer le modèle de données"
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
            placeholder="Décrivez la tâche..."
            value={formData.description}
            onChange={handleChange}
            required
            rows={2}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            ID de l'utilisateur assigné
          </label>
          <input
            type="number"
            name="utilisateur_id"
            placeholder="Ex : 3"
            value={formData.utilisateur_id}
            onChange={handleChange}
            required
            min={1}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-900 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition"
        >
          Ajouter la tâche
        </button>
      </form>
    </div>
  );
}

export default TacheForm;