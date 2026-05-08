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
    return <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          {/* Preview of captured image */}
          {capturedImage && (
            <div className="mb-8 rounded-2xl overflow-hidden">
              <img 
                src={capturedImage} 
                alt="Captured" 
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          {/* Loading animation */}
          <div className="mb-6">
            <Loader2 size={64} className="text-green-500 animate-spin mx-auto" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-3">
            Analyzing Ingredients
          </h2>
          <p className="text-gray-400 mb-6">
            Reading ingredient list and checking against your health profile...
          </p>

          {/* Progress steps */}
          <div className="space-y-3 text-left">
            {progress && (
            <div className="flex items-center gap-3 text-green-400">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span className="text-sm">Extracting text from image</span>
            </div>
            )}
            <div className="flex items-center gap-3 text-green-400">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span className="text-sm">Identifying ingredients</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <div className="w-2 h-2 rounded-full bg-gray-600 animate-pulse"></div>
              <span className="text-sm">Analyzing health risks</span>
            </div>
          </div>
        </div>
      </div>
  }

  return null;
}

export default Scanner
