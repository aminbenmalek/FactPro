
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Invoice, Centre } from '../types';

interface DashboardProps {
  invoices: Invoice[];
  centres: Centre[];
}

const Dashboard: React.FC<DashboardProps> = ({ invoices, centres }) => {
  const stegTotal = invoices.filter(i => i.type === 'STEG').reduce((sum, i) => sum + i.amount, 0);
  const sonedeTotal = invoices.filter(i => i.type === 'SONEDE').reduce((sum, i) => sum + i.amount, 0);
  const pendingAmount = invoices.filter(i => !i.isPaid).reduce((sum, i) => sum + i.amount, 0);

  const today = new Date();
  const prevMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);

  const previousMonthStr = `${prevMonthDate.getFullYear()}-${String(
    prevMonthDate.getMonth() + 1
  ).padStart(2, "0")}`;

  const startOfPreviousMonth = prevMonthDate;
  const endOfPreviousMonth = new Date(
    prevMonthDate.getFullYear(),
    prevMonthDate.getMonth() + 1,
    0
  );

  const missingInvoices = centres.flatMap((centre) => {
    const missing: { centre: string; type: "STEG" | "SONEDE" }[] = [];

    const hasUtility = (type: "STEG" | "SONEDE") => {
      return invoices.some((inv) => {
        if (inv.centreId !== (centre as any)._id || inv.type !== type) return false;

        if (inv.periodType === "MONTH" && inv.billingMonth === previousMonthStr)
          return true;

        if (
          inv.periodType === "MULTI" &&
          inv.coveredMonths?.includes(previousMonthStr)
        )
          return true;

        if (inv.periodType === "RANGE" && inv.periodStart && inv.periodEnd) {
          const pStart = new Date(inv.periodStart);
          const pEnd = new Date(inv.periodEnd);
          return pStart <= endOfPreviousMonth && pEnd >= startOfPreviousMonth;
        }

        return false;
      });
    };

    const hasSteg = hasUtility("STEG");
    const hasSonede = hasUtility("SONEDE");

    if (!hasSteg) missing.push({ centre: centre.name, type: "STEG" });
    if (!hasSonede) missing.push({ centre: centre.name, type: "SONEDE" });

    return missing;
  });

  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const mStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const monthlyInvoices = invoices.filter(inv => inv.billingMonth === mStr);
    return {
      name: d.toLocaleString('fr-FR', { month: 'short' }),
      STEG: monthlyInvoices.filter(inv => inv.type === 'STEG').reduce((s, inv) => s + inv.amount, 0),
      SONEDE: monthlyInvoices.filter(inv => inv.type === 'SONEDE').reduce((s, inv) => s + inv.amount, 0),
    };
  });

  return (
    <div className="space-y-8">
      {/* Alerte détaillée des noms de centres */}
      {missingInvoices.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border-l-8 border-orange-500 p-6 rounded-2xl shadow-xl animate-in slide-in-from-left-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center flex-shrink-0">
              <i className="fas fa-bell animate-bounce text-xl"></i>
            </div>
            <div className="flex-1">
              <h4 className="text-base font-black text-slate-900 dark:text-white mb-2">Rappels de saisie - {today.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Les centres suivants n'ont pas encore leurs factures enregistrées pour le mois précédent :
              </p>
              <div className="flex flex-wrap gap-2">
                {missingInvoices.map((m, i) => (
                  <span key={i} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-black border transition-colors ${m.type === 'STEG' ? 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-900/50 dark:text-orange-300' : 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-900/50 dark:text-blue-300'}`}>
                    <i className={`fas ${m.type === 'STEG' ? 'fa-bolt' : 'fa-faucet'}`}></i>
                    {m.centre} ({m.type})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border-b-4 border-orange-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center"><i className="fas fa-bolt text-2xl"></i></div>
            <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Total STEG</h3>
          </div>
          <p className="text-4xl font-black">{stegTotal.toFixed(3)} <span className="text-lg font-bold text-slate-500">TND</span></p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border-b-4 border-blue-600">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center"><i className="fas fa-faucet text-2xl"></i></div>
            <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Total SONEDE</h3>
          </div>
          <p className="text-4xl font-black">{sonedeTotal.toFixed(3)} <span className="text-lg font-bold text-slate-500">TND</span></p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border-b-4 border-red-600">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center"><i className="fas fa-clock text-2xl"></i></div>
            <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest">À Payer</h3>
          </div>
          <p className="text-4xl font-black text-red-700 dark:text-red-500">{pendingAmount.toFixed(3)} <span className="text-lg font-bold text-slate-500">TND</span></p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-md border border-slate-200 dark:border-slate-800">
        <h4 className="text-lg font-extrabold mb-8 border-l-4 border-blue-600 pl-4">Évolution Réelle</h4>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={last6Months}>
              <defs>
                <linearGradient id="colorSteg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSonede" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" className="dark:stroke-slate-800" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 700}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 700}} />
              <Tooltip contentStyle={{backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff', fontWeight: 'bold'}} />
              <Area type="monotone" dataKey="STEG" stroke="#f97316" strokeWidth={4} fillOpacity={1} fill="url(#colorSteg)" />
              <Area type="monotone" dataKey="SONEDE" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorSonede)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
