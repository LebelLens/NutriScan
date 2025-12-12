import React from 'react'
import { Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Splash = () => {
  const navigate=useNavigate();
  return (
    <div className='w-screen min-h-screen md:w-[50vw] md:min-h-[85vh] flex flex-col gap-3 items-center justify-center md:p-10 p-4 md:rounded-2xl md:m-auto md:my-4 card'>
      <div className="w-30 h-30 bg-white/30 flex justify-center items-center text-white rounded-4xl animate-pulse [animation-duration:2s]"><Heart size={64} strokeWidth={2.5}/></div>
      <h1 className="text-3xl text-white font-bold mt-4">NutriScan</h1>
      <p className="text-white/90 text-center" >Scan ingredients, understand risks, make healthier choices</p>
      <button onClick={()=>navigate("/login")} className="w-[80%] bg-white text-(--primary) p-4 rounded-2xl mt-5">Get Started</button>
      <button onClick={()=>navigate("/login")} className='w-[80%] bg-white/30 text-white p-4 rounded-2xl'>I already have an account</button>
    </div>
  )
}

export default Splash
