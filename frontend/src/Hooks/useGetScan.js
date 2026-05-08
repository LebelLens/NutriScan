import React, { useState } from 'react'
import { db, saveScan } from '../Services/db'
import toast from 'react-hot-toast'

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000"

const useGetScan = () => {
    const [isLoadingScans, setIsLoadingScans] = useState(false)
    
    // Getting the scans by user from MongoDB and storing it in IndexedDB
    const getScan= async ()=>{
        setIsLoadingScans(true)
        try {
            // calling server
          const res=await fetch(`${apiUrl}/api/scan`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              "Content-Type": 'application/json'
            },
          })
          const data= await res.json();
          console.log(data);
          // First clearing the IndexedDB if any scans are there and then saving all scans  
          await db.scans.clear()
          await data.map(async (scan)=>{
            await saveScan({
              productName: scan.productName,
              verdict: scan.verdict,
              riskLevel: scan.riskLevel,
              flaggedIngredients: scan.flaggedIngredients,
              positiveHighlights: scan.positiveHighlights,
              summary: scan.summary,
              timestamp: scan.createdAt
            })
          })
        } catch (error) {
          toast.log(error.message)
        }finally{
          setIsLoadingScans(false)
        }
    }
    
    return {getScan, isLoadingScans, setIsLoadingScans}
}

export default useGetScan