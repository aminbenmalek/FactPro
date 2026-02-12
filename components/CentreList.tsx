
import React from 'react';
import { Centre, Invoice } from '../types';

interface CentreListProps {
  centres: Centre[];
  invoices: Invoice[];
  onAdd: () => void;
  onEdit: (centre: Centre) => void;
  onDelete: (id: string) => void;
}

const CentreList: React.FC<CentreListProps> = ({ centres, invoices, onAdd, onEdit, onDelete }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-slate-400 text-sm">Gérez les différents sites ou centres de facturation.</p>
        <button 
          onClick={onAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 transition-all shadow-md shadow-blue-950/20"
        >
          <i className="fas fa-plus"></i>
          <span>Nouveau Centre</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {centres.map(centre => {
          const centreInvoices = invoices.filter(i => i.centreId === centre.id);
          const stegSum = centreInvoices.filter(i => i.type === 'STEG').reduce((s, i) => s + i.amount, 0);
          const sonedeSum = centreInvoices.filter(i => i.type === 'SONEDE').reduce((s, i) => s + i.amount, 0);

          return (
            <div key={centre.id} className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 hover:border-blue-500/50 transition-all group relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-800 text-slate-500 rounded-xl flex items-center justify-center text-xl group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors">
                    <i className="fas fa-building"></i>
                  </div>
                  <div>
                    <span className="inline-block px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] font-bold rounded uppercase tracking-wider mb-1">
                      Code: {centre.code}
                    </span>
                    <h4 className="text-lg font-bold text-slate-100 line-clamp-1">{centre.name}</h4>
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
                  <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Cumul STEG</span>
                  <span className="text-sm font-bold text-orange-400">{stegSum.toFixed(3)} TND</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Cumul SONEDE</span>
                  <span className="text-sm font-bold text-blue-400">{sonedeSum.toFixed(3)} TND</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-dashed border-slate-800">
                  <span className="text-xs text-slate-500 font-medium">{centreInvoices.length} factures totales</span>
                  <button className="text-xs font-bold text-blue-400 hover:text-blue-300 hover:underline">
                    Détails <i className="fas fa-chevron-right ml-1"></i>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CentreList;