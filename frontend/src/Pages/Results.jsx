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
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <button 
            onClick={() => navigate('/home')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold flex-1">Scan Results</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Product Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{analysis.productName}</h2>
              <p className="text-sm text-gray-500">Scanned 2 minutes ago</p>
            </div>
          </div>

          {/* Verdict Badge */}
          <div className={`flex items-center gap-3 p-4 ${config.bg} border-2 ${config.border} rounded-xl`}>
            <VerdictIcon size={28} className={config.text} />
            <span className={`text-lg font-semibold ${config.text}`}>
              {config.label}
            </span>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-3">Why you should {analysis.verdict === 'avoid' ? 'avoid' : 'be caution with'} this:</h3>
          <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
        </div>

        {/* Flagged Ingredients */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold px-1">Flagged Ingredients</h3>
          {analysis.flaggedIngredients.map((ingredient, index) => {
            const riskColor = ingredient.risk === 'high' ? 'red' : 'yellow';
            return (
              <div
                key={index}
                onClick={() => openIngredientModal(ingredient)}
                className={`bg-white rounded-2xl p-4 shadow-sm border-2 ${riskColor==='red'?'border-red-200 hover:border-red-400':'border-yellow-200 hover:border-yellow-400'} cursor-pointer transition-all`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 ${riskColor==='red'?'bg-red-100':'bg-yellow-100'} rounded-xl flex items-center justify-center shrink-0`}>
                    <AlertTriangle size={24} className={`${riskColor==='red'?'text-red-600':'text-yellow-600'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 mb-1">{ingredient.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{ingredient.reason}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 ${riskColor==='red'?'bg-red-100':'bg-yellow-100'} ${riskColor==='red'?'text-red-700':'text-yellow-700'} rounded-full font-medium`}>
                        {ingredient.affectedCondition}
                      </span>
                      <span className="text-xs text-gray-500">Tap to learn more</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {analysis.positiveHighlights.length>0 && <div className="mt-4">
          <h3 className="text-lg font-semibold mb-3">Healthy Highlights</h3>
          <div className="grid grid-cols-1 gap-2">
            {analysis.positiveHighlights?.map((item, index) => (
              <div key={index} className="bg-green-50 p-3 rounded-lg border border-green-200">
                <span className="text-sm font-semibold">{item.name}: </span>
                <span className="text-gray-800 text-sm">{item.benefit}</span>
              </div>
            ))}
          </div>
        </div>}

        {/* Alternatives */}
        {analysis.alternatives && analysis.alternatives.length > 0 && (
          <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Heart size={20} className="text-green-600" />
              Healthier Alternatives
            </h3>
            <ul className="space-y-2">
              {analysis.alternatives.map((alt, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <CheckCircle size={18} className="text-green-600 mt-0.5 flex shrink-0" />
                  <span>{alt}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={handleSaveToHistory}
            className="py-4 bg-white border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Save to History
          </button>
          <button className="py-4 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg">
            Find Alternatives
          </button>
        </div>
      </div>

      {/* Ingredient Modal opens when any ingredients is clicked */}
      {showModal && selectedIngredient && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-t-3xl w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-6">
              {/* Handle bar */}
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto"></div>

              {/* Icon */}
              <div className={`w-16 h-16 ${selectedIngredient.risk === 'high' ? 'bg-red-100' : 'bg-yellow-100'} rounded-2xl flex items-center justify-center`}>
                <AlertTriangle size={32} className={`${selectedIngredient.risk === 'high' ?'text-(--danger)' :'text-(--caution)'}`} />
              </div>

              {/* Title */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedIngredient.name}
                </h2>
                <p className="text-sm text-gray-500">Common food additive</p>
              </div>

              {/* Simple Explanation */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen size={20} className="text-blue-600" />
                  <h3 className="font-semibold text-gray-900">What is it?</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {selectedIngredient.simpleExplanation}
                </p>
              </div>

              {/* Health Impact */}
              <div className={`${selectedIngredient.risk === 'high' ? 'bg-red-50' : 'bg-yellow-50'} border ${selectedIngredient.risk === 'high' ? 'border-(--danger)' : 'border-(--caution)'} rounded-2xl p-4`}>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Heart size={20} className={`${selectedIngredient.risk === 'high' ? 'text-(--danger)' : 'text-(--caution)'}`} />
                  Why it matters for you
                </h3>
                <div className={`bg-white rounded-xl p-3 border ${selectedIngredient.risk === 'high' ? 'border-(--danger)' : 'border-(--caution)'}`}>
                  <div className={`text-sm font-medium ${selectedIngredient.risk === 'high' ? 'text-(--danger)' : 'text-(--caution)'} mb-2`}>
                    {selectedIngredient.risk === 'high' ? 'High Risk' : 'Medium Risk'} for {selectedIngredient.affectedCondition}
                  </div>
                  <p className="text-gray-700 text-sm">
                    {selectedIngredient.reason}
                  </p>
                </div>
              </div>

              {/* Alternatives */}
              {selectedIngredient.alternatives && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Healthier alternatives:</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedIngredient.alternatives.map((alt, ind) => (
                      <span 
                        key={ind}
                        className="px-4 py-2 bg-green-100 border border-green-300 text-green-700 rounded-full text-sm font-medium"
                      >
                        {alt}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-4 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;