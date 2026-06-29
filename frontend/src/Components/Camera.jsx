import { useState, useRef, useEffect } from 'react';
import { X, FlipHorizontal, Upload, Zap, AlertCircle } from 'lucide-react';

const Camera = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [flashEnabled, setFlashEnabled] = useState(false);

  useEffect(() => {
    startCamera();
    return () =>{ 
      stopCamera()
      console.log('closing...');
      
    };
  }, []);

  // starting the camera
  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError(null);                  

      // Checking if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported on this device');
      }

      // Setting constraints of video
      const constraints = {
        video: { 
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };

      // Asking for permission if user accepts the videodata is stored in mediaStream
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Storing the video source to the video element
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Camera error:', err);
      setIsLoading(false);
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Camera permission denied. Please enable camera access in your browser settings.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No camera found on this device.');
      } else {
        setError('Unable to access camera. Please try uploading an image instead.');
      }
    }
  };

  // stopping the camera
  const stopCamera = () => {    
    if (stream) {      
      stream.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
      setStream(null);
    }
    
    // Also stop the video element
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => {
        track.stop();
        track.enabled = false;
      });
      videoRef.current.srcObject = null;
    }
  };

  // capturing the image(a frame of video)
  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video) return;

    // Set canvas dimensions to video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // capturing the frame using drawImage
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    stopCamera()
    // Convert to blob(image)
    canvas.toBlob((blob) => {
      if (blob) {
        const imageUrl = URL.createObjectURL(blob);
        stopCamera();
        onCapture(imageUrl, blob);
      }
    }, 'image/jpeg', 0.9);
  };

  // switching between front and back camera for mobiles
  const switchCamera = () => {
    stopCamera();
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  // uploading image when the camera is not used
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      stopCamera();
      onCapture(imageUrl, file);
    }
  };

  // triggering the upload function when the svg is clicked
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Error State
  if (error) {
    return (
      <div className="absolute inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-gray-800 rounded-2xl p-8 text-center">
          <div className="w-20 h-20 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={48} className="text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-3">Camera Unavailable</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">{error}</p>
          
          <div className="space-y-3">
            <button
              onClick={triggerFileUpload}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors"
            >
              <Upload size={20} />
              Upload Image Instead
            </button>
            
            <button
              onClick={()=>{
                stopCamera()
                setTimeout(() => {
                  onClose()
                }, 1000);
              }}
              className="w-full px-6 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
        
        {/* Creating the hidden file input when svg is clicked it is triggered */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-black z-50 overflow-hidden rounded-3xl">
      {/* Video Stream */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      
      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Starting camera...</p>
          </div>
        </div>
      )}

      {/* Camera controls overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none">
        
        {/* Close button */}
        <div className="flex justify-between items-center pointer-events-auto">
          <button 
            onClick={()=>{
              stopCamera()
              setTimeout(() => {
                onClose()
              }, 1000);
            }}
            className="p-3 bg-black bg-opacity-60 backdrop-blur-sm rounded-full hover:bg-opacity-80 transition-all"
            title='Close this window'
          >
            <X size={24} className="text-white" />
          </button>

          <div className="flex gap-3">
            {/* Upload button */}
            <button 
              onClick={triggerFileUpload}
              className="p-3 bg-black bg-opacity-60 backdrop-blur-sm rounded-full hover:bg-opacity-80 transition-all"
              title="Upload from gallery"
            >
              <Upload size={24} className="text-white" />
            </button>
            
            {/* Switch camera */}
            <button 
              onClick={switchCamera}
              className="p-3 bg-black bg-opacity-60 backdrop-blur-sm rounded-full hover:bg-opacity-80 transition-all"
              title="Switch camera"
            >
              <FlipHorizontal size={24} className="text-white" />
            </button>
          </div>
        </div>

        {/* Middle section */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative">
            {/* Scanning Frame */}
            <div className="border-4 border-(--primary) rounded-2xl w-80 h-56 relative">
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg"></div>
              
              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/50 px-6 py-3 rounded-full">
                  <p className="text-white text-sm font-medium text-center">
                    Position ingredient list or barcode here
                  </p>
                </div>
              </div>
            </div>

            {/* Instruction text */}
            <div className="mt-4 text-center">
              <p className="text-white text-sm bg-black bg-opacity-50 backdrop-blur-sm px-4 py-2 rounded-full inline-block">
                <Zap size={16} className="inline mr-2" />
                Hold steady for best results
              </p>
            </div>

          </div>
        </div>

        {/* Capture Button */}
        <div className="flex justify-center items-center gap-4 pointer-events-auto">
          <button
            onClick={captureImage}
            className="relative w-20 h-20 rounded-full bg-white border-4 border-green-500 hover:border-green-400 transition-all transform hover:scale-105 active:scale-95"
            disabled={isLoading}
          >
            {/* Inner circle */}
            <div className="absolute inset-2 rounded-full bg-(--primary)"></div>
          </button>
        </div>
      </div>

      {/* Creating the hidden file input when svg is clicked it is triggered */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

export default Camera;
