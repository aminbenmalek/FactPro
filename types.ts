export type UtilityType = "STEG" | "SONEDE";
export type BillingCategory = "PROVISIONAL" | "ACTUAL";
export type PeriodType = "MONTH" | "RANGE" | "MULTI";

export interface Societe {
  id: string;
  nom: string;
  email: string;
  token?: string;
}

export interface Centre {
  id: string;
  code: string;
  name: string;
  address: string;
  description?: string;
  referenceSteg?: string;
  referenceSonede?: string;
  userId?: String;
}

export interface Invoice {
  _id: string;
  centreId: string;
  userId: string;
  type: UtilityType;
  billingCategory: BillingCategory;
  periodType: PeriodType;
  billingMonth?: string;
  coveredMonths?: string[]; // Liste des mois couverts (ex: ["2024-01", "2024-02"])
  numeroFacture: string;
  amount: number;
  date: string;
  periodStart?: string;
  periodEnd?: string;
  indexOld?: number;
  indexNew?: number;
  isPaid: boolean;
  notes?: string;
}

export interface DashboardStats {
  totalSteg: number;
  totalSonede: number;
  pendingCount: number;
  monthlyData: { month: string; steg: number; sonede: number }[];
}
