import React, { useState } from 'react'
import Camera from '../Components/Camera';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const Scanner = () => {
    const navigate=useNavigate();
    const [showCamera, setShowCamera] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false)
    const [capturedImage, setCapturedImage] = useState(null)

    const handleCapture = async (imageUrl, blob) => {
    console.log('Image captured:', imageUrl);
    setCapturedImage(imageUrl);
    setShowCamera(false);
    setIsProcessing(true);

    // TODO: Process image with OCR here
    // For now, simulate processing
    setTimeout(() => {
      // Navigate to results with the image
      navigate('/results', { 
        state: { 
          imageUrl,
          // Mock data - replace with real OCR results
          ingredientText: 'Sample ingredients extracted from image'
        } 
      });
    }, 2000);
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
          <p className="text-gray-400 mb-8">
            Reading ingredient list and checking against your health profile...
          </p>

          {/* Progress steps */}
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3 text-green-400">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span className="text-sm">Extracting text from image</span>
            </div>
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
