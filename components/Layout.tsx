import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, toggleTheme } from "../store";
import LogoGenerator from "./LogoGenerator";
import { Societe } from "../types";
import { PAYMENT_DELAY_DAYS } from "../constants";
import NotificationToast from "./NotificationToast";

interface LayoutProps {
  children: React.ReactNode;
  user: Societe;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.ui.theme);
  const invoices = useSelector((state: RootState) => state.invoices.items);
  const centres = useSelector((state: RootState) => state.centres.items);
  const authState = useSelector((state: RootState) => state.auth);

  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [appLogo, setAppLogo] = useState<string | null>(() =>
    localStorage.getItem("factupro_custom_logo"),
  );

  // Calcul intelligent des notifications
  const notifications = useMemo(() => {
    const today = new Date();
    /*const currentMonthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
*/
    const prevMonthDate = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1,
    );

    const previousMonthStr = `${prevMonthDate.getFullYear()}-${String(
      prevMonthDate.getMonth() + 1,
    ).padStart(2, "0")}`;

    const startOfPreviousMonth = prevMonthDate;
    const endOfPreviousMonth = new Date(
      prevMonthDate.getFullYear(),
      prevMonthDate.getMonth() + 1,
      0,
    );
    const overdue = invoices.filter((inv) => {
      if (inv.isPaid) return false;
      const receptionDate = new Date(inv.date);
      const diffDays = Math.ceil(
        Math.abs(today.getTime() - receptionDate.getTime()) /
          (1000 * 60 * 60 * 24),
      );
      return diffDays > PAYMENT_DELAY_DAYS;
    });

    const missing: { centreName: string; type: "STEG" | "SONEDE" }[] = [];
    centres.forEach((centre) => {
      const checkUtility = (type: "STEG" | "SONEDE") => {
        return invoices.some((inv) => {
          if (inv.centreId !== (centre as any)._id || inv.type !== type)
            return false;

          // Cas Mois Unique
          if (
            inv.periodType === "MONTH" &&
            inv.billingMonth === previousMonthStr
          )
            return true;

          // Cas Multi-Mois
          if (
            inv.periodType === "MULTI" &&
            inv.coveredMonths?.includes(previousMonthStr)
          )
            return true;

          // Cas Plage (On vérifie si la plage chevauche le mois actuel)
          if (inv.periodType === "RANGE" && inv.periodStart && inv.periodEnd) {
            const pStart = new Date(inv.periodStart);
            const pEnd = new Date(inv.periodEnd);
            return pStart <= endOfPreviousMonth && pEnd >= startOfPreviousMonth;
          }

          return false;
        });
      };

      if (!checkUtility("STEG"))
        missing.push({ centreName: centre.name, type: "STEG" });
      if (!checkUtility("SONEDE"))
        missing.push({ centreName: centre.name, type: "SONEDE" });
    });

    return { overdue, missing, total: overdue.length + missing.length };
  }, [invoices, centres]);

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [theme]);

  const navItems = [
    { path: "/", icon: "fa-chart-line", label: "Tableau de bord" },
    { path: "/factures", icon: "fa-file-invoice-dollar", label: "Factures" },
    { path: "/centres", icon: "fa-building", label: "Centres" },
    //{ path: '/assistant', icon: 'fa-robot', label: 'Expert IA' },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 flex flex-col">
        <div className="p-6 flex-1">
          <div
            className="flex items-center gap-3 mb-8 cursor-pointer"
            onClick={() => setIsLogoModalOpen(true)}
          >
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center overflow-hidden">
              {appLogo ? (
                <img src={appLogo} className="w-full h-full object-cover" />
              ) : (
                <i className="fas fa-bolt text-white"></i>
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight dark:text-white text-slate-900">
                FactPro
              </h1>
              <p className="text-[10px] text-blue-500 font-bold uppercase">
                {authState && "SOCIETE:" + authState.user?.nom} <br />{" "}
                DEVELOPPER PAR MOHAMED AMIN
              </p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${location.pathname === item.path ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
              >
                <i className={`fas ${item.icon} w-5`}></i>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg transition-all text-xs font-bold"
          >
            <i className="fas fa-sign-out-alt"></i> Déconnexion
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4 md:px-8 md:py-6 sticky top-0 z-50 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {navItems.find((i) => i.path === location.pathname)?.label ||
              "Application"}
          </h2>

          <div className="flex items-center gap-4">
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <i
                className={`fas ${theme === "dark" ? "fa-sun" : "fa-moon"}`}
              ></i>
            </button>

            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 relative"
              >
                <i className="fas fa-bell text-slate-500"></i>
                {notifications.total > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-[10px] text-white flex items-center justify-center rounded-full font-bold animate-pulse border-2 border-white dark:border-slate-900">
                    {notifications.total}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <h3 className="text-sm font-bold">Rappels de Gestion</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.total === 0 ? (
                      <div className="p-8 text-center text-slate-500 text-sm italic">
                        Parfait ! Tout est à jour.
                      </div>
                    ) : (
                      <div className="p-2 space-y-2">
                        {notifications.missing.map((m, idx) => (
                          <div
                            key={`missing-${idx}`}
                            className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex gap-3 shadow-sm"
                          >
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${m.type === "STEG" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"}`}
                            >
                              <i
                                className={`fas ${m.type === "STEG" ? "fa-bolt" : "fa-faucet"}`}
                              ></i>
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <p className="text-xs font-black text-slate-900 dark:text-white truncate uppercase">
                                {m.centreName}
                              </p>
                              <p className="text-[10px] text-slate-500 font-bold">
                                Facture {m.type} manquante (Mois précédent)
                              </p>
                            </div>
                          </div>
                        ))}
                        {notifications.overdue.map((inv, idx) => (
                          <div
                            key={`overdue-${idx}`}
                            className="p-3 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30 flex gap-3"
                          >
                            <div className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                              <i className="fas fa-clock"></i>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-red-800 dark:text-red-300">
                                Paiement en retard
                              </p>
                              <p className="text-[10px] text-red-600 dark:text-red-400">
                                N°: {inv.numeroFacture} •{" "}
                                {inv.amount.toFixed(3)} DT
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8" onClick={() => setIsNotifOpen(false)}>
          {children}
        </div>
      </main>

      <LogoGenerator
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        onLogoSelected={(url) => {
          setAppLogo(url);
          localStorage.setItem("factupro_custom_logo", url);
          setIsLogoModalOpen(false);
        }}
      />
      <NotificationToast />
    </div>
  );
};

export default Layout;
