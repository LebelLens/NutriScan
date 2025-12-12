import { Heart } from 'lucide-react'
import { Mail, Lock } from 'lucide-react';
import React from 'react'
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate=useNavigate()
    return (
        <div className='w-screen md:w-[50vw] flex flex-col gap-3 items-center justify-center md:p-10 p-4 md:rounded-2xl md:m-auto md:my-4 bg-(--background)'>
            <div className='card flex items-center justify-center h-20 w-20 rounded-2xl text-white'><Heart size={40} /></div>
            <h1 className='text-4xl font-bold'>Welcome back</h1>
            <p className='text-gray-700'>Sign in to continue your health journey</p>
            <button className='flex items-center gap-2 rounded-2xl bg-white p-3 w-[80%] justify-center'><FcGoogle />Continue with Google</button>
            <div className='flex gap-3 w-full items-center justify-center'>
                <hr className='text-gray-400 w-[40%] bg-gray-700' />
                <span>OR</span>
                <hr className='text-gray-400 w-[40%]' />
            </div>
            <form className='flex w-full flex-col gap-4' action="">
                <label>Email</label>
                <div className='bg-white border border-(--border) flex gap-2 p-3 rounded-xl'>
                    <Mail className='text-gray-400'/>
                    <input className='outline-0' type="email" id='email' placeholder='Enter your email' />
                </div>
                <label htmlFor="passwordDiv">Password</label>
                <div id='passwordDiv' className='bg-white border border-(--border) flex gap-2 p-3 rounded-xl'>
                    <Lock className='text-gray-400'/>
                    <input className='outline-0' type="password" id='password' placeholder='••••••••' />
                </div>
            </form>
            <button className='text-(--primary) text-end w-full'>Forgot password?</button>
            <button className='card text-white p-3 rounded-xl w-full'>Sign In</button>
            <span className='text-sm'>Don't have an account? <button onClick={()=>navigate("/signup")} className='text-(--primary)'>Sign Up</button></span>
        </div>
    )
}

export default Login
