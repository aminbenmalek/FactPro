import React, { useState, useEffect } from "react";
import { Centre } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "../store"; // Assurez-vous que le chemin est correct
interface CentreFormProps {
  onSave: (centre: Omit<Centre, "id">) => void;
  onCancel: () => void;
  centres: Centre[];
  centre?: Centre;
}

const CentreForm: React.FC<CentreFormProps> = ({
  onSave,
  onCancel,
  centres,
  centre,
}) => {
  // Replace 'RootState' with the actual type of your Redux root state if different

  const authState = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<Omit<Centre, "id">>({
    code: "",
    name: "",
    address: "",
    description: "",
    referenceSteg: "",
    referenceSonede: "",
    userId: authState.user.id,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (centre) {
      setFormData({
        code: centre.code || "",
        name: centre.name,
        address: centre.address,
        description: centre.description || "",
        referenceSteg: centre.referenceSteg || "",
        referenceSonede: centre.referenceSonede || "",
        userId: authState.user?.id || "",
      });
    }
  }, [centre]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    alert(authState.user.id);
    const normalizedCode = formData.code.trim().toUpperCase();

    if (!formData.name || !formData.address || !normalizedCode) return;

    // Vérification de l'unicité du code
    const isCodeDuplicate = centres.some(
      (c) =>
        c.code.trim().toUpperCase() === normalizedCode && c.id !== centre?.id,
    );

    if (isCodeDuplicate) {
      setError(
        `Le code "${normalizedCode}" est déjà utilisé par un autre centre.`,
      );
      return;
    }

    console.log("Form data ready to save:", {
      ...formData,
      code: normalizedCode,
    });
    onSave({
      ...formData,
      code: normalizedCode,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/30 text-white">
          <h3 className="text-lg font-bold">
            {centre ? "Modifier le centre" : "Nouveau centre"}
          </h3>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
        >
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1 text-white">
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                Code
              </label>
              <input
                type="text"
                className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-sm focus:outline-none focus:ring-2 font-mono ${
                  error
                    ? "border-red-500 ring-red-500/20"
                    : "border-slate-700 focus:ring-blue-500"
                }`}
                placeholder="ex: C01"
                value={formData.code}
                onChange={(e) => {
                  setFormData({ ...formData, code: e.target.value });
                  setError(null);
                }}
                required
              />
            </div>
            <div className="col-span-2 text-white">
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                Nom du centre
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ex: Bureau Nord"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-900/20 text-red-400 px-3 py-2 rounded-lg text-[11px] font-bold flex items-center gap-2">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <div className="text-white">
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
              Adresse
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ex: Rue de Palestine, Tunis"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-white">
              <label className="block text-xs font-semibold text-orange-500 uppercase mb-1">
                Réf. Facture STEG
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="ex: 123456"
                value={formData.referenceSteg}
                onChange={(e) =>
                  setFormData({ ...formData, referenceSteg: e.target.value })
                }
              />
            </div>
            <div className="text-white">
              <label className="block text-xs font-semibold text-blue-500 uppercase mb-1">
                Réf. Facture SONEDE
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ex: 654321"
                value={formData.referenceSonede}
                onChange={(e) =>
                  setFormData({ ...formData, referenceSonede: e.target.value })
                }
              />
            </div>
          </div>

          <div className="text-white">
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[60px]"
              placeholder="Notes sur ce centre..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2 border border-slate-700 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-lg transition-all active:scale-95"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CentreForm;
