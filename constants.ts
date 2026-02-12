
import { Centre, Invoice } from './types';

export const PAYMENT_DELAY_DAYS = 20;

export const INITIAL_CENTRES: Centre[] = [
  { 
    id: '1', 
    code: 'C001', 
    name: 'Siège Social', 
    address: 'Avenue Habib Bourguiba, Tunis', 
    description: 'Bureau principal',
    referenceSteg: '123456789',
    referenceSonede: '987654321'
  },
  { 
    id: '2', 
    code: 'C002', 
    name: 'Dépôt Sousse', 
    address: 'Zone Industrielle, Sousse', 
    description: 'Entrepôt logistique',
    referenceSteg: '456123789',
    referenceSonede: '321654987'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv1',
    centreId: '1',
    type: 'STEG',
    billingCategory: 'ACTUAL',
    periodType: 'MONTH',
    billingMonth: '2023-11',
    numeroFacture: 'REF-2023-001',
    amount: 145.5,
    date: '2023-11-15',
    isPaid: true
  },
  {
    id: 'inv2',
    centreId: '1',
    type: 'SONEDE',
    billingCategory: 'ACTUAL',
    periodType: 'MONTH',
    billingMonth: '2023-11',
    numeroFacture: 'REF-W-2023-04',
    amount: 45.2,
    date: '2023-11-20',
    isPaid: false
  },
  {
    id: 'inv3',
    centreId: '2',
    type: 'STEG',
    billingCategory: 'ACTUAL',
    periodType: 'MONTH',
    billingMonth: '2023-12',
    numeroFacture: 'REF-2023-002',
    amount: 320.0,
    date: '2023-12-05',
    isPaid: false
  }
];

export const MONTHS = [
  'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 
  'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'
];
