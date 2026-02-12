
import { GoogleGenAI } from "@google/genai";
import { Invoice, Centre } from "../types";

// Always use a named parameter for apiKey and get it exclusively from process.env.API_KEY.
// This instance is used to communicate with the Gemini API.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyse la consommation des factures en utilisant le modèle Gemini 3 Pro.
 * Cette fonction prend les factures et les centres pour fournir un diagnostic détaillé
 * sur les tendances de consommation et proposer des économies.
 * 
 * @param invoices Liste des factures à analyser
 * @param centres Liste des centres de facturation
 */
export const analyzeConsumption = async (invoices: Invoice[], centres: Centre[]) => {
  if (!invoices || invoices.length === 0) {
    return "Aucune donnée de facture n'est disponible pour l'analyse. Veuillez ajouter des factures pour commencer.";
  }

  // Constructing a detailed prompt for complex data analysis
  const prompt = `En tant qu'expert en audit énergétique en Tunisie, analyse les données de facturation suivantes (STEG et SONEDE) pour les centres de gestion. 
  Identifie les tendances de consommation mensuelles, les anomalies potentielles par rapport aux moyennes du secteur, et propose des recommandations concrètes pour réduire les coûts.
  
  Liste des centres : ${JSON.stringify(centres)}
  Liste des factures : ${JSON.stringify(invoices)}
  
  Rédige ton analyse en français de manière structurée et professionnelle.`;

  try {
    // Using gemini-3-pro-preview for complex reasoning over financial and utility data.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });

    // Access the text property directly as per Google GenAI SDK guidelines.
    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "L'analyse intelligente est momentanément indisponible. Veuillez vérifier votre connexion ou réessayer plus tard.";
  }
};

/**
 * Fournit une interface de chat intelligente pour répondre aux questions de l'utilisateur
 * sur ses factures et sa consommation.
 * 
 * @param message La question de l'utilisateur
 * @param invoices Le contexte des factures actuelles
 */
export const chatWithAssistant = async (message: string, invoices: Invoice[]) => {
  const prompt = `Tu es l'Expert FactuPro TN, un assistant intelligent spécialisé dans la gestion des factures d'électricité (STEG) et d'eau (SONEDE) en Tunisie. 
  Tu as accès aux données suivantes sur les factures de l'utilisateur : ${JSON.stringify(invoices)}
  
  Réponds à la question suivante de l'utilisateur en te basant sur ces données si possible, sinon donne des conseils généraux de gestion.
  
  Question : ${message}
  
  Sois concis, précis et réponds exclusivement en français.`;

  try {
    // Using gemini-3-pro-preview for high-quality conversational logic.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });

    // Access the text property directly as per Google GenAI SDK guidelines.
    return response.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Désolé, je rencontre des difficultés techniques pour vous répondre. Veuillez réessayer dans quelques instants.";
  }
};

/**
 * Placeholder pour la génération de logo.
 */
export const generateAppLogo = async () => null;
