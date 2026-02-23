import React, { useState } from "react";
import { Invoice, Centre, UtilityType } from "../types";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoices: Invoice[];
  centres: Centre[];
}

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  invoices,
  centres,
}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCentreId, setSelectedCentreId] = useState("ALL");
  const [selectedType, setSelectedType] = useState<"ALL" | UtilityType>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<
    "ALL" | "PAID" | "UNPAID"
  >("ALL");

  if (!isOpen) return null;

  const handleExport = () => {
    let filtered = [...invoices];

    // Filter by date range (invoice date)
    if (startDate) {
      filtered = filtered.filter((inv) => inv.date >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter((inv) => inv.date <= endDate);
    }

    // Filter by centre
    if (selectedCentreId !== "ALL") {
      filtered = filtered.filter((inv) => inv.centreId === selectedCentreId);
    }

    // Filter by type
    if (selectedType !== "ALL") {
      filtered = filtered.filter((inv) => inv.type === selectedType);
    }

    // Filter by status
    if (selectedStatus === "PAID") {
      filtered = filtered.filter((inv) => inv.isPaid);
    } else if (selectedStatus === "UNPAID") {
      filtered = filtered.filter((inv) => !inv.isPaid);
    }

    // Generate CSV
    const headers = [
      "N° Facture",
      "Date Réception",
      "Service",
      "Centre",
      "Montant (DT)",
      "Période",
      "Statut",
      "Catégorie",
    ];

    const rows = filtered.map((inv) => {
      const centre = centres.find((c) => c._id === inv.centreId);
      let period = "";
      if (inv.periodType === "MONTH") period = inv.billingMonth || "";
      else if (inv.periodType === "MULTI")
        period = inv.coveredMonths?.join(", ") || "";
      else if (inv.periodType === "RANGE")
        period = `${inv.periodStart} au ${inv.periodEnd}`;

      return [
        inv.numeroFacture,
        inv.date,
        inv.type,
        centre?.name || "Inconnu",
        inv.amount.toFixed(3),
        period,
        inv.isPaid ? "Payée" : "Impayée",
        inv.billingCategory === "ACTUAL" ? "Réelle" : "Provisoire",
      ];
    });

    const csvContent = [
      headers.join(";"),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(";")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `export_factures_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/30 text-white">
          <h3 className="text-lg font-bold">Exporter les factures</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                Date Début
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white outline-none focus:ring-2 focus:ring-blue-500"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                Date Fin
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white outline-none focus:ring-2 focus:ring-blue-500"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              Centre
            </label>
            <select
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCentreId}
              onChange={(e) => setSelectedCentreId(e.target.value)}
            >
              <option value="ALL">Tous les centres</option>
              {centres.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                Service
              </label>
              <select
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as any)}
              >
                <option value="ALL">Tous</option>
                <option value="STEG">STEG</option>
                <option value="SONEDE">SONEDE</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                Statut
              </label>
              <select
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
              >
                <option value="ALL">Tous</option>
                <option value="PAID">Payées</option>
                <option value="UNPAID">Impayées</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-slate-700 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleExport}
              className="flex-[2] py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-900/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <i className="fas fa-file-export"></i>
              <span>Exporter en CSV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
