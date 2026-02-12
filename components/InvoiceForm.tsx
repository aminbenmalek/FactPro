import React, { useState, useEffect } from "react";
import {
  Invoice,
  Centre,
  UtilityType,
  BillingCategory,
  PeriodType,
} from "../types";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface InvoiceFormProps {
  centres: Centre[];
  onSave: (invoice: Omit<Invoice, "id">) => void;
  onCancel: () => void;
  invoice?: Invoice;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  centres,
  onSave,
  onCancel,
  invoice,
}) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const authState = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<Partial<Invoice>>({
    type: "STEG",
    billingCategory: "ACTUAL",
    periodType: "MONTH",
    centreId: centres[0]?._id || "",
    date: new Date().toISOString().split("T")[0],
    billingMonth: new Date().toISOString().slice(0, 7),
    coveredMonths: [],
    periodStart: "",
    periodEnd: "",
    amount: 0,
    numeroFacture: "",
    isPaid: false,
    indexOld: 0,
    indexNew: 0,
    userId: authState.user?.id || "",
  });

  useEffect(() => {
    if (invoice) {
      setFormData(invoice);
      if (invoice.coveredMonths && invoice.coveredMonths.length > 0) {
        setSelectedYear(parseInt(invoice.coveredMonths[0].split("-")[0]));
      }
    }
  }, [invoice]);

  const toggleMonth = (monthNum: number) => {
    const monthStr = `${selectedYear}-${String(monthNum).padStart(2, "0")}`;
    const currentCovered = formData.coveredMonths || [];
    if (currentCovered.includes(monthStr)) {
      setFormData({
        ...formData,
        coveredMonths: currentCovered.filter((m) => m !== monthStr),
      });
    } else {
      setFormData({
        ...formData,
        coveredMonths: [...currentCovered, monthStr].sort(),
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    /*if (
      !formData.centreId ||
      formData.amount === undefined ||
      !formData.numeroFacture
    )
      return;*/

    // Validations spécifiques
    if (
      formData.periodType === "MULTI" &&
      (!formData.coveredMonths || formData.coveredMonths.length === 0)
    ) {
      alert("Veuillez sélectionner au moins un mois pour le mode Multi-Mois.");
      return;
    }
    if (
      formData.periodType === "RANGE" &&
      (!formData.periodStart || !formData.periodEnd)
    ) {
      alert("Veuillez saisir les dates de début et de fin pour la plage.");
      return;
    }

    onSave(formData as Omit<Invoice, "id">);
  };

  const consumption = (formData.indexNew || 0) - (formData.indexOld || 0);
  const unit = formData.type === "STEG" ? "kWh" : "m³";
  const monthsAbbr = [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Juin",
    "Juil",
    "Aoû",
    "Sep",
    "Oct",
    "Nov",
    "Déc",
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/30">
          <h3 className="text-lg font-bold text-slate-100">
            {invoice ? "Modifier la facture" : "Ajouter une facture"}
          </h3>
          <button
            onClick={onCancel}
            className="text-slate-500 hover:text-slate-300 transition-colors"
          >
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 max-h-[85vh] overflow-y-auto"
        >
          {/* Service & Catégorie */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                Service
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "STEG" })}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                    formData.type === "STEG"
                      ? "bg-orange-600/20 border-orange-600/50 text-orange-400"
                      : "bg-slate-800 border-slate-700 text-slate-500"
                  }`}
                >
                  <i className="fas fa-bolt mr-2"></i> STEG
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "SONEDE" })}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                    formData.type === "SONEDE"
                      ? "bg-blue-600/20 border-blue-600/50 text-blue-400"
                      : "bg-slate-800 border-slate-700 text-slate-500"
                  }`}
                >
                  <i className="fas fa-faucet mr-2"></i> SONEDE
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                Nature
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, billingCategory: "ACTUAL" })
                  }
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                    formData.billingCategory === "ACTUAL"
                      ? "bg-green-600/20 border-green-600/50 text-green-400"
                      : "bg-slate-800 border-slate-700 text-slate-500"
                  }`}
                >
                  Réelle
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, billingCategory: "PROVISIONAL" })
                  }
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                    formData.billingCategory === "PROVISIONAL"
                      ? "bg-amber-600/20 border-amber-600/50 text-amber-400"
                      : "bg-slate-800 border-slate-700 text-slate-500"
                  }`}
                >
                  Provis.
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                Centre
              </label>
              <select
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.centreId}
                onChange={(e) =>
                  setFormData({ ...formData, centreId: e.target.value })
                }
                required
              >
                {centres?.map((c) => (
                  <option key={c._id} value={c._id} className="bg-slate-900">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                N° Facture
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono"
                placeholder="Ex: 2024-5432"
                value={formData.numeroFacture}
                onChange={(e) =>
                  setFormData({ ...formData, numeroFacture: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Type de Période
              </h4>
            </div>
            <div className="flex bg-slate-900 rounded-lg border border-slate-700 p-1">
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, periodType: "MONTH" })
                }
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${formData.periodType === "MONTH" ? "bg-slate-700 text-white shadow" : "text-slate-500 hover:text-slate-300"}`}
              >
                UNIQUE
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, periodType: "MULTI" })
                }
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${formData.periodType === "MULTI" ? "bg-slate-700 text-white shadow" : "text-slate-500 hover:text-slate-300"}`}
              >
                MULTI-MOIS
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, periodType: "RANGE" })
                }
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${formData.periodType === "RANGE" ? "bg-slate-700 text-white shadow" : "text-slate-500 hover:text-slate-300"}`}
              >
                PLAGE DATES
              </button>
            </div>

            <div className="mt-4 pt-2 border-t border-slate-800/50">
              {formData.periodType === "MONTH" && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Mois unique
                  </label>
                  <input
                    type="month"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100"
                    value={formData.billingMonth}
                    onChange={(e) =>
                      setFormData({ ...formData, billingMonth: e.target.value })
                    }
                  />
                </div>
              )}

              {formData.periodType === "MULTI" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">
                      Sélectionnez les mois ({selectedYear})
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedYear((y) => y - 1)}
                        className="text-slate-400"
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      <span className="text-xs font-bold">{selectedYear}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedYear((y) => y + 1)}
                        className="text-slate-400"
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {monthsAbbr.map((m, idx) => {
                      const monthNum = idx + 1;
                      const monthStr = `${selectedYear}-${String(monthNum).padStart(2, "0")}`;
                      const isSelected =
                        formData.coveredMonths?.includes(monthStr);
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => toggleMonth(monthNum)}
                          className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${
                            isSelected
                              ? "bg-blue-600 border-blue-500 text-white"
                              : "bg-slate-800 border-slate-700 text-slate-400"
                          }`}
                        >
                          {m}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {formData.periodType === "RANGE" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Du
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100"
                      value={formData.periodStart}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          periodStart: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Au
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100"
                      value={formData.periodEnd}
                      onChange={(e) =>
                        setFormData({ ...formData, periodEnd: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                Montant (TND)
              </label>
              <input
                type="number"
                step="0.001"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm font-bold text-slate-100"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: parseFloat(e.target.value),
                  })
                }
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                Reçue le
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>
          </div>

          {formData.billingCategory === "ACTUAL" && (
            <div className="bg-blue-900/10 p-4 rounded-xl border border-blue-900/30 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-blue-500 uppercase mb-1">
                  Ancien Index
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100"
                  value={formData.indexOld}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      indexOld: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-blue-500 uppercase mb-1">
                  Nouveau Index
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100"
                  value={formData.indexNew}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      indexNew: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="col-span-2 text-[10px] text-blue-400 italic">
                Consommation :{" "}
                <span className="font-bold">
                  {consumption} {unit}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPaid"
              className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-700 rounded focus:ring-blue-500"
              checked={formData.isPaid}
              onChange={(e) =>
                setFormData({ ...formData, isPaid: e.target.checked })
              }
            />
            <label
              htmlFor="isPaid"
              className="text-sm font-medium text-slate-300"
            >
              Marquer comme payée
            </label>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 border border-slate-700 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-[2] py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-900/20 transition-all active:scale-95"
            >
              Enregistrer la facture
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceForm;
