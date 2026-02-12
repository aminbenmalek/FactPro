import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  RootState,
  AppDispatch,
  logout,
  clearAuthError,
  loginThunk,
  signupThunk,
  fetchInvoices,
  fetchCentres,
  addInvoiceThunk,
  updateInvoiceThunk,
  deleteInvoiceThunk,
  addCentreThunk,
  updateCentreThunk,
  deleteCentreThunk,
} from "./store";

import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import InvoiceList from "./components/InvoiceList";
import InvoiceForm from "./components/InvoiceForm";
import CentreList from "./components/CentreList";
import CentreForm from "./components/CentreForm";
import ConfirmModal from "./components/ConfirmModal";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AIAssistant from "./components/AIAssistant";
import { Invoice, Centre } from "./types";

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const user = auth.user;
  const invoices = useSelector((state: RootState) => state.invoices.items);
  const centres = useSelector((state: RootState) => state.centres.items);

  const [isInvoiceFormOpen, setIsInvoiceFormOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | undefined>(
    undefined,
  );
  const [isCentreFormOpen, setIsCentreFormOpen] = useState(false);
  const [editingCentre, setEditingCentre] = useState<Centre | undefined>(
    undefined,
  );

  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    type: "invoice" | "centre";
    id: string | null;
  }>({
    isOpen: false,
    type: "invoice",
    id: null,
  });

  // Charger les données dès que l'utilisateur est présent
  useEffect(() => {
    if (user) {
      const { id: userid } = user;

      dispatch(fetchInvoices(userid));
      if (user.id) {
        dispatch(fetchCentres(userid));
      } else {
        alert("Veuiller inscriver-vous");
      }
     
    }
  }, [user, dispatch]);

  const handleLogin = (email: string, pass: string) => {
    dispatch(loginThunk({ email, pass }));
  };

  const handleSignup = (nom: string, email: string, pass: string) => {
    dispatch(signupThunk({ nom, email, pass }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const saveInvoice = (invoiceData: Omit<Invoice, "id">) => {
    if (editingInvoice) {
      dispatch(
        updateInvoiceThunk({
          ...invoiceData,
          id: editingInvoice.id,
        } as Invoice),
      );
    } else {
      dispatch(addInvoiceThunk(invoiceData));
    }
    setIsInvoiceFormOpen(false);
    setEditingInvoice(undefined);
  };

  const saveCentre = (centreData: Omit<Centre, "id">) => {
    if (editingCentre) {
      dispatch(
        updateCentreThunk({ ...centreData, id: editingCentre._id } as Centre),
      );
    } else {
      dispatch(addCentreThunk(centreData));
    }
    setIsCentreFormOpen(false);
    setEditingCentre(undefined);
  };

  const executeDelete = () => {
    const { type, id } = deleteModalState;
    if (!id) return;
    if (type === "invoice") dispatch(deleteInvoiceThunk(id));
    else dispatch(deleteCentreThunk(id));
    setDeleteModalState({ isOpen: false, type: "invoice", id: null });
  };

  return (
    <Router>
      {!user ? (
        <Routes>
          <Route
            path="/login"
            element={
              <Login
                onLogin={handleLogin}
                isLoading={auth.status === "loading" && auth.activeFlow === "login"}
                error={auth.activeFlow === "login" ? auth.error : null}
                onClearError={() => dispatch(clearAuthError())}
              />
            }
          />
          <Route
            path="/signup"
            element={
              <Signup
                onSignup={handleSignup}
                isLoading={auth.status === "loading" && auth.activeFlow === "signup"}
                error={auth.activeFlow === "signup" ? auth.error : null}
                onClearError={() => dispatch(clearAuthError())}
              />
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <Layout onLogout={handleLogout} user={user}>
          <Routes>
            <Route
              path="/"
              element={<Dashboard invoices={invoices} centres={centres} />}
            />
            <Route
              path="/factures"
              element={
                <InvoiceList
                  invoices={invoices}
                  centres={centres}
                  onAdd={() => setIsInvoiceFormOpen(true)}
                  onEdit={(inv) => {
                    setEditingInvoice(inv);
                    setIsInvoiceFormOpen(true);
                  }}
                  onDelete={(id) =>
                    setDeleteModalState({ isOpen: true, type: "invoice", id })
                  }
                  onTogglePaid={(id) => {
                    
                    const inv = invoices.find((i) => i._id === id);
                    if (inv){
                      //console.log(id);
                      dispatch(
                        updateInvoiceThunk({ ...inv, isPaid: !inv.isPaid }),
                      );
                    }
                  }}
                />
              }
            />
            <Route
              path="/centres"
              element={
                <CentreList
                  centres={centres}
                  invoices={invoices}
                  onAdd={() => setIsCentreFormOpen(true)}
                  onEdit={(c) => {
                    setEditingCentre(c);
                    setIsCentreFormOpen(true);
                  }}
                  onDelete={(id) =>
                    setDeleteModalState({ isOpen: true, type: "centre", id })
                  }
                />
              }
            />
            <Route
              path="/assistant"
              element={<AIAssistant invoices={invoices} centres={centres} />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {isInvoiceFormOpen && (
            <InvoiceForm
              centres={centres}
              onSave={saveInvoice}
              onCancel={() => setIsInvoiceFormOpen(false)}
              invoice={editingInvoice}
            />
          )}
          {isCentreFormOpen && (
            <CentreForm
              centres={centres}
              onSave={saveCentre}
              onCancel={() => setIsCentreFormOpen(false)}
              centre={editingCentre}
            />
          )}

          <ConfirmModal
            isOpen={deleteModalState.isOpen}
            title="Confirmer la suppression"
            message={
              deleteModalState.type === "invoice"
                ? "Supprimer définitivement cette facture ?"
                : "Supprimer ce centre et ses liaisons ?"
            }
            onConfirm={executeDelete}
            onCancel={() =>
              setDeleteModalState({ isOpen: false, type: "invoice", id: null })
            }
            variant="danger"
          />
        </Layout>
      )}
    </Router>
  );
};

export default App;
