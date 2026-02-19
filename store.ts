import {
  configureStore,
  createSlice,
  PayloadAction,
  createAsyncThunk,
  isAnyOf,
} from "@reduxjs/toolkit";
import { Invoice, Centre, Societe } from "./types";
import { apiService } from "./services/apiService";

// --- ACTIONS ASYNCHRONES : AUTHENTIFICATION ---

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; pass: string }, { rejectWithValue }) => {
    try {
      return await apiService.post("/auth/login", credentials);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || { message: "Connexion impossible." },
      );
    }
  },
);

export const signupThunk = createAsyncThunk(
  "auth/signup",
  async (
    userData: { nom: string; email: string; pass: string },
    { rejectWithValue },
  ) => {
    try {
      return await apiService.post("/auth/signup", userData);
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Inscription impossible." },
      );
    }
  },
);

// --- ACTIONS ASYNCHRONES : FACTURES ---

export const fetchInvoices = createAsyncThunk(
  "invoices/fetchAll",
  async (userId: string) => {
    return await apiService.get(`/factures/${userId}`);
  },
);

export const addInvoiceThunk = createAsyncThunk(
  "invoices/add",
  async (invoice: Omit<Invoice, "id">, { rejectWithValue }) => {
    try {
      return await apiService.post("/factures", invoice);
    } catch (err) {
      console.log(err.message);
      return rejectWithValue(err.message || "Erreur d'ajout Facture");
    }
  },
);

export const updateInvoiceThunk = createAsyncThunk(
  "invoices/update",
  async (invoice: Invoice, { rejectWithValue }) => {
    try {
      return await apiService.put(
        `/factures/${invoice._id}/${invoice.userId}`,
        invoice,
      );
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Mise à jour impossible." },
      );
    }
  },
);

export const deleteInvoiceThunk = createAsyncThunk(
  "invoices/delete",
  async (credentials: { id: string; userId: string }, { rejectWithValue }) => {
    try {
      await apiService.delete(
        `/factures/${credentials.id}/${credentials.userId}`,
      );
      return credentials.id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Suppression impossible." },
      );
    }
  },
);

// --- ACTIONS ASYNCHRONES : CENTRES ---

export const fetchCentres = createAsyncThunk(
  "centres/fetchAll",
  async (userId: String, { rejectWithValue }) => {
    try {
      return await apiService.get(`/centres/${userId}`);
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Impossible de charger les centres." },
      );
    }
  },
);

export const addCentreThunk = createAsyncThunk(
  "centres/add",
  async (centre: Omit<Centre, "id">, { rejectWithValue }) => {
    try {
      return await apiService.post("/centres", centre);
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Impossible d'ajouter le centre." },
      );
    }
  },
);

export const updateCentreThunk = createAsyncThunk(
  "centres/update",
  async (centre: Centre, { rejectWithValue }) => {
    try {
      return await apiService.put(`/centres/${centre.id}`, centre);
    } catch (err) {
      return rejectWithValue(
        err.response?.data || {
          message: "Impossible de mettre à jour le centre.",
        },
      );
    }
  },
);

export const deleteCentreThunk = createAsyncThunk(
  "centres/delete",
  async (credentials: { id: string; userId: string }, { rejectWithValue }) => {
    try {
      console.log("Deleting centre with credentials:", credentials);
      await apiService.delete(
        `/centres/${credentials.id}/${credentials.userId}`,
      );
      return credentials.id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Impossible de supprimer le centre." },
      );
    }
  },
);

// --- SLICES ---

interface AuthState {
  user: Societe | null;
  status: "idle" | "loading" | "failed";
  activeFlow: "login" | "signup" | null;
  error: string | null;
}

