import React, { useEffect, useState } from 'react'
import { AlertCircle, Camera, CircleCheck, X, XCircle, ArrowRight, Activity, ShieldCheck } from 'lucide-react'
import '../index.css'
import { useNavigate } from 'react-router-dom'
import { getScanHistory, getScansByVerdict, getScansCount } from '../Services/db'
import { timeAgo } from '../utils/timeConverter.js'
import useGetScan from '../Hooks/useGetScan.js'
import { useAuthContext } from '../Context/authContext.jsx'

const Scan = () => {
    const navigate = useNavigate()
    const { authUser } = useAuthContext()
    const { getScan, isLoadingScans } = useGetScan()
    const [history, setHistory] = useState([])
    const [totalItems, setTotalItems] = useState(0)
    const [safeItems, setSafeItems] = useState(0)

    const icons = {
        'avoid': <XCircle size={18} className="text-rose-500 fill-rose-500/10" />,
        'caution': <AlertCircle size={18} className="text-amber-500 fill-amber-500/10" />,
        'safe': <CircleCheck size={18} className="text-emerald-500 fill-emerald-500/10" />,
    }

    const verdictLabel = {
        'avoid': 'Avoid',
        'caution': 'Caution',
        'safe': 'Safe',
    }

    const verdictClass = {
        'avoid': 'bg-rose-50 text-rose-700 border-rose-100',
        'caution': 'bg-amber-50 text-amber-700 border-amber-100',
        'safe': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    }

    useEffect(() => {
        async function f() {
            await getScan();
            const h = await getScanHistory(3);
            setHistory(h)
            const total = await getScansCount();
            setTotalItems(total)
            const safe = await getScansByVerdict('safe')
            setSafeItems(safe.length)
        }
        f()
    }, [])
    
    return (
        <div className="flex-1 overflow-y-auto px-5 pt-4 pb-28 bg-slate-50">
            {/* Greeting Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-sm font-semibold text-slate-400">Welcome back,</h2>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                        {authUser?.name || 'Healthy Eater'} 👋
                    </h1>
                </div>
            </div>

            {/* Scan Prompt Banner Card */}
            <div className="card rounded-3xl p-6 text-white mb-6 relative shadow-lg shadow-emerald-700/20">
                <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
                <div className="relative z-10 flex flex-col gap-4">
                    <div className="w-12 h-12 bg-white/25 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 animate-pulse [animation-duration:3s]">
                        <Camera size={22} className="text-white fill-white/10" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">Scan a food product</h2>
                        <p className="text-xs text-emerald-100/80 mt-1 leading-relaxed">
                            Point your camera at the ingredients label to analyze nutritional safety.
                        </p>
                    </div>
                    <button 
                        onClick={() => navigate("/scan")} 
                        className="w-full py-3.5 bg-white text-emerald-800 text-sm font-extrabold rounded-2xl shadow-md hover:bg-emerald-50 active:scale-98 transition-all flex items-center justify-center gap-2"
                    >
                        <span>Start Scanning</span>
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>

            {/* Stats Dashboard Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs flex flex-col gap-2">
                    <div className="w-8 h-8 bg-indigo-50 flex items-center justify-center rounded-lg text-indigo-500">
                        <Activity size={16} />
                    </div>
                    <div>
                        <span className="text-[26px] font-black text-slate-800 leading-none">{totalItems}</span>
                        <h3 className="text-xs font-semibold text-slate-400 mt-1">Total Scanned</h3>
                    </div>
                </div>
                
                <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs flex flex-col gap-2">
                    <div className="w-8 h-8 bg-emerald-50 flex items-center justify-center rounded-lg text-emerald-500">
                        <ShieldCheck size={16} />
                    </div>
                    <div>
                        <span className="text-[26px] font-black text-slate-800 leading-none">{safeItems}</span>
                        <h3 className="text-xs font-semibold text-slate-400 mt-1">Safe Products</h3>
                    </div>
                </div>
            </div>

            {/* Recent Scans Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="font-extrabold text-slate-800 text-base">Recent Scans</h2>
                    {totalItems > 3 && (
                        <button onClick={() => navigate("/history")} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5">
                            <span>View all</span>
                            <ArrowRight size={12} />
                        </button>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    {isLoadingScans && (
                        <div className="flex items-center justify-center py-8 text-slate-400 gap-2">
                            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm font-semibold">Updating scans...</span>
                        </div>
                    )}
                    
                    {totalItems === 0 && !isLoadingScans && (
                        <div className="text-center py-10 bg-white border border-dashed border-slate-200 rounded-2xl">
                            <p className="text-slate-400 text-sm font-medium">No recent scans yet.</p>
                            <button onClick={() => navigate("/scan")} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-1">
                                Scan your first product
                            </button>
                        </div>
                    )}

                    {totalItems > 0 && history.map((his, i) => (
                        <div 
                            key={i} 
                            onClick={() => navigate('/results', { state: { analysis: his } })}
                            className="flex items-center justify-between bg-white border border-slate-100 p-4 rounded-2xl shadow-xs hover:border-slate-200 transition-all cursor-pointer group"
                        >
                            <div className="flex-1 min-w-0 pr-3">
                                <h3 className="font-bold text-slate-800 text-sm truncate group-hover:text-emerald-700 transition-colors">
                                    {his.productName}
                                </h3>
                                <p className="text-xs text-slate-400 font-medium mt-0.5">
                                    {timeAgo(his.timestamp)}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${verdictClass[his.verdict]}`}>
                                    {verdictLabel[his.verdict]}
                                </span>
                                <div className="p-1 rounded-lg">
                                    {icons[his.verdict]}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Scan
