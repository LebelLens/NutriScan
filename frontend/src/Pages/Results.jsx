import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Share2, Heart, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { getFavorites, saveScan } from '../Services/db';
import toast from 'react-hot-toast';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  
  const [analysis, setAnalysis] = useState(location.state.analysis)

  const verdictConfig = {
    safe: {
      color: 'green',
      bg: 'bg-green-50',
      border: 'border-green-500',
      text: 'text-green-700',
      icon: CheckCircle,
      label: 'Safe to Eat'
    },
    caution: {
      color: 'yellow',
      bg: 'bg-yellow-50',
      border: 'border-yellow-500',
      text: 'text-yellow-700',
      icon: AlertTriangle,
      label: 'Eat with Caution'
    },
    avoid: {
      color: 'red',
      bg: 'bg-red-50',
      border: 'border-red-500',
      text: 'text-red-700',
      icon: XCircle,
      label: 'Avoid This Product'
    }
  };

  const config = verdictConfig[analysis.verdict];
  const VerdictIcon = config.icon;

  // saving scan to history in IndexedDB
  const handleSaveToHistory = async () => {
    try {
      await saveScan({
        productName: analysis.productName,
        flaggedIngredients: analysis.flaggedIngredients.map(i => i.name).join(', '),
        verdict: analysis.verdict,
        riskLevel: analysis.riskLevel,
        summary: analysis.summary,
        positiveHighlights: analysis.positiveHighlights,
      });
      toast.success("Saved to history")
    } catch (error) {
      toast.error('Error saving:', error);
    }
  };

  // opens the modal for ingredients
  const openIngredientModal = (ingredient) => {
    setSelectedIngredient(ingredient);
    setShowModal(true);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 px-4 py-4 flex items-center gap-4 glass-header backdrop-blur-md">
        <button 
          onClick={() => navigate('/home')}
          className="p-2 hover:bg-slate-100 rounded-xl transition-all"
        >
          <ArrowLeft size={20} className="text-slate-650" />
        </button>
        <h1 className="text-lg font-black text-slate-800 tracking-tight flex-1">Scan Analysis</h1>
      </div>

      <div className="px-5 py-4 space-y-5">
        {/* Verdict Hero Card */}
        <div className={`p-6 rounded-3xl border-2 shadow-xs ${
          analysis.verdict === 'safe' 
            ? 'bg-emerald-50/50 border-emerald-500/20' 
            : analysis.verdict === 'caution' 
              ? 'bg-amber-50/50 border-amber-500/20' 
              : 'bg-rose-50/50 border-rose-500/20'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
              analysis.verdict === 'safe' 
                ? 'bg-emerald-500 text-white' 
                : analysis.verdict === 'caution' 
                  ? 'bg-amber-500 text-white' 
                  : 'bg-rose-500 text-white'
            }`}>
              <VerdictIcon size={30} strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-black text-slate-800 truncate leading-tight">{analysis.productName}</h2>
              <span className={`inline-block text-xs font-black tracking-wide uppercase mt-1 ${config.text}`}>
                {config.label}
              </span>
            </div>
          </div>
        </div>

        {/* Summary Description Box */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Analysis Summary</h3>
          <p className="text-slate-600 text-xs font-medium leading-relaxed">{analysis.summary}</p>
        </div>

        {/* Flagged Ingredients List */}
        {analysis.flaggedIngredients && analysis.flaggedIngredients.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Flagged Ingredients</h3>
              <span className="text-xxs font-bold text-rose-500">POTENTIAL RISKS</span>
            </div>

            <div className="flex flex-col gap-3">
              {analysis.flaggedIngredients.map((ingredient, index) => {
                const isHighRisk = ingredient.risk === 'high' || (Array.isArray(ingredient.risks) && ingredient.risks[0] === 'high');
                const riskLevel = isHighRisk ? 'High Risk' : 'Medium Risk';
                return (
                  <div
                    key={index}
                    onClick={() => openIngredientModal(ingredient)}
                    className={`bg-white rounded-2xl p-4.5 border cursor-pointer hover:shadow-xs transition-all duration-200 ${
                      isHighRisk 
                        ? 'border-rose-100 hover:border-rose-300' 
                        : 'border-amber-100 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`w-11 h-11 ${
                        isHighRisk ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-500'
                      } rounded-xl flex items-center justify-center shrink-0`}>
                        <AlertTriangle size={20} strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-slate-800 text-sm truncate">{ingredient.name}</h4>
                          <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                            isHighRisk ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {riskLevel}
                          </span>
                        </div>
                        <p className="text-slate-500 text-xs mt-1 leading-relaxed line-clamp-2">
                          {ingredient.reason || ingredient.description}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2.5 text-slate-400">
                          <span className="text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded-md text-slate-500">
                            {ingredient.affectedCondition || (ingredient.risks && ingredient.risks[0])}
                          </span>
                          <span className="text-[10px] font-medium">• Tap for details</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Healthy Highlights Card */}
        {analysis.positiveHighlights && analysis.positiveHighlights.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Healthy Highlights</h3>
              <span className="text-xxs font-bold text-emerald-500">BENEFICIAL</span>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs space-y-3.5">
              {analysis.positiveHighlights.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle size={12} strokeWidth={3} />
                  </div>
                  <div className="text-xs font-semibold">
                    <span className="text-slate-800 font-extrabold">{item.name || item.name}: </span>
                    <span className="text-slate-500 leading-relaxed font-medium">{item.benefit || item.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alternatives Card */}
        {analysis.alternatives && analysis.alternatives.length > 0 && (
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-3xl p-5.5 border border-emerald-100 shadow-xxs">
            <h3 className="text-sm font-extrabold text-emerald-850 mb-3 flex items-center gap-2">
              <Heart size={16} className="text-emerald-600 fill-emerald-600/10" strokeWidth={2.5} />
              Healthier Alternatives
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {analysis.alternatives.map((alt, index) => (
                <div key={index} className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  <span>{alt}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <button 
            onClick={handleSaveToHistory}
            className="py-4 bg-white border-2 border-slate-200 hover:border-slate-300 rounded-2xl font-bold text-slate-600 hover:text-slate-800 text-xs transition-all active:scale-98 cursor-pointer"
          >
            Save to History
          </button>
          <button 
            onClick={() => navigate('/home')}
            className="py-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-2xl font-bold text-xs shadow-lg shadow-emerald-500/10 hover:brightness-105 active:scale-98 transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>

      {/* Ingredient Modal / Bottom Sheet */}
      {showModal && selectedIngredient && (
        <div 
          className="absolute inset-0 bg-black/40 z-50 flex items-end justify-center transition-all duration-300"
          onClick={() => setShowModal(false)}
        >
          {/* Modal Card */}
          <div 
            className="bg-white rounded-t-[32px] w-full max-h-[85vh] overflow-y-auto animate-slide-up shadow-2xl relative border-t border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* iOS Handle bar */}
            <div className="sticky top-0 bg-white py-3 z-10">
              <div className="w-10 h-1.5 bg-slate-200 rounded-full mx-auto"></div>
            </div>

            <div className="px-6 pb-8 pt-2 space-y-6">
              {/* Header Title with Risk Indicator */}
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 ${
                  selectedIngredient.risk === 'high' || (Array.isArray(selectedIngredient.risks) && selectedIngredient.risks[0] === 'high')
                    ? 'bg-rose-50 text-rose-500' 
                    : 'bg-amber-50 text-amber-500'
                } rounded-2xl flex items-center justify-center shrink-0`}>
                  <AlertTriangle size={28} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800 tracking-tight leading-tight">
                    {selectedIngredient.name}
                  </h2>
                  <span className="text-xxs font-extrabold uppercase text-slate-400 tracking-wider">Food Additive Analysis</span>
                </div>
              </div>

              {/* What is it section */}
              <div className="bg-sky-50/50 border border-sky-100 rounded-2xl p-4.5 space-y-2">
                <div className="flex items-center gap-2 text-sky-700">
                  <BookOpen size={16} strokeWidth={2.5} />
                  <h3 className="font-bold text-xs uppercase tracking-wider">What is it?</h3>
                </div>
                <p className="text-slate-600 text-xs font-semibold leading-relaxed">
                  {selectedIngredient.simpleExplanation || selectedIngredient.description || 'Common food texturizer or chemical preservative used in processed foods.'}
                </p>
              </div>

              {/* Health Impact warning box */}
              <div className={`border rounded-2xl p-4.5 space-y-3 ${
                selectedIngredient.risk === 'high' || (Array.isArray(selectedIngredient.risks) && selectedIngredient.risks[0] === 'high')
                  ? 'border-rose-100 bg-rose-50/30' 
                  : 'border-amber-100 bg-amber-50/30'
              }`}>
                <div className="flex items-center gap-2 text-slate-800">
                  <Heart size={16} className={
                    selectedIngredient.risk === 'high' || (Array.isArray(selectedIngredient.risks) && selectedIngredient.risks[0] === 'high')
                      ? 'text-rose-500' 
                      : 'text-amber-500'
                  } strokeWidth={2.5} />
                  <h3 className="font-bold text-xs uppercase tracking-wider">Health Impact</h3>
                </div>
                
                <div className="bg-white rounded-xl p-3.5 border border-slate-100">
                  <div className={`text-[10px] font-black uppercase mb-1.5 ${
                    selectedIngredient.risk === 'high' || (Array.isArray(selectedIngredient.risks) && selectedIngredient.risks[0] === 'high')
                      ? 'text-rose-600' 
                      : 'text-amber-600'
                  }`}>
                    Risk Warning: {selectedIngredient.affectedCondition || (selectedIngredient.risks && selectedIngredient.risks[0])}
                  </div>
                  <p className="text-slate-600 text-xs font-medium leading-relaxed">
                    {selectedIngredient.reason || selectedIngredient.description}
                  </p>
                </div>
              </div>

              {/* Ingredient Alternatives */}
              {selectedIngredient.alternatives && selectedIngredient.alternatives.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider px-0.5">Recommended alternatives:</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedIngredient.alternatives.map((alt, ind) => (
                      <span 
                        key={ind}
                        className="px-3.5 py-2 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full text-xs font-bold"
                      >
                        {alt}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dismiss Button */}
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white rounded-2xl font-extrabold text-sm shadow-lg shadow-emerald-500/15 transition-all active:scale-98 cursor-pointer mt-4"
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;