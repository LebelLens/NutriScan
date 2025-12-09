import React from 'react'
import { Scan, XCircle, MoveRightIcon } from 'lucide-react'

const PreviousSearched = () => {
    return (
        <div className='md:w-[50vw] p-4 rounded-2xl m-auto my-24 border border-(--border) bg-(--background) shadow-[0_10px_30px_rgba(5, 150, 105, 0.3)]'>
            {/* Last scanned product's name */}
            <div className='bg-(--surface) flex flex-col gap-3 items-center justify-center rounded-2xl'>
                <Scan className='bg-(--background) p-4 w-15 h-15 rounded-2xl text-(--textLight) mt-4' />
                <h1 className='text-lg font-medium text-(--text)'>Lays Chips</h1>
                <p className='text-(--textLight)'>Scanned 1 hour ago</p>
            </div>
            {/* Product's details*/}
            <div className='flex flex-col gap-4'>
                <div className='mt-5 flex border-2 border-(--danger) text-(--danger) bg-red-400/10 rounded-2xl p-4'>
                    <XCircle className='w-15' />
                    <p className=''>Avoid This</p>
                </div>
                <div className='bg-(--surface) rounded-xl p-4'>
                    <h1 className='text-(--text) text-xl'>Why should you avoid this:</h1>
                    <p className='text-(--textLight) text-sm w-[95%] m-auto mt-2'>Contains 3 ingredients harmful for diabetes High sodium content (520mg per serving) May cause blood sugar spikes</p>
                </div>
            </div>
            {/* List of ingredients */}
            <div>
                <h1 className='text-xl font-medium'>Flagged Ingredients</h1>
                <div className='mt-4 flex flex-col gap-2'>
                    <div className='relative border-2 border-(--danger) bg-(--surface) rounded-xl p-4'>
                        <h1 className='text-xl font-medium'>Palm Oil</h1>
                        <p className='text-(--textLight)'>Raises the risk of heart diseases</p>
                        <MoveRightIcon className='absolute right-4 top-1/3'/>
                    </div>
                    <div className='relative border-2 border-(--caution) bg-(--surface) rounded-xl p-4'>
                        <h1 className='text-xl font-medium'>High Sodium</h1>
                        <p className='text-(--textLight)'>Raises blood pressure</p>
                        <MoveRightIcon className='absolute right-4 top-1/3'/>
                    </div>
                </div>
            </div>
            {/* Related to database buttons */}
            <div className='flex gap-3 mt-4'>
                <button className='p-3 bg-(--surface) rounded-lg'>Save to History</button>
                <button className='p-3 bg-(--safe) rounded-lg'>Find Alternatives</button>
            </div>
        </div>
    )
}

export default PreviousSearched
