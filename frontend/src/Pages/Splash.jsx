import React from 'react'
import { Heart, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Splash = () => {
  const navigate = useNavigate();
  return (
    <div className="relative flex flex-col justify-between items-center w-full min-h-screen p-8 text-white overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-indigo-900">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"></div>

      {/* Main Branding Section */}
      <div className="flex-1 flex flex-col items-center justify-center text-center mt-12 z-10">
        <div className="relative mb-6">
          {/* Outer glowing pulsing aura */}
          <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-110 animate-pulse [animation-duration:3s]"></div>
          {/* Logo container */}
          <div className="relative w-28 h-28 bg-white/10 backdrop-blur-md border border-white/20 flex justify-center items-center rounded-3xl shadow-2xl transition-transform hover:scale-105">
            <img src="/apple-touch-icon.png" alt="NutriScan Logo" className="w-16 h-16 rounded-xl" />
          </div>
          <Sparkles className="absolute -top-1 -right-1 text-emerald-300 animate-bounce" size={24} />
        </div>
        
        <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-sm mb-3">
          NutriScan
        </h1>
        <p className="text-emerald-100/80 text-sm max-w-[280px] leading-relaxed">
          Scan ingredient lists in real-time, instantly uncover hidden risks, and make smarter food choices.
        </p>
      </div>

      {/* Actions Section */}
      <div className="w-full space-y-4 mb-8 z-10">
        <button 
          onClick={() => navigate("/signup")} 
          className="w-full bg-white text-emerald-800 font-bold py-4 px-6 rounded-2xl shadow-xl hover:bg-emerald-50 active:scale-98 transition-all duration-200 text-base"
        >
          Get Started
        </button>
        <button 
          onClick={() => navigate("/login")} 
          className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold py-4 px-6 rounded-2xl hover:bg-white/15 active:scale-98 transition-all duration-200 text-base"
        >
          I already have an account
        </button>
        <div className="text-center">
          <span className="text-xs text-white/50">Version 1.0.0 (PWA)</span>
        </div>
      </div>
    </div>
  )
}

export default Splash
