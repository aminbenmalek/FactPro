
import React, { useState, useEffect, useRef } from 'react';
import { Invoice, Centre } from '../types';
import { analyzeConsumption, chatWithAssistant } from '../services/geminiService';

interface AIAssistantProps {
  invoices: Invoice[];
  centres: Centre[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ invoices, centres }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [initialAnalysis, setInitialAnalysis] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const runAnalysis = async () => {
      setIsTyping(true);
      const result = await analyzeConsumption(invoices, centres);
      setInitialAnalysis(result || '');
      setIsTyping(false);
    };
    runAnalysis();
  }, [invoices, centres]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    
    setIsTyping(true);
    const response = await chatWithAssistant(userMsg, invoices);
    setMessages(prev => [...prev, { role: 'assistant', content: response || "Erreur assistant." }]);
    setIsTyping(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-2xl p-6 text-white shadow-xl overflow-hidden relative border border-blue-500/20">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-lg flex items-center justify-center border border-white/20">
              <i className="fas fa-robot text-xl"></i>
            </div>
            <h3 className="text-xl font-bold">Analyse Intelligente</h3>
          </div>
          <p className="text-blue-100 text-sm md:text-base leading-relaxed mb-4">
            Basé sur vos {invoices.length} factures enregistrées, voici mon diagnostic :
          </p>
          <div className="bg-slate-900/40 backdrop-blur-md rounded-xl p-4 border border-white/10 whitespace-pre-wrap text-sm md:text-base italic font-light text-blue-50">
            {isTyping && !initialAnalysis ? (
              <div className="flex items-center gap-2">
                <div className="animate-bounce h-1.5 w-1.5 bg-blue-400 rounded-full"></div>
                <div className="animate-bounce h-1.5 w-1.5 bg-blue-400 rounded-full delay-100"></div>
                <div className="animate-bounce h-1.5 w-1.5 bg-blue-400 rounded-full delay-200"></div>
                <span>Analyse en cours...</span>
              </div>
            ) : initialAnalysis}
          </div>
        </div>
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 flex flex-col h-[500px]">
        <div className="p-4 border-b border-slate-800 bg-slate-800/30 rounded-t-2xl flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <h4 className="text-sm font-bold text-slate-300">Expert Énergie Connecté</h4>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 p-8">
              <div className="w-16 h-16 bg-slate-800 text-blue-400 rounded-full flex items-center justify-center text-2xl border border-slate-700">
                <i className="fas fa-comments"></i>
              </div>
              <div>
                <h5 className="font-bold text-slate-100">Posez vos questions</h5>
                <p className="text-slate-400 text-sm max-w-xs">
                  "Comment puis-je réduire ma facture STEG ?" ou "Quels sont mes pics ?"
                </p>
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                m.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
              }`}>
                {m.content}
              </div>
            </div>
          ))}
          {isTyping && messages.length > 0 && (
            <div className="flex justify-start">
              <div className="bg-slate-800 text-slate-200 rounded-2xl rounded-tl-none px-4 py-2 flex gap-1 border border-slate-700">
                <div className="w-1 h-1 bg-slate-500 rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-slate-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-1 h-1 bg-slate-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="p-4 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-full text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Écrivez votre question ici..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={isTyping}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-900/40"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;