import React from 'react'
import { Camera, History, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Footer = (props) => {
    const navigate=useNavigate()
    return (
        <div className='fixed bottom-0 left-0 right-0 w-full px-4 py-5 flex justify-around backdrop-blur-lg z-50'>
            {/* Colour is selected according to props*/}
            <div onClick={()=>{navigate("/")}} className={`flex flex-col items-center ${props.open=='home'?'text-(--safe)':''}`}>
                <Camera className='cursor-pointer'/>
                <p>Scan</p>
            </div>
            <div onClick={()=>{navigate("/history")}} className={`flex flex-col items-center ${props.open=='history'?'text-(--safe)':''}`}>
                <History className='cursor-pointer' />
                <p>History</p>
            </div>
            <div onClick={()=>{navigate("/profile")}} className={`flex flex-col items-center ${props.open=='profile'?'text-(--safe)':''}`}>
                <User className='cursor-pointer' />
                <p>Profile</p>
            </div>

        </div>
    )
}

export default Footer
