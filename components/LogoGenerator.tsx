
import React, { useState, useRef } from 'react';

interface LogoGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onLogoSelected: (logoUrl: string) => void;
}

const LogoGenerator: React.FC<LogoGeneratorProps> = ({ isOpen, onClose, onLogoSelected }) => {
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("L'image est trop volumineuse (max 2Mo).");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedLogo(event.target?.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyLogo = () => {
    if (uploadedLogo) {
      onLogoSelected(uploadedLogo);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-slate-800">Votre Logo</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-2">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <p className="text-slate-500 text-sm mb-6">
            Importez votre logo personnel pour personnaliser l'interface de votre application de gestion.
          </p>

          <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 aspect-square flex flex-col items-center justify-center relative overflow-hidden mb-6">
            {uploadedLogo ? (
              <div className="relative w-full h-full p-4">
                <img src={uploadedLogo} alt="Logo importé" className="w-full h-full object-contain" />
                <button 
                  onClick={() => setUploadedLogo(null)}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                  title="Supprimer"
                >
                  <i className="fas fa-trash-alt text-xs"></i>
                </button>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="text-center p-8 space-y-3 cursor-pointer hover:bg-slate-100/50 w-full h-full flex flex-col items-center justify-center transition-colors group"
              >
                <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center text-4xl mx-auto group-hover:scale-110 transition-transform duration-300">
                  <i className="fas fa-cloud-upload-alt"></i>
                </div>
                <div>
                  <p className="text-slate-800 font-bold">Cliquez pour importer</p>
                  <p className="text-slate-500 text-xs mt-1">PNG, JPG ou SVG (max. 2Mo)</p>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileUpload}
                />
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-xs p-3 rounded-xl mb-6 flex items-center gap-2 font-medium">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-4 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Annuler
            </button>
            <button
              onClick={applyLogo}
              disabled={!uploadedLogo}
              className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:bg-slate-300 shadow-lg shadow-blue-100 transition-all active:scale-95"
            >
              Enregistrer
            </button>
          </div>
          
          <p className="text-center text-[10px] text-slate-400 mt-6 uppercase tracking-widest font-bold">
            Stockage local sécurisé
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogoGenerator;
