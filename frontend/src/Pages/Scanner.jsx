import React, { useState } from 'react'
import Camera from '../Components/Camera';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import {extractTextWithAzure} from '../Services/azureOCR.js'
import toast from 'react-hot-toast'
import { getUserProfile, saveScan } from '../Services/db.js';
import { analyzeIngredientsWithAzure } from '../Services/azureOpenAI.js';
import { useAuthContext } from '../Context/authContext.jsx';
import useSaveScan from '../Hooks/useSaveScan.js';

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000"

const Scanner = () => {
    const navigate=useNavigate();
    const {authUser}=useAuthContext()
    const {saveToMongoDB} = useSaveScan()
    const [showCamera, setShowCamera] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false)
    const [capturedImage, setCapturedImage] = useState(null)
    const [processingStep, setProcessingStep] = useState('');
    const [progress, setProgress] = useState(0);

    const handleCapture = async (imageUrl, blob) => {
    console.log('Image captured:', imageUrl);
    setCapturedImage(imageUrl);
    setShowCamera(false);
    setIsProcessing(true);

    try {
      // Extract text from blob using Azure OCR
      setProcessingStep('Reading ingredients with Azure AI...');
      
      const extractedText = await extractTextWithAzure(
        blob,
        (progressPercent) => {
          console.log('OCR Progress:', progressPercent + '%');
          setProgress(progressPercent);
        }
      );

      console.log('Extracted text:', extractedText);

      if (!extractedText || extractedText.trim().length < 10) {
        throw new Error('Text too short. Please capture a clearer image.');
      }

      // Get user profile
      const userProfile = await getUserProfile();
      if (!userProfile) {
        throw new Error('Please complete your health profile first');
      }

      // Analyze with Azure OpenAI
      setProcessingStep('Analyzing for your health conditions...');
      setProgress(0);
      
      const analysis = await analyzeIngredientsWithAzure(
        extractedText,
        userProfile
      );  
    
      // Save in IndexedDB
      await saveScan({
        productName: analysis.productName,
        flaggedIngredients: analysis.flaggedIngredients,
        positiveHighlights: analysis.positiveHighlights,
        verdict: analysis.verdict,
        riskLevel: analysis.riskLevel,
        summary: analysis.summary,
      });

      const mappedIngredients = Array.isArray(analysis.flaggedIngredients) 
          ? analysis.flaggedIngredients.map((item)=>({
            name: item.name || 'Unknown',
            description: item.reason || item.simpleExplaination || '',
            alternatives: Array.isArray(item.alternatives) ? item.alternatives: [],
            risks: item.risk ? [item.risk]:[]
          })) : []

      const positiveIngredients = Array.isArray(analysis.positiveHighlights)
          ? analysis.positiveHighlights.map(item=>({
            name: item.name || 'Unknown',
            description: item.benefit || '',
          })) : []

      // Save in MongoDB
      await saveToMongoDB({
        productName: analysis.productName,
        verdict: analysis.verdict,
        riskLevel: analysis.riskLevel,
        flaggedIngredients: mappedIngredients,
        positiveHighlights: positiveIngredients,
        summary: analysis.summary
      })

      navigate('/results', { 
        state: { 
          imageUrl: imageUrl,
          ingredientText: extractedText,
          analysis: analysis
        } 
      });
  } catch (error) {
      console.error('Processing failed:', error);
      toast.error(error.message || 'Failed to process image. Please try again.');
      setShowCamera(true);
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    navigate('/home');
  };

    if(showCamera) return <Camera onCapture={handleCapture} onClose={handleClose}/>

  if(isProcessing){
    return (
      <div className="absolute inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center p-6 text-white select-none">
        <div className="w-full text-center max-w-xs space-y-6">
          {/* Preview of captured image with animated laser */}
          {capturedImage && (
            <div className="relative mb-6 rounded-3xl overflow-hidden border border-slate-700/50 shadow-2xl group">
              <img 
                src={capturedImage} 
                alt="Captured Ingredients" 
                className="w-full h-56 object-cover brightness-90 contrast-105"
              />
              {/* Pulsing overlay scanner grid */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-slate-900/20"></div>
              {/* Scan laser */}
              <div className="scanner-laser"></div>
            </div>
          )}

          {/* Core Status */}
          <div className="space-y-2">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
              <Camera size={22} className="absolute text-emerald-400 animate-pulse" />
            </div>
            <h2 className="text-xl font-black tracking-tight mt-2">
              Analyzing Ingredients
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed px-4">
              Reading ingredients lists with Azure AI and verifying safety preferences.
            </p>
          </div>

          {/* Animated Checklist */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4.5 space-y-3.5 text-left text-xs font-semibold">
            <div className="flex items-center gap-3 text-emerald-400">
              <div className="w-5 h-5 bg-emerald-500/10 rounded-full flex items-center justify-center shrink-0">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              </div>
              <span>Reading text from image</span>
            </div>
            
            <div className="flex items-center gap-3 text-emerald-400">
              <div className="w-5 h-5 bg-emerald-500/10 rounded-full flex items-center justify-center shrink-0">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              </div>
              <span>Identifying active chemicals & additives</span>
            </div>
            
            <div className="flex items-center gap-3 text-emerald-400/80 animate-pulse">
              <div className="w-5 h-5 bg-emerald-500/10 rounded-full flex items-center justify-center shrink-0">
                <div className="w-1.5 h-1.5 border border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <span>Verifying allergies & conditions</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null;
}

export default Scanner
