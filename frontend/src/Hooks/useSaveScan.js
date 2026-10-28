import React from 'react'
import toast from 'react-hot-toast'
import { saveScan } from '../Services/db'

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000"

const useSaveScan = () => {
    const saveToMongoDB = async (scanData)=>{
      try {
        const res = await fetch(`${apiUrl}/api/scan`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            "Content-Type": 'application/json'
          },
          body: JSON.stringify(scanData),
        })
        const data = await res.json();
        
        // Save in IndexedDB
        await saveScan({
            productName: data.productName,
            verdict: data.verdict,
            riskLevel: data.riskLevel,
            flaggedIngredients: data.flaggedIngredients,
            positiveHighlights: data.positiveHighlights,
            summary: data.summary,
            timestamp: data.createdAt
        })

        console.log(data);
        
      } catch (error) {
        toast.error(error.message)
      }
    }

    return {saveToMongoDB}
}

export default useSaveScan