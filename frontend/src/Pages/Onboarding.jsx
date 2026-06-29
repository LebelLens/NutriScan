import React, { useState } from 'react'
import { Heart, Check, AlertCircle, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { saveUserProfile } from '../Services/db';
import toast from 'react-hot-toast';
import {useSaveUserProfile} from '../Hooks/useUserProfile.js';

const Onboarding = () => {
    const navigate=useNavigate();

    const {isLoading, saveToIndexedDB, saveToDB}=useSaveUserProfile()
    
    const [currentScreen, setCurrentScreen] = useState('onboarding1');
    const [selectedCondition, setSelectedCondition] = useState([])
    const [selectedAllergies, setSelectedAllergies] = useState([])

    const healthConditions = [
        { id: 'diabetes', name: 'Diabetes', icon: '🩸', description: 'Blood sugar management' },
        { id: 'hypertension', name: 'Hypertension', icon: '💓', description: 'High blood pressure' },
        { id: 'heart', name: 'Heart Disease', icon: '❤️', description: 'Cardiovascular conditions' },
        { id: 'cholesterol', name: 'High Cholesterol', icon: '📊', description: 'Lipid management' },
        { id: 'kidney', name: 'Kidney Disease', icon: '🫘', description: 'Renal conditions' },
    ];

    const allergies = [
        { id: 'peanuts', name: 'Peanuts', icon: '🥜' },
        { id: 'tree-nuts', name: 'Tree Nuts', icon: '🌰' },
        { id: 'dairy', name: 'Dairy', icon: '🥛' },
        { id: 'eggs', name: 'Eggs', icon: '🥚' },
        { id: 'soy', name: 'Soy', icon: '🫘' },
        { id: 'wheat', name: 'Wheat', icon: '🌾' },
        { id: 'fish', name: 'Fish', icon: '🐟' },
        { id: 'shellfish', name: 'Shellfish', icon: '🦐' }
    ];

    // handling conditions
    const toggleCondition = (id) => {
        let newConditions = [];
        if (selectedCondition.includes(id)) {
            newConditions = selectedCondition.filter(cond => cond !== id);
        } else {
            newConditions = [...selectedCondition, id]
        }
        console.log(newConditions);

        setSelectedCondition(newConditions);
    }

    // handling allergies
    const toggleAllergies = (id) => {
        let newAllergies = [];
        if (selectedAllergies.includes(id)) {
            newAllergies = selectedAllergies.filter(cond => cond !== id);
        } else {
            newAllergies = [...selectedAllergies, id]
        }
        console.log(newAllergies);

        setSelectedAllergies(newAllergies);
    }

    // saving user profile to Databases
    const handleScanning = async()=>{
        try {
            // save to IndexedDB
            await saveToIndexedDB(selectedCondition, selectedAllergies)

            // save to db   
            await saveToDB(selectedCondition, selectedAllergies)
            if(!isLoading){
                toast.success("Profile saved")
                navigate("/home")
            }
        } catch (error) {
           toast.error("Error to save in profile", error) 
        }
    }

    const Onboarding1 = () => {
        const step = Number(currentScreen[currentScreen.length - 1]);
        return (
            <div className="w-full min-h-screen bg-slate-50 p-6 flex flex-col justify-between">
                <div>
                    {/* Progress Bar */}
                    <div className="flex gap-2 mb-4">
                        <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-emerald-600' : 'bg-slate-200'}`}></div>
                        <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-emerald-600' : 'bg-slate-200'}`}></div>
                        <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${step >= 3 ? 'bg-emerald-600' : 'bg-slate-200'}`}></div>
                    </div>
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step {step} of 3</span>
                        <button onClick={() => setCurrentScreen('onboarding2')} className="text-xs font-bold text-emerald-600 hover:text-emerald-700">Skip</button>
                    </div>

                    {/* Step Intro */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 bg-emerald-500/10 flex justify-center items-center text-emerald-600 rounded-2xl">
                            <Heart size={28} className="fill-emerald-500/10" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Your Health Profile</h1>
                            <p className="text-xs text-slate-500 mt-0.5">Select health conditions for personalized advice.</p>
                        </div>
                    </div>

                    {/* Options List */}
                    <div className="flex flex-col gap-3">
                        {healthConditions.map((cond, id) => {
                            const isSelected = selectedCondition.includes(cond.id)
                            return (
                                <div 
                                    key={id} 
                                    onClick={() => toggleCondition(cond.id)} 
                                    className={`p-4 flex gap-4 items-center justify-between rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                                        isSelected 
                                            ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' 
                                            : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-xs'
                                    }`}
                                >
                                    <div className="flex gap-3.5 items-center">
                                        <div className={`w-12 h-12 flex items-center justify-center text-2xl rounded-xl transition-all ${
                                            isSelected ? 'bg-emerald-500/20 scale-105' : 'bg-slate-100'
                                        }`}>
                                            {cond.icon}
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-slate-800 text-sm">{cond.name}</h2>
                                            <p className="text-xs text-slate-400 font-medium mt-0.5">{cond.description}</p>
                                        </div>
                                    </div>

                                    <div className={`rounded-full h-6 w-6 border-2 flex items-center justify-center transition-all ${
                                        isSelected ? 'bg-emerald-500 border-emerald-500 scale-105' : 'border-slate-300 bg-white'
                                    }`}>
                                        {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="flex gap-4 items-center mt-6">
                    <button 
                        onClick={() => setCurrentScreen('onboarding2')} 
                        className="flex-1 border-2 border-slate-200 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-50 active:scale-98 transition-all"
                    >
                        Skip
                    </button>
                    <button 
                        onClick={() => setCurrentScreen('onboarding2')} 
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-600 active:scale-98 transition-all"
                    >
                        Continue
                    </button>
                </div>
            </div>
        )
    }

    const Onboarding2 = () => {
        const step = Number(currentScreen[currentScreen.length - 1]);
        return (
            <div className="w-full min-h-screen bg-slate-50 p-6 flex flex-col justify-between">
                <div>
                    {/* Progress Bar */}
                    <div className="flex gap-2 mb-4">
                        <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-emerald-600' : 'bg-slate-200'}`}></div>
                        <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-emerald-600' : 'bg-slate-200'}`}></div>
                        <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${step >= 3 ? 'bg-emerald-600' : 'bg-slate-200'}`}></div>
                    </div>
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step {step} of 3</span>
                        <button onClick={() => setCurrentScreen('onboarding3')} className="text-xs font-bold text-emerald-600 hover:text-emerald-700">Skip</button>
                    </div>

                    {/* Step Intro */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 bg-rose-500/10 flex justify-center items-center text-rose-500 rounded-2xl">
                            <AlertCircle size={28} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Food Allergies</h1>
                            <p className="text-xs text-slate-500 mt-0.5">Select allergies to get ingredients warnings.</p>
                        </div>
                    </div>

                    {/* Grid List */}
                    <div className="grid grid-cols-2 gap-3">
                        {allergies.map((allergy, id) => {
                            const isSelected = selectedAllergies.includes(allergy.id)
                            return (
                                <div 
                                    key={id} 
                                    onClick={() => toggleAllergies(allergy.id)} 
                                    className={`p-4 flex flex-col items-center justify-center text-center rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                                        isSelected 
                                            ? 'border-rose-500 bg-rose-50/50 shadow-sm' 
                                            : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-xs'
                                    }`}
                                >
                                    <span className={`text-3xl p-2 rounded-xl mb-2 transition-all ${isSelected ? 'bg-rose-500/20 scale-110 rotate-3' : 'bg-slate-55'}`}>
                                        {allergy.icon}
                                    </span>
                                    <h2 className="font-bold text-slate-800 text-sm">{allergy.name}</h2>
                                    <div className={`mt-2.5 rounded-full h-5.5 w-5.5 border-2 flex items-center justify-center transition-all ${
                                        isSelected ? 'bg-rose-500 border-rose-500' : 'border-slate-300 bg-white'
                                    }`}>
                                        {isSelected && <Check size={12} className="text-white" strokeWidth={3} />}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="flex gap-4 items-center mt-6">
                    <button 
                        onClick={() => setCurrentScreen('onboarding3')} 
                        className="flex-1 border-2 border-slate-200 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-50 active:scale-98 transition-all"
                    >
                        Skip
                    </button>
                    <button 
                        onClick={() => setCurrentScreen('onboarding3')} 
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-600 active:scale-98 transition-all"
                    >
                        Continue
                    </button>
                </div>
            </div>
        )
    }

    const Onboarding3 = () => {
        const step = Number(currentScreen[currentScreen.length - 1]);
        return (
            <div className="w-full min-h-screen bg-slate-50 p-6 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-6">
                    {/* Progress Bar */}
                    <div className="flex gap-2">
                        <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-emerald-600' : 'bg-slate-200'}`}></div>
                        <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-emerald-600' : 'bg-slate-200'}`}></div>
                        <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${step >= 3 ? 'bg-emerald-600' : 'bg-slate-200'}`}></div>
                    </div>

                    {/* Completion Hero */}
                    <div className="flex flex-col items-center justify-center text-center py-4">
                        <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-4 animate-bounce [animation-duration:3s]">
                            <Check size={40} strokeWidth={3} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">You're all set!</h1>
                        <p className="text-xs text-slate-500 max-w-xs mt-1">
                            We'll customize ingredient checks based on your unique health profile during every scan.
                        </p>
                    </div>

                    {/* Summary Sections */}
                    <div className="space-y-3">
                        {selectedCondition.length > 0 && (
                            <div className="flex flex-col border border-slate-100 bg-white p-4.5 rounded-2xl shadow-xs">
                                <div className="flex gap-2.5 items-center mb-3">
                                    <div className="w-7 h-7 bg-emerald-500/10 flex items-center justify-center text-emerald-600 rounded-lg">
                                        <Heart size={16} strokeWidth={2.5} />
                                    </div>
                                    <h2 className="font-bold text-slate-800 text-sm">Monitored Conditions</h2>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {selectedCondition.map((cond, id) => {
                                        const condition = healthConditions.find(c => c.id === cond)
                                        return (
                                            <div key={id} className="flex gap-1.5 items-center bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700">
                                                <span>{condition.icon}</span>
                                                <span>{condition.name}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {selectedAllergies.length > 0 && (
                            <div className="flex flex-col border border-slate-100 bg-white p-4.5 rounded-2xl shadow-xs">
                                <div className="flex gap-2.5 items-center mb-3">
                                    <div className="w-7 h-7 bg-rose-500/10 flex items-center justify-center text-rose-500 rounded-lg">
                                        <AlertCircle size={16} strokeWidth={2.5} />
                                    </div>
                                    <h2 className="font-bold text-slate-800 text-sm">Active Allergies</h2>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {selectedAllergies.map((al, id) => {
                                        const allergy = allergies.find(a => a.id === al)
                                        return (
                                            <div key={id} className="flex gap-1.5 items-center bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700">
                                                <span>{allergy.icon}</span>
                                                <span>{allergy.name}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Privacy Note */}
                    <div className="flex bg-sky-500/5 border border-sky-500/10 gap-3 items-start p-4 rounded-2xl">
                        <Shield className="text-sky-600 shrink-0 mt-0.5" size={20} />
                        <p className="text-xs text-sky-800 font-medium leading-relaxed">
                            Your health preferences are stored locally and encrypted securely. Your details are never shared with advertisers or third parties.
                        </p>
                    </div>
                </div>

                <div className="mt-8 space-y-3">
                    <button 
                        onClick={handleScanning} 
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold p-4.5 rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-98 transition-all hover:brightness-105"
                    >
                        Start Scanning
                    </button>
                    <p className="text-center text-slate-400 text-xs font-medium">
                        You can adjust these settings at any time in your profile.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full min-h-screen bg-slate-50">
            {currentScreen === 'onboarding1' && <Onboarding1 />}
            {currentScreen === 'onboarding2' && <Onboarding2 />}
            {currentScreen === 'onboarding3' && <Onboarding3 />}
        </div>
    )
}

export default Onboarding
