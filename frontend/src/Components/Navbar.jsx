import React from 'react'
import '../index.css'
import toast from 'react-hot-toast'
import { useAuthContext } from '../Context/authContext'
import { LogOut } from 'lucide-react'
import { db } from '../Services/db'

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000"


const Navbar = () => {
  const {setAuthUser}=useAuthContext()

  const handleLogout = async ()=>{
    try {
      const res = await fetch(`${apiUrl}/api/users/logout`, {
        method: "POST", 
        credentials: 'include'
      });
      if(res.ok){
        localStorage.removeItem("NutriScan")
        setAuthUser(null)
        await db.scans.clear();
        await db.userProfile.clear();
      }      
    } catch (error) {
      toast.error("Error while logout")
    }
  }

  return (
    <div className='sticky top-0 left-0 right-0 w-full px-5 py-4 flex justify-between items-center glass-header backdrop-blur-md z-45'>
      <div className='flex items-center gap-2'>
        <div className="w-9 h-9 bg-emerald-500/10 flex items-center justify-center rounded-xl text-emerald-600">
          <img className='h-full w-full' src="/apple-touch-icon.png" alt="NutriScan" />
        </div>
        <h1 className='text-lg font-black text-slate-800 tracking-tight'>NutriScan</h1>
      </div>
      <button 
        onClick={handleLogout} 
        className='flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 px-3 py-2 rounded-xl transition-all cursor-pointer'
        title="Logout"
      >
        <LogOut size={14} />
        <span>Logout</span>
      </button>
    </div>
  )
}

export default Navbar
