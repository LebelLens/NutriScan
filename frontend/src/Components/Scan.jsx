import React from 'react'
import { AlertCircle, Camera, CircleCheck, X, XCircle } from 'lucide-react'
import '../index.css'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { getScanHistory } from '../Services/db'
import { useState } from 'react'

function timeAgo(timestamp) {
  const now = Date.now();
  const secondsPast = (now - timestamp) / 1000;

  if (secondsPast < 60) {
    return 'Just now';
  }
  if (secondsPast < 3600) {
    const m = Math.floor(secondsPast / 60);
    return `${m} minute${m > 1 ? 's' : ''} ago`;
  }
  if (secondsPast < 86400) {
    const h = Math.floor(secondsPast / 3600);
    return `${h} hour${h > 1 ? 's' : ''} ago`;
  }
  if (secondsPast < 604800) {
    const d = Math.floor(secondsPast / 86400);
    return `${d} day${d > 1 ? 's' : ''} ago`;
  }
  if (secondsPast < 2592000) { // Approx 30 days
    const w = Math.floor(secondsPast / 604800);
    return `${w} week${w > 1 ? 's' : ''} ago`;
  }
  if (secondsPast < 31536000) {
    const mo = Math.floor(secondsPast / 2592000);
    return `${mo} month${mo > 1 ? 's' : ''} ago`;
  }

  const y = Math.floor(secondsPast / 31536000);
  return `${y} year${y > 1 ? 's' : ''} ago`;
}


const Scan = () => {
    const navigate = useNavigate()
    const [history, setHistory] = useState([])

    const icons={
        'avoid': <XCircle size={20} className='text-(--danger)'/>,
        'caution': <AlertCircle size={20} className='text-(--caution)'/>,
        'safe': <CircleCheck size={20} className='text-(--safe)'/>,
    }

    useEffect(() => {
      async function f() {
        const h = await getScanHistory(3);
        setHistory(h)
      }
      f()
    }, [])
    
    return (
        <div className='md:w-[50vw] p-4 rounded-2xl m-auto my-24 border border-(--border) bg-(--background) shadow-[0_10px_30px_rgba(5, 150, 105, 0.3)]'>
            {/* QR section */}
            <h1 className='text-2xl text-(--text) font-medium'>Scan the Barcode</h1>
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
                    <button className='text-(--primary) text-xl font-medium'>10</button>
                    <h1 className='text-(--textLight) text-sm'>Products Scanned</h1>
                </div>
                <div className='px-5 py-4 w-[50%] rounded-2xl bg-(--surface)'>
                    <button className='text-(--primary) text-xl font-medium'>4</button>
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
                {history.map(his=>( <div className='flex items-center justify-between bg-(--surface) p-3 rounded-xl'>
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
