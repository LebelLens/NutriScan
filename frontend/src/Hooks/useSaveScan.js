import React from 'react'
import toast from 'react-hot-toast'

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
        console.log(data);
        
      } catch (error) {
        toast.error(error.message)
      }
    }

    return {saveToMongoDB}
}

export default useSaveScan