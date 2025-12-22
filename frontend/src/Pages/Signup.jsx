import { Star, User } from 'lucide-react'
import { Mail, Lock } from 'lucide-react';
import React, { useState } from 'react'
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import useSignup from '../Hooks/useSignup';
import toast from 'react-hot-toast';

const Signup = () => {
    const navigate = useNavigate()
    const {isLoading, signupUser}=useSignup()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isChecked, setIsChecked] = useState(false)

    const handleSubmit=async(e)=>{
        e.preventDefault()
        if(!name || !email || !password) return toast.error("You must fill all the fields")
        if(!isChecked){
            return toast.error("You must agree to our Terms of Service and Privacy Policy")
        }
        await signupUser({name, email, password})
        setEmail("")
        setName("")
        setPassword("")
        navigate("/onboarding")
    }
    return (
        <div className='w-screen md:w-[50vw] flex flex-col gap-3 items-center justify-center md:p-10 p-4 md:rounded-2xl md:m-auto md:my-4 bg-(--background)'>
            <div className='card flex items-center justify-center h-20 w-20 rounded-2xl text-white'><Star size={40} /></div>
            <h1 className='text-4xl font-bold'>Create Account</h1>
            <p className='text-gray-700'>Start your journey to healthier eating</p>
            <form onSubmit={handleSubmit} className='flex w-full flex-col gap-4 mt-5' action="">
                <label className=''>Full Name</label>
                <div className='bg-white border border-(--border) flex gap-2 p-3 rounded-xl'>
                    <User className='text-gray-400' />
                    <input value={name} onChange={(e)=>setName(e.target.value)} className='outline-0' type="text" id='name' placeholder='Enter your full name' />
                </div>
                <label>Email</label>
                <div className='bg-white border border-(--border) flex gap-2 p-3 rounded-xl'>
                    <Mail className='text-gray-400' />
                    <input value={email} onChange={(e)=>setEmail(e.target.value)} className='outline-0' type="email" id='email' placeholder='Enter your email' />
                </div>
                <label htmlFor="">Password</label>
                <div className='bg-white border border-(--border) flex gap-2 p-3 rounded-xl'>
                    <Lock className='text-gray-400' />
                    <input value={password} onChange={(e)=>setPassword(e.target.value)} className='outline-0' type="password" id='password' placeholder='At least 8 characters' />
                </div>
            </form>
            <div className='flex gap-2'>
                <input checked={isChecked} onChange={()=>setIsChecked(!isChecked)} type="checkbox" name="" id="check" />
                <label className='text-sm' htmlFor="check">I agree to the <button className='text-(--primary)'>Terms of Service</button> and <button className='text-(--primary)'>Privacy Policy</button></label>
            </div>
            {isLoading ? <button onClick={handleSubmit} className='card mt-3 text-white p-3 rounded-xl w-full'>Loading...</button>:<button onClick={handleSubmit} className='card mt-3 text-white p-3 rounded-xl w-full'>Create Account</button>}
            <span className='text-sm'>Already have an account? <button onClick={() => navigate("/login")} className='text-(--primary)'>Sign In</button></span>
        </div>
    )
}

export default Signup
