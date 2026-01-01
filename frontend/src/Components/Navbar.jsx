import React from 'react'
import '../index.css'
import toast from 'react-hot-toast'
import { useAuthContext } from '../Context/authContext'

const apiUrl = import.meta.env.API_URL || "http://localhost:5000"


const Navbar = () => {
  const {setAuthUser}=useAuthContext()

  const handleLogout = async ()=>{
    try {
      const res = await fetch(`${apiUrl}/api/users/logout`, {
        method: "POST", 
        credentials: 'include'
      });
      if(res.ok){
        localStorage.removeItem("NutriScan")
        setAuthUser(null)
      }      
    } catch (error) {
      toast.error("Error while logout")
    }
  }

  return (
    <div className='fixed top-0 left-0 right-0 w-full px-4 py-7 flex justify-between backdrop-blur-lg z-50'>
      <h1 className='flex items-center text-4xl font-bold'><img className='h-10 w-10' src="../../favicon.svg" alt="" />NutriScan</h1>
      <button onClick={handleLogout} className='border px-2 rounded-md bg-(--secondary) text-white'>Logout</button>
    </div>
  )
}

export default Navbar
