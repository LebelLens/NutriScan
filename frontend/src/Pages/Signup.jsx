import { Star, User, ArrowLeft } from 'lucide-react'
import { Mail, Lock } from 'lucide-react';
import React, { useState } from 'react'
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
        <div className="w-full min-h-screen bg-slate-50 px-6 py-8 flex flex-col justify-between">
            {/* Header / Back */}
            <div className="flex items-center justify-between mb-4">
                <button 
                    onClick={() => navigate("/")}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-all"
                >
                    <ArrowLeft size={20} className="text-slate-600" />
                </button>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sign Up</span>
                <div className="w-9 h-9"></div> {/* Spacer to center title */}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full my-auto">
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-emerald-600 flex items-center justify-center rounded-2xl text-white shadow-lg shadow-indigo-500/20 mb-4 animate-pulse">
                        <Star size={32} className="fill-white/10" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Create Account</h2>
                    <p className="text-sm text-slate-500 mt-1">Start your journey to healthier eating</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Full Name */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider" htmlFor="name">Full Name</label>
                        <div className="bg-white border border-slate-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10 flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all shadow-xs">
                            <User size={18} className="text-slate-400" />
                            <input 
                                value={name} 
                                onChange={(e)=>setName(e.target.value)} 
                                className="w-full outline-hidden bg-transparent text-slate-800 text-sm" 
                                type="text" 
                                id="name" 
                                placeholder="John Doe" 
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider" htmlFor="email">Email Address</label>
                        <div className="bg-white border border-slate-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10 flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all shadow-xs">
                            <Mail size={18} className="text-slate-400" />
                            <input 
                                value={email} 
                                onChange={(e)=>setEmail(e.target.value)} 
                                className="w-full outline-hidden bg-transparent text-slate-800 text-sm" 
                                type="email" 
                                id="email" 
                                placeholder="name@example.com" 
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider" htmlFor="password">Password</label>
                        <div className="bg-white border border-slate-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10 flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all shadow-xs">
                            <Lock size={18} className="text-slate-400" />
                            <input 
                                value={password} 
                                onChange={(e)=>setPassword(e.target.value)} 
                                className="w-full outline-hidden bg-transparent text-slate-800 text-sm" 
                                type="password" 
                                id="password" 
                                placeholder="At least 8 characters" 
                            />
                        </div>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-start gap-3 mt-2">
                        <input 
                            checked={isChecked} 
                            onChange={()=>setIsChecked(!isChecked)} 
                            type="checkbox" 
                            id="check" 
                            className="mt-1 w-4 h-4 rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                        <label className="text-xs text-slate-500 leading-normal" htmlFor="check">
                            I agree to the{' '}
                            <button type="button" className="font-bold text-emerald-600 hover:underline">Terms of Service</button>
                            {' '}and{' '}
                            <button type="button" className="font-bold text-emerald-600 hover:underline">Privacy Policy</button>
                        </label>
                    </div>

                    {isLoading ? (
                        <button 
                            disabled
                            className="mt-4 bg-emerald-600/70 text-white font-bold p-4 rounded-2xl w-full flex items-center justify-center gap-2"
                        >
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Creating Account...
                        </button>
                    ) : (
                        <button 
                            type="submit" 
                            className="mt-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-bold p-4 rounded-2xl w-full shadow-lg shadow-emerald-600/20 active:scale-98 transition-all"
                        >
                            Create Account
                        </button>
                    )}
                </form>
            </div>

            {/* Footer */}
            <div className="text-center mt-6">
                <p className="text-slate-500 text-sm">
                    Already have an account?{' '}
                    <button 
                        onClick={() => navigate("/login")} 
                        className="font-bold text-emerald-600 hover:text-emerald-700"
                    >
                        Sign In
                    </button>
                </p>
            </div>
        </div>
    )
}

export default Signup
