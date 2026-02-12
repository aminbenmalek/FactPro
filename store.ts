import {
  configureStore,
  createSlice,
  PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { Invoice, Centre, Societe } from "./types";
import { apiService } from "./services/apiService";

// --- ACTIONS ASYNCHRONES : AUTHENTIFICATION ---

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; pass: string },
    { rejectWithValue },
  ) => {
    try {
      return await apiService.post("/auth/login", credentials);
    } catch (err) {
      return rejectWithValue(apiService.toApiErrorPayload(err));
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
      return rejectWithValue(apiService.toApiErrorPayload(err));
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
  async (invoice: Omit<Invoice, "id">) => {
    return await apiService.post("/factures", invoice);
  },
);

export const updateInvoiceThunk = createAsyncThunk(
  "invoices/update",
  async (invoice: Invoice) => {
    console.log("dans store : ",invoice);
    return await apiService.put(
      `/factures/${invoice._id}/${invoice.userId}`,
      invoice,
    );
  },
);

export const deleteInvoiceThunk = createAsyncThunk(
  "invoices/delete",
  async (id: string) => {
    await apiService.delete(`/factures/${id}`);
    return id;
  },
);

// --- ACTIONS ASYNCHRONES : CENTRES ---

export const fetchCentres = createAsyncThunk(
  "centres/fetchAll",
  async (userId: String) => {
    return await apiService.get(`/centres/${userId}`);
  },
);

export const addCentreThunk = createAsyncThunk(
  "centres/add",
  async (centre: Omit<Centre, "id">) => {
    return await apiService.post("/centres", centre);
  },
);

export const updateCentreThunk = createAsyncThunk(
  "centres/update",
  async (centre: Centre) => {
    return await apiService.put(`/centres/${centre.id}`, centre);
  },
);

export const deleteCentreThunk = createAsyncThunk(
  "centres/delete",
  async (id: string) => {
    await apiService.delete(`/centres/${id}`);
    return id;
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
        const index = state.items.findIndex((i) => i._id === action.payload._id);
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
  },
});

export const { toggleTheme } = uiSlice.actions;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
