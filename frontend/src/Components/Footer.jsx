import React from 'react'
import { Camera, History, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Footer = (props) => {
    const navigate = useNavigate()
    
    return (
        <div className='absolute bottom-0 left-0 right-0 w-full px-6 py-3 flex justify-around items-center glass-nav z-45 border-t border-slate-100 shadow-lg shadow-slate-200/50'>
            {/* Scan Tab */}
            <div 
                onClick={() => navigate("/home")} 
                className={`flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 py-1.5 px-3 rounded-2xl ${
                    props.open === 'home' 
                        ? 'text-emerald-600 scale-105 font-semibold' 
                        : 'text-slate-400 hover:text-slate-600'
                }`}
            >
                <Camera size={22} strokeWidth={props.open === 'home' ? 2.5 : 2} />
                <span className="text-[10px] tracking-wide">Scan</span>
            </div>

            {/* History Tab */}
            <div 
                onClick={() => navigate("/history")} 
                className={`flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 py-1.5 px-3 rounded-2xl ${
                    props.open === 'history' 
                        ? 'text-emerald-600 scale-105 font-semibold' 
                        : 'text-slate-400 hover:text-slate-600'
                }`}
            >
                <History size={22} strokeWidth={props.open === 'history' ? 2.5 : 2} />
                <span className="text-[10px] tracking-wide">History</span>
            </div>

            {/* Profile Tab */}
            <div 
                onClick={() => navigate("/profile")} 
                className={`flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 py-1.5 px-3 rounded-2xl ${
                    props.open === 'profile' 
                        ? 'text-emerald-600 scale-105 font-semibold' 
                        : 'text-slate-400 hover:text-slate-600'
                }`}
            >
                <User size={22} strokeWidth={props.open === 'profile' ? 2.5 : 2} />
                <span className="text-[10px] tracking-wide">Profile</span>
            </div>
        </div>
    )
}

export default Footer