const initialAuth: AuthState = {
  user: JSON.parse(localStorage.getItem("factupro_user") || "null"),
  status: "idle",
  activeFlow: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuth,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("factupro_user");
      state.status = "idle";
      state.activeFlow = null;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
      if (state.status === "failed") state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = "loading";
        state.activeFlow = "login";
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem("factupro_user", JSON.stringify(action.payload));
        state.status = "idle";
        state.activeFlow = null;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = "failed";
        state.activeFlow = "login";
        state.error =
          (action.payload as any)?.message ||
          action.error.message ||
          "Connexion impossible.";
      })
      .addCase(signupThunk.pending, (state) => {
        state.status = "loading";
        state.activeFlow = "signup";
        state.error = null;
      })
      .addCase(signupThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem("factupro_user", JSON.stringify(action.payload));
        state.status = "idle";
        state.activeFlow = null;
        state.error = null;
      })
      .addCase(signupThunk.rejected, (state, action) => {
        state.status = "failed";
        state.activeFlow = "signup";
        state.error =
          (action.payload as any)?.message ||
          action.error.message ||
          "Inscription impossible.";
      });
  },
});
export const { logout, clearAuthError } = authSlice.actions;

interface InvoiceState {
  items: Invoice[];
  isLoading: boolean;
}

const initialInvoices: InvoiceState = {
  items: [],
  isLoading: false,
};

const invoiceSlice = createSlice({
  name: "invoices",
  initialState: initialInvoices,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchInvoices.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(addInvoiceThunk.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateInvoiceThunk.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (i) => i._id === action.payload._id,
        );
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteInvoiceThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i._id !== action.payload);
      })
      .addCase(logout, (state) => {
        state.items = [];
        state.isLoading = false;
      });
  },
});

interface CentreState {
  items: Centre[];
}

const initialCentres: CentreState = {
  items: [],
};

const centreSlice = createSlice({
  name: "centres",
  initialState: initialCentres,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCentres.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addCentreThunk.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateCentreThunk.fulfilled, (state, action) => {
        const index = state.items.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteCentreThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      })
      .addCase(logout, (state) => {
        state.items = [];
      });
  },
});
// --- NOTIFICATION SLICE ---

interface NotificationState {
  message: string | null;
  type: "error" | "success" | "info";
}

const initialNotification: NotificationState = {
  message: null,
  type: "info",
};
const notificationSlice = createSlice({
  name: "notification",
  initialState: initialNotification,
  reducers: {
    showNotification: (
      state,
      action: PayloadAction<{
        message: string;
        type?: "error" | "success" | "info";
      }>,
    ) => {
      state.message = action.payload.message;
      state.type = action.payload.type || "info";
    },
    hideNotification: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    // Intercepter toutes les actions rejetées pour afficher une erreur automatiquement
    builder.addMatcher(
      (action) => action.type.endsWith("/rejected"),
      (state, action: any) => {
        // Ignorer les erreurs d'auth car elles sont gérées localement dans les formulaires
        if (!action.type.startsWith("auth/")) {
          state.message =
            action.payload || "Une erreur inattendue est survenue.";
          state.type = "error";
        }
      },
    );
    // Afficher un succès pour certaines actions
    builder.addMatcher(
      isAnyOf(
        addInvoiceThunk.fulfilled,
        addCentreThunk.fulfilled,
        deleteInvoiceThunk.fulfilled,
        deleteCentreThunk.fulfilled,
      ),
      (state, action) => {
        let msg = "Opération réussie";
        if (action.type.includes("add")) msg = "Élément ajouté avec succès";
        if (action.type.includes("delete")) msg = "Élément supprimé";
        state.message = msg;
        state.type = "success";
      },
    );
  },
});

export const { showNotification, hideNotification } = notificationSlice.actions;

//FIN NOTIF SLICE
interface UIState {
  theme: "light" | "dark";
}

const initialUI: UIState = {
  theme: (localStorage.getItem("factupro_theme") as "light" | "dark") || "dark",
};

const uiSlice = createSlice({
  name: "ui",
  initialState: initialUI,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("factupro_theme", state.theme);
    },
  },
});

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
    invoices: invoiceSlice.reducer,
    centres: centreSlice.reducer,
    notification: notificationSlice.reducer,
  },
});

export const { toggleTheme } = uiSlice.actions;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
