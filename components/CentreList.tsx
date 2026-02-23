import React, { useState } from "react";
import { Centre, Invoice } from "../types";

interface CentreListProps {
  centres: Centre[];
  invoices: Invoice[];
  onAdd: () => void;
  onEdit: (centre: Centre) => void;
  onDelete: (id: string) => void;
}

const CentreList: React.FC<CentreListProps> = ({
  centres,
  invoices,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(centres.length / itemsPerPage);
  const filteredCentres = centres
    .filter((centre) => {
      const matchesSearch = centre?.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const paginatedCentres = filteredCentres.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-slate-400 text-sm">
          Gérez les différents sites ou centres de facturation.
        </p>
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 transition-all shadow-md shadow-blue-950/20"
        >
          <i className="fas fa-plus"></i>
          <span>Nouveau Centre</span>
        </button>
      </div>
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
          <div className="relative flex-1 lg:max-w-md">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
            <input
              type="text"
              placeholder="Rechercher Centre..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedCentres.map((centre) => {
          const centreInvoices = invoices.filter(
            (i) => i.centreId === centre._id,
          );
          const stegSum = centreInvoices
            .filter((i) => i.type === "STEG")
            .reduce((s, i) => s + i.amount, 0);
          const sonedeSum = centreInvoices
            .filter((i) => i.type === "SONEDE")
            .reduce((s, i) => s + i.amount, 0);

          return (
            <div
              key={centre.id}
              className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 hover:border-blue-500/50 transition-all group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-800 text-slate-500 rounded-xl flex items-center justify-center text-xl group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors">
                    <i className="fas fa-building"></i>
                  </div>
                  <div>
                    <span className="inline-block px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] font-bold rounded uppercase tracking-wider mb-1">
                      Code: {centre.code}
                    </span>
                    <h4 className="text-lg font-bold text-slate-100 line-clamp-1">
                      {centre.name}
                    </h4>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(centre)}
                    className="p-1.5 text-slate-500 hover:text-blue-400 transition-colors bg-slate-800 rounded-lg border border-transparent hover:border-blue-900/50"
                    title="Modifier"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    onClick={() => onDelete(centre.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 transition-colors bg-slate-800 rounded-lg border border-transparent hover:border-red-900/50"
                    title="Supprimer"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>

              <p className="text-slate-400 text-xs mb-4 flex items-center gap-1 line-clamp-1">
                <i className="fas fa-map-marker-alt text-blue-500"></i>
                {centre.address}
              </p>

              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                    Référence STEG
                  </span>
                  <span className="text-sm font-bold text-orange-400">
                    {centre.referenceSteg
                      ? centre.referenceSteg
                      : "Non specifiée"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                    Référence SONEDE
                  </span>
                  <span className="text-sm font-bold text-blue-400">
                    {centre.referenceSonede
                      ? centre.referenceSonede
                      : "Non specifiée"}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-dashed border-slate-800">
                  <span className="text-xs text-slate-500 font-medium">
                    {centreInvoices.length} factures totales
                  </span>
                  <button className="text-xs font-bold text-blue-400 hover:text-blue-300 hover:underline">
                    Détails <i className="fas fa-chevron-right ml-1"></i>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-xl border border-slate-800 text-slate-400 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${currentPage === i + 1 ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" : "border border-slate-800 text-slate-400 hover:bg-slate-800"}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-xl border border-slate-800 text-slate-400 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default CentreList;
