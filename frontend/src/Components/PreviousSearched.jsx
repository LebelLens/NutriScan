import React, { useEffect, useState } from 'react'
import { Search, Calendar, ChevronRight, XCircle, AlertCircle, CircleCheck, Info, Trash2 } from 'lucide-react'
import { getScanHistory, deleteScan } from '../Services/db'
import { timeAgo } from '../utils/timeConverter'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const PreviousSearched = () => {
    const navigate = useNavigate()
    const [scans, setScans] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [filterVerdict, setFilterVerdict] = useState('all')
    const [isLoading, setIsLoading] = useState(true)

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
        loadHistory()
    }, [])

    const loadHistory = async () => {
        setIsLoading(true)
        try {
            const history = await getScanHistory(50)
            setScans(history)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (e, id) => {
        e.stopPropagation() // Prevent navigating to details
        if (window.confirm("Are you sure you want to delete this scan from your history?")) {
            try {
                await deleteScan(id)
                toast.success("Scan deleted")
                loadHistory()
            } catch (error) {
                toast.error("Failed to delete scan")
            }
        }
    }

    // Filter scans based on search and verdict filter
    const filteredScans = scans.filter(scan => {
        const matchesSearch = scan.productName.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesVerdict = filterVerdict === 'all' || scan.verdict === filterVerdict
        return matchesSearch && matchesVerdict
    })

    return (
        <div className="flex-1 overflow-y-auto px-5 pt-4 pb-28 bg-slate-50">
            {/* Header section */}
            <div className="flex justify-between items-center mb-5">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Scan History</h1>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">
                        {scans.length} product{scans.length !== 1 && 's'} analyzed
                    </p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white border border-slate-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10 flex items-center gap-3 px-4 py-3 rounded-2xl transition-all shadow-xs mb-5">
                <Search size={18} className="text-slate-400" />
                <input 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full outline-hidden bg-transparent text-slate-800 text-sm" 
                    type="text" 
                    placeholder="Search scans by name..." 
                />
            </div>

            {/* Filter Pills */}
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none">
                {['all', 'safe', 'caution', 'avoid'].map((type) => (
                    <button
                        key={type}
                        onClick={() => setFilterVerdict(type)}
                        className={`text-xs font-bold px-4.5 py-2.5 rounded-full transition-all shrink-0 border capitalize cursor-pointer ${
                            filterVerdict === type
                                ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                        }`}
                    >
                        {type === 'all' ? 'All Scans' : type}
                    </button>
                ))}
            </div>

            {/* History List */}
            <div className="space-y-3 mt-2">
                {isLoading && (
                    <div className="flex items-center justify-center py-12 text-slate-400 gap-2">
                        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm font-semibold">Loading history...</span>
                    </div>
                )}

                {!isLoading && filteredScans.length === 0 && (
                    <div className="text-center py-12 bg-white border border-dashed border-slate-200 rounded-3xl p-6">
                        <Info size={32} className="text-slate-300 mx-auto mb-2" />
                        <p className="text-slate-400 text-sm font-semibold">No matching scans found.</p>
                        <p className="text-xs text-slate-400 mt-1">Try resetting filters or start a new scan.</p>
                    </div>
                )}

                {!isLoading && filteredScans.map((scan) => (
                    <div 
                        key={scan.id}
                        onClick={() => navigate('/results', { state: { analysis: scan } })}
                        className="flex items-center justify-between bg-white border border-slate-100 p-4.5 rounded-2xl shadow-xs hover:border-slate-200 hover:shadow-xs transition-all cursor-pointer group"
                    >
                        <div className="flex-1 min-w-0 pr-3">
                            <h3 className="font-bold text-slate-800 text-sm truncate group-hover:text-emerald-700 transition-colors">
                                {scan.productName}
                            </h3>
                            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium mt-1">
                                <Calendar size={12} />
                                <span>{timeAgo(scan.timestamp)}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${verdictClass[scan.verdict]}`}>
                                {verdictLabel[scan.verdict]}
                            </span>
                            <button 
                                onClick={(e) => handleDelete(e, scan.id)}
                                className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                title="Delete scan"
                            >
                                <Trash2 size={16} />
                            </button>
                            <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-400 transition-all" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PreviousSearched
