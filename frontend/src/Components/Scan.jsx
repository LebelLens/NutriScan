import React from 'react'
import { AlertCircle, Camera, CircleCheck, X, XCircle } from 'lucide-react'
import '../index.css'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { getScanHistory, getScansByVerdict, getScansCount } from '../Services/db'
import { useState } from 'react'
import {timeAgo} from '../utils/timeConverter.js'
import useGetScan from '../Hooks/useGetScan.js'

const Scan = () => {
    const navigate = useNavigate()
    const {getScan, isLoadingScans, setIsLoadingScans}= useGetScan()
    const [history, setHistory] = useState([])
    const [totalItems, setTotalItems]=useState(0)
    const [safeItems, setSafeItems]=useState(0)

    const icons={
        'avoid': <XCircle size={20} className='text-(--danger)'/>,
        'caution': <AlertCircle size={20} className='text-(--caution)'/>,
        'safe': <CircleCheck size={20} className='text-(--safe)'/>,
    }

    useEffect(() => {
      async function f() {
        // Getting the scans from database and storing it in IndexedDB
        await getScan();
        // Getting 3 scans from IndexedDB
        const h = await getScanHistory(3);
        setHistory(h)
        // Getting the total scans from IndexedDB
        const total=await getScansCount();
        setTotalItems(total)
        // Getting the safe scans from indexedDB
        const safe=await getScansByVerdict('safe')
        setSafeItems(safe.length)
      }
      f()
    }, [])
    
    return (
        <div className='md:w-[50vw] p-4 rounded-2xl m-auto my-24 border border-(--border) bg-(--background) shadow-[0_10px_30px_rgba(5, 150, 105, 0.3)]'>
            {/* QR section */}
            <h1 className='text-2xl text-(--text) font-medium'>Scan the Ingredients List</h1>
            <p className='text-(--textLight)'>Scan food ingredients and make healthier choices</p>
            <div className='card mt-10 p-5 rounded-2xl flex flex-col items-center gap-5'>
                <div className='rounded-full bg-white/40 p-5'><Camera className='text-lg text-white' /></div>
                <h1 className='text-white text-2xl font-semibold'>Scan a product</h1>
                <p className='text-xs text-white'>Point your camera at ingredients list</p>
                <button onClick={()=>navigate("/scan")} className='p-5 bg-(--background) text-lg text-(--primary) rounded-2xl font-medium shadow-[0_4px_12px_rgba(0,0,0,0.1)]'>Start Scanning</button>
            </div>
            {/* Scanned details */}
            <div className='flex justify-between gap-3 mt-5'>
                <div className='px-5 py-4 w-[50%] rounded-2xl bg-(--surface)'>
                    <button className='text-(--primary) text-xl font-medium'>{totalItems}</button>
                    <h1 className='text-(--textLight) text-sm'>Products Scanned</h1>
                </div>
                <div className='px-5 py-4 w-[50%] rounded-2xl bg-(--surface)'>
                    <button className='text-(--primary) text-xl font-medium'>{safeItems}</button>
                    <h1 className='text-(--textLight) text-sm'>Safe Products</h1>
                </div>
            </div>
            {/* Recent Scans */}
            <div className='mt-5 flex justify-between'>
                <h1 className='font-medium text-lg'>Recent Scans</h1>
                <button className='text-(--primary) font-medium'>View all</button>
            </div>
            <div className='flex flex-col gap-3 mt-4'>
                {/* Map from here, details of scanned products */}
                {isLoadingScans && <h3>Loading the content. Please wait...</h3>}
                {totalItems==0 && <h3 className='text-(--textLight)'>Nothing to show!</h3>}
                {totalItems>0 && history.map((his, i)=>( <div key={i} className='flex items-center justify-between bg-(--surface) p-3 rounded-xl'>
                    <div>
                        <h1 className='font-medium text-(--text)'>{his.productName}</h1>
                        <p className='text-sm text-(--textLight)'>{timeAgo(his.timestamp)}</p>
                    </div>
                    {icons[his.verdict]}
                </div>
                ))}
            </div>

        </div>
    )
}

export default Scan
