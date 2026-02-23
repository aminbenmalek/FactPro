import React, { useState } from "react";
import { Invoice, Centre, BillingCategory } from "../types";
import ConfirmModal from "./ConfirmModal";
import { PAYMENT_DELAY_DAYS } from "../constants";
import ExportModal from "./ExportModal";

interface InvoiceListProps {
  invoices: Invoice[];
  centres: Centre[];
  onAdd: () => void;
  onEdit: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
  onTogglePaid: (id: string) => void;
}

const InvoiceList: React.FC<InvoiceListProps> = ({
  invoices,
  centres,
  onAdd,
  onEdit,
  onDelete,
  onTogglePaid,
}) => {
  const [filterType, setFilterType] = useState<"ALL" | "STEG" | "SONEDE">(
    "ALL",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const today = new Date();

  const [confirmPaymentState, setConfirmPaymentState] = useState<{
    isOpen: boolean;
    invoice: Invoice | null;
  }>({
    isOpen: false,
    invoice: null,
  });

  const isOverdue = (inv: Invoice) => {
    if (inv.isPaid) return false;
    const receptionDate = new Date(inv.date);
    const diffDays = Math.ceil(
      Math.abs(today.getTime() - receptionDate.getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return diffDays > PAYMENT_DELAY_DAYS;
  };

  const filteredInvoices = invoices
    .filter((inv) => {
      const matchesType = filterType === "ALL" || inv.type === filterType;

      const centre = centres.find((c) => c._id === inv.centreId);
      const matchesSearch =
        inv.numeroFacture.toLowerCase().includes(searchTerm.toLowerCase()) ||
        centre?.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const formatPeriod = (inv: Invoice) => {
    if (inv.periodType === "MONTH" && inv.billingMonth) {
      const [year, month] = inv.billingMonth.split("-");
      return (
        <span className="flex items-center gap-1">
          <i className="fas fa-calendar-day text-[10px] opacity-60"></i>
          {month}/{year}
        </span>
      );
    }
    if (
      inv.periodType === "MULTI" &&
      inv.coveredMonths &&
      inv.coveredMonths.length > 0
    ) {
      const sorted = [...inv.coveredMonths].sort();
      const first = sorted[0].split("-");
      const last = sorted[sorted.length - 1].split("-");
      return (
        <span className="flex items-center gap-1">
          <i className="fas fa-layer-group text-[10px] opacity-60"></i>
          {first[1]} → {last[1]} / {first[0]}
        </span>
      );
    }
    if (inv.periodType === "RANGE" && inv.periodStart && inv.periodEnd) {
      const start = new Date(inv.periodStart).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
      });
      const end = new Date(inv.periodEnd).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
      return (
        <span className="flex items-center gap-1">
          <i className="fas fa-arrows-alt-h text-[10px] opacity-60"></i>
          {start} au {end}
        </span>
      );
    }
    return "-";
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onAdd}
              className="px-6 py-3 bg-blue-700 dark:bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-800 flex items-center gap-2 shadow-lg transition-all active:scale-95"
            >
              <i className="fas fa-plus"></i>
              <span>Nouvelle Facture</span>
            </button>
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="px-6 py-3 bg-emerald-600 dark:bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 flex items-center gap-2 shadow-lg transition-all active:scale-95"
            >
              <i className="fas fa-file-export"></i>
              <span>Exporter</span>
            </button>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              {["ALL", "STEG", "SONEDE"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t as any)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filterType === t ? "bg-white dark:bg-slate-700 text-blue-700 dark:text-white shadow-sm" : "text-slate-600 dark:text-slate-400"}`}
                >
                  {t === "ALL" ? "Tous" : t}
                </button>
              ))}
            </div>
          </div>
          <div className="relative flex-1 lg:max-w-md">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
            <input
              type="text"
              placeholder="Rechercher par N° ou Centre..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse w-full table-auto ">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider">
                  Facture / Période
                </th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider">
                  Centre
                </th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {paginatedInvoices.map((inv) => {
                const overdue = isOverdue(inv);
                const centre = centres.find((c) => c._id === inv.centreId);
                return (
                  <tr
                    key={inv.id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${overdue ? "bg-red-50 dark:bg-red-900/10" : ""}`}
                  >
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase ${inv.type === "STEG" ? "bg-orange-600 text-white" : "bg-blue-600 text-white"}`}
                      >
                        <i
                          className={`fas ${inv.type === "STEG" ? "fa-bolt" : "fa-faucet"}`}
                        ></i>{" "}
                        {inv.type +
                          " REF:" +
                          (inv?.type === "STEG"
                            ? centre?.referenceSteg
                            : centre?.referenceSonede)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold flex items-center gap-2">
                        {inv.numeroFacture}
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded border ${inv.billingCategory === "ACTUAL" ? "border-green-500/30 text-green-500" : "border-amber-500/30 text-amber-500"}`}
                        >
                          {inv.billingCategory === "ACTUAL"
                            ? "Réelle"
                            : "Provis."}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full inline-block mt-1">
                        {formatPeriod(inv)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold">
                        {centre?.name}
                      </div>
                      <div className="text-[9px] text-slate-400">
                        Réf:{" "}
                        {inv.type === "STEG"
                          ? centre?.referenceSteg
                          : centre?.referenceSonede}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-slate-900 dark:text-white">
                      {inv.amount.toFixed(3)} DT
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          setConfirmPaymentState({ isOpen: true, invoice: inv })
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold border ${inv.isPaid ? "bg-green-100 dark:bg-green-900/20 text-green-700 border-green-200" : "bg-red-100 dark:bg-red-900/20 text-red-700 border-red-200"}`}
                      >
                        <i
                          className={`fas ${inv.isPaid ? "fa-check-circle" : "fa-times-circle"}`}
                        ></i>
                        {inv.isPaid ? "Payée" : "Impayée"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(inv)}
                        className="p-2 text-slate-400 hover:text-blue-500"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() =>
                          onDelete({ id: inv._id, userId: inv.userId })
                        }
                        className="p-2 text-slate-400 hover:text-red-500"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-500 font-medium">
              Affichage de{" "}
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              à{" "}
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {Math.min(currentPage * itemsPerPage, filteredInvoices.length)}
              </span>{" "}
              sur{" "}
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {filteredInvoices.length}
              </span>{" "}
              factures
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <i className="fas fa-chevron-left text-xs"></i>
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${currentPage === i + 1 ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700"}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <i className="fas fa-chevron-right text-xs"></i>
              </button>
            </div>
          </div>
        )}
      </div>
      <ConfirmModal
        isOpen={confirmPaymentState.isOpen}
        title="Paiement"
        message="Changer le statut de paiement ?"
        onConfirm={() => {
          if (confirmPaymentState.invoice)
            onTogglePaid(confirmPaymentState.invoice._id);
          setConfirmPaymentState({ isOpen: false, invoice: null });
        }}
        onCancel={() =>
          setConfirmPaymentState({ isOpen: false, invoice: null })
        }
        variant="info"
      />
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        invoices={invoices}
        centres={centres}
      />
    </div>
  );
};

export default InvoiceList;
