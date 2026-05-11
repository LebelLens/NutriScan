import React, { useEffect, useState } from 'react'
import { Scan, XCircle, MoveRightIcon, AlertCircle, CircleCheck, CheckCircle, AlertTriangle } from 'lucide-react'
import { getScanHistory } from '../Services/db'
import { timeAgo } from '../utils/timeConverter'

const PreviousSearched = () => {
    const [recent, setRecent] = useState(null)

    const verdictConfig = {
    safe: {
      color: 'green',
      bg: 'bg-green-50',
      border: 'border-green-500',
      text: 'text-green-700',
      icon: <CheckCircle className='text-(--safe)'/>,
      label: 'Safe to Eat'
    },
    caution: {
      color: 'yellow',
      bg: 'bg-yellow-50',
      border: 'border-yellow-500',
      text: 'text-yellow-700',
      icon: <AlertTriangle className='text-(--caution)'/>,
      label: 'Eat with Caution'
    },
    avoid: {
      color: 'red',
      bg: 'bg-red-50',
      border: 'border-red-500',
      text: 'text-red-700',
      icon: <XCircle className='text-(--danger)'/>,
      label: 'Avoid This Product'
    }
  };

    useEffect(() => {
      async function f(){
        // Getting the recent scan
        const r= await getScanHistory(1)
        console.log(r);
        
        setRecent(r[0])
      }
      f()
    }, [])

    
    if(!recent){
        return <div className='flex items-center justify-center mt-25 text-(--textLight)'>No recent scans found.</div>
    }
    
    const config=verdictConfig[recent.verdict]
    return (
        <div className='md:w-[50vw] p-4 rounded-2xl m-auto my-24 border border-(--border) bg-(--background) shadow-[0_10px_30px_rgba(5, 150, 105, 0.3)]'>
            {/* Last scanned product's name */}
            <div className='bg-(--surface) flex flex-col gap-3 items-center justify-center rounded-2xl'>
                <Scan className='bg-(--background) p-4 w-15 h-15 rounded-2xl text-(--textLight) mt-4' />
                <h1 className='text-lg font-medium text-(--text)'>{recent.productName}</h1>
                <p className='text-(--textLight)'>{timeAgo(recent.timestamp)}</p>
            </div>
            {/* Product's details*/}
            <div className='flex flex-col gap-4'>
                <div className={`mt-5 flex gap-2 border-2 ${config.bg} ${config.border} bg-red-400/10 rounded-2xl p-4`}>
                    {config.icon}
                    <p className={`${config.text}`}>{config.label}</p>
                </div>
                {recent.verdict!=='safe' && <div className='bg-(--surface) rounded-xl p-4'>
                    <h1 className='text-(--text) text-xl'>Why you should {recent.verdict === 'avoid' ? 'avoid' : 'be caution with'} this:</h1>
                    <p className='text-(--textLight) text-sm w-[95%] m-auto mt-2'>{recent.summary}</p>
                </div>}
            </div>
            {/* List of ingredients */}
            <div className='space-y-3'>
                <div className='flex flex-col gap-2'>
                    <h3 className="text-lg font-semibold px-1 mb-2">Flagged Ingredients</h3>
                    {recent.flaggedIngredients==0 && <div>Nothing to show</div>}
                    {recent.flaggedIngredients?.map((ingredient, index) => {
                        const riskColor = ingredient.risks[0] === 'high' ? 'red' : 'yellow';
                        return (
                        <div
                            key={index}
                            className={`bg-white rounded-2xl p-4 shadow-sm border-2 ${riskColor==='red'?'border-red-200 hover:border-red-400':'border-yellow-200 hover:border-yellow-400'} cursor-pointer transition-all`}
                        >
                            <div className="flex items-start gap-3">
                            <div className={`w-12 h-12 ${riskColor==='red'?'bg-red-100':'bg-yellow-100'} rounded-xl flex items-center justify-center shrink-0`}>
                                <AlertTriangle size={24} className={`${riskColor==='red'?'text-red-600':'text-yellow-600'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 mb-1">{ingredient.name}</h4>
                                <p className="text-sm text-gray-600 mb-2">{ingredient.description}</p>
                                <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-1 ${riskColor==='red'?'bg-red-100':'bg-yellow-100'} ${riskColor==='red'?'text-red-700':'text-yellow-700'} rounded-full font-medium`}>
                                    {ingredient.risks[0]}
                                </span>
                                </div>
                            </div>
                            </div>
                        </div>
                        );
                    })}
                </div>

                {recent.positiveHighlights?.length>0 && <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-3">Healthy Highlights</h3>
                    <div className="grid grid-cols-1 gap-2">
                        {recent.positiveHighlights?.map((item, index) => (
                        <div key={index} className="bg-green-50 p-3 rounded-lg border border-green-200">
                            <span className="text-sm font-semibold">{item.name}: </span>
                            <span className="text-gray-800 text-sm">{item.description}</span>
                        </div>
                        ))}
                    </div>
                </div>}

            </div>
            {/* Related to database buttons (Does not do anything) */}
            <div className='flex gap-3 mt-4'>
                <button className='p-3 bg-(--surface) rounded-lg'>Save to History</button>
                <button className='p-3 bg-(--safe) rounded-lg'>Find Alternatives</button>
            </div>
        </div>
    )
}

export default PreviousSearched
