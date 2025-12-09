import React from 'react'
import { Camera, XCircle } from 'lucide-react'
import '../index.css'

const Scan = () => {
    return (
        <div className='md:w-[50vw] p-4 rounded-2xl m-auto my-24 border border-(--border) bg-(--background) shadow-[0_10px_30px_rgba(5, 150, 105, 0.3)]'>
            {/* QR section */}
            <h1 className='text-2xl text-(--text) font-medium'>Scan the QR</h1>
            <p className='text-(--textLight)'>Scan food ingredients and make healthier choices</p>
            <div className='card mt-10 p-5 rounded-2xl flex flex-col items-center gap-5'>
                <div className='rounded-full bg-white/40 p-5'><Camera className='text-lg text-white' /></div>
                <h1 className='text-white text-2xl font-semibold'>Scan a product</h1>
                <p className='text-xs text-white'>Point your camera at ingredients list</p>
                <button className='p-5 bg-(--background) text-lg text-(--primary) rounded-2xl font-medium shadow-[0_4px_12px_rgba(0,0,0,0.1)]'>Start Scanning</button>
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
                <div className='flex items-center justify-between bg-(--surface) p-3 rounded-xl'>
                    <div>
                        <h1 className='font-medium text-(--text)'>Lays Chips</h1>
                        <p className='text-sm text-(--textLight)'>1 hour ago</p>
                    </div>
                    <XCircle className='text-(--danger)'/>
                </div>
                <div className='flex items-center justify-between bg-(--surface) p-3 rounded-xl'>
                    <div>
                        <h1 className='font-medium text-(--text)'>Lays Chips</h1>
                        <p className='text-sm text-(--textLight)'>1 hour ago</p>
                    </div>
                    <XCircle className='text-(--danger)'/>
                </div>
                <div className='flex items-center justify-between bg-(--surface) p-3 rounded-xl'>
                    <div>
                        <h1 className='font-medium text-(--text)'>Lays Chips</h1>
                        <p className='text-sm text-(--textLight)'>1 hour ago</p>
                    </div>
                    <XCircle className='text-(--danger)'/>
                </div>
            </div>

        </div>
    )
}

export default Scan
