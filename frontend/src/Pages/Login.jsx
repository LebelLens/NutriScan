import { Heart, ArrowLeft } from 'lucide-react'
import { Mail, Lock } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import useLogin from '../Hooks/useLogin';
import toast from 'react-hot-toast';

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000"

const Login = () => {
    const navigate = useNavigate()
    const { LoginUser, isLoading } = useLogin();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            return toast.error("Please fill all the fields")
        }
        await LoginUser({ email, password });
        setEmail("")
        setPassword("")
    }

    const handleLoginGoogle = () => {
        window.location.href = `${apiUrl}/api/users/auth/google`
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
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sign In</span>
                <div className="w-9 h-9"></div> {/* Spacer to center title */}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full my-auto">
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-tr from-emerald-600 to-indigo-600 flex items-center justify-center rounded-2xl text-white shadow-lg shadow-emerald-500/20 mb-4 animate-bounce [animation-duration:3s]">
                        <Heart size={32} className="fill-white/10" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Welcome back</h2>
                    <p className="text-sm text-slate-500 mt-1">Sign in to continue your health journey</p>
                </div>

                {/* Social Login */}
                <button 
                    onClick={handleLoginGoogle} 
                    className="flex items-center gap-3 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 font-semibold p-4 w-full justify-center shadow-xs transition-all active:scale-98"
                >
                    <FcGoogle size={22} />
                    <span className="text-slate-700 text-sm">Continue with Google</span>
                </button>

                {/* Divider */}
                <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-slate-200"></div>
                    <span className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">or</span>
                    <div className="flex-1 border-t border-slate-200"></div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider" htmlFor="email">Email Address</label>
                        <div className="bg-white border border-slate-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10 flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all shadow-xs">
                            <Mail size={18} className="text-slate-400" />
                            <input 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                className="w-full outline-hidden bg-transparent text-slate-800 text-sm" 
                                type="email" 
                                id="email" 
                                placeholder="name@example.com" 
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider" htmlFor="password">Password</label>
                            <button type="button" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">Forgot?</button>
                        </div>
                        <div className="bg-white border border-slate-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10 flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all shadow-xs">
                            <Lock size={18} className="text-slate-400" />
                            <input 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                className="w-full outline-hidden bg-transparent text-slate-800 text-sm" 
                                type="password" 
                                id="password" 
                                placeholder="••••••••" 
                            />
                        </div>
                    </div>

                    {isLoading ? (
                        <button 
                            disabled
                            className="mt-4 bg-emerald-600/70 text-white font-bold p-4 rounded-2xl w-full flex items-center justify-center gap-2"
                        >
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Signing In...
                        </button>
                    ) : (
                        <button 
                            type="submit" 
                            className="mt-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-bold p-4 rounded-2xl w-full shadow-lg shadow-emerald-600/20 active:scale-98 transition-all"
                        >
                            Sign In
                        </button>
                    )}
                </form>
            </div>

            {/* Footer */}
            <div className="text-center mt-6">
                <p className="text-slate-500 text-sm">
                    Don't have an account?{' '}
                    <button 
                        onClick={() => navigate("/signup")} 
                        className="font-bold text-emerald-600 hover:text-emerald-700"
                    >
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    )
}

export default Login
