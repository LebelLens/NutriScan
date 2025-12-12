import React, { useState } from 'react'
import { Heart, Check, AlertCircle, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
    const navigate=useNavigate();
    
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

    const Onboarding1 = () => {
        const step = Number(currentScreen[currentScreen.length - 1]);
        return <div className='bg-(--background) w-screen md:w-[50vw] flex flex-col gap-3 md:p-10 p-4 md:rounded-2xl md:m-auto md:my-4'>
            <div className='flex gap-2'>
                <div className={`h-1 border border-(--border) ${step >= 1 && 'bg-(--primary)'} w-[30%] rounded-xl`}></div>
                <div className={`h-1 border border-(--border) ${step >= 2 && 'bg-(--primary)'} w-[30%] rounded-xl`}></div>
                <div className={`h-1 border border-(--border) ${step >= 3 && 'bg-(--primary)'} w-[30%] rounded-xl`}></div>
            </div>
            <p className='text-xs text-(--textLight)'>Step {step} of 3</p>
            <div className="w-20 h-20 bg-green-300/30 flex justify-center items-center text-(--primary) rounded-2xl mt-3"><Heart size={40} strokeWidth={2.5} /></div>
            <h1 className='text-3xl font-bold'>Your Health Profile</h1>
            <p className='text-(--textLight)'>Select any health conditions you have. This helps us give you personalized advice.</p>
            <div className='flex flex-col gap-3'>
                {healthConditions.map((cond, id) => {
                    const isSelected = selectedCondition.includes(cond.id)
                    return <div key={id} onClick={() => toggleCondition(cond.id)} className={`p-5 flex gap-3 items-center justify-between rounded-2xl border-2 border-(--border) ${isSelected && 'border-(--primary) bg-green-400/30'} bg-(--surface)`}>
                        <div className='flex gap-3'>
                            <div className={`p-2 border ${isSelected && 'bg-(--primary)/60'} rounded-xl bg-(--background)`}>{cond.icon}</div>
                            <div>
                                <h1>{cond.name}</h1>
                                <p className='text-sm text-(--textLight)'>{cond.description}</p>
                            </div>
                        </div>

                        <div className='rounded-full h-6 w-6 border border-gray-400'>
                            {isSelected && <Check className='text-white bg-(--primary) rounded-full' />}
                        </div>
                    </div>
                })}
            </div>
            <div className='flex gap-3 items-center mt-3 justify-between'>
                <button onClick={() => setCurrentScreen('onboarding3')} className='w-[50%] border font-medium border-(--border) rounded-2xl p-4'>Skip for now</button>
                <button onClick={() => setCurrentScreen('onboarding' + `${step + 1}`)} className='card w-[50%] font-medium text-white rounded-2xl p-4'>Continue</button>
            </div>
        </div>
    }
    const Onboarding2 = () => {
        const step = Number(currentScreen[currentScreen.length - 1]);
        return <div className='bg-(--background) w-screen md:w-[50vw] flex flex-col gap-3 md:p-10 p-4 md:rounded-2xl md:m-auto md:my-4'>
            <div className='flex gap-2'>
                <div className={`h-1 border border-(--border) ${step >= 1 && 'bg-(--primary)'} w-[30%] rounded-xl`}></div>
                <div className={`h-1 border border-(--border) ${step >= 2 && 'bg-(--primary)'} w-[30%] rounded-xl`}></div>
                <div className={`h-1 border border-(--border) ${step >= 3 && 'bg-(--primary)'} w-[30%] rounded-xl`}></div>
            </div>
            <p className='text-xs text-(--textLight)'>Step {step} of 3</p>
            <div className="w-20 h-20 bg-red-300/30 flex justify-center items-center text-(--danger) rounded-2xl mt-3"><AlertCircle size={40} strokeWidth={2.5} /></div>
            <h1 className='text-3xl font-bold'>Food Allergies</h1>
            <p className='text-(--textLight)'>Select any food allergies you have. We'll alert you if a product contains these ingredients.</p>
            <div className='grid grid-cols-2 items-center justify-center gap-3'>
                {allergies.map((allergy, id) => {
                    const isSelected = selectedAllergies.includes(allergy.id)
                    return <div key={id} onClick={() => toggleAllergies(allergy.id)} className={`p-5 flex gap-3 items-center justify-center rounded-2xl border-2 border-(--border) ${isSelected && 'border-(--danger) bg-red-400/30'} bg-(--surface)`}>
                        <div className=''>
                            <div className={`p-2 flex justify-center`}>{allergy.icon}</div>
                            <h1>{allergy.name}</h1>
                        </div>
                    </div>
                })}
            </div>
            <div className='flex gap-3 items-center mt-3 justify-between'>
                <button onClick={() => setCurrentScreen('onboarding3')} className='w-[50%] border font-medium border-(--border) rounded-2xl p-4'>Skip for now</button>
                <button onClick={() => setCurrentScreen('onboarding' + `${step + 1}`)} className='card w-[50%] font-medium text-white rounded-2xl p-4'>Continue</button>
            </div>
        </div>
    }
    const Onboarding3 = () => {
        const step = Number(currentScreen[currentScreen.length - 1]);
        return <div className='bg-(--background) w-screen md:w-[50vw] flex flex-col gap-3 md:p-10 p-4 md:rounded-2xl md:m-auto md:my-4'>
            <div className='flex gap-2'>
                <div className={`h-1 border border-(--border) ${step >= 1 && 'bg-(--primary)'} w-[30%] rounded-xl`}></div>
                <div className={`h-1 border border-(--border) ${step >= 2 && 'bg-(--primary)'} w-[30%] rounded-xl`}></div>
                <div className={`h-1 border border-(--border) ${step >= 3 && 'bg-(--primary)'} w-[30%] rounded-xl`}></div>
            </div>
            <p className='text-xs text-(--textLight)'>Step {step} of 3</p>
            <div className='flex flex-col items-center justify-center gap-3'>
                <Check className='card text-white p-3 rounded-full' size={60} />
                <h1 className='text-3xl font-bold'>You're all set</h1>
                <p className='text-(--textLight)'>When you scan products, we'll analyze if they're safe for your health conditions and alert you about harmful ingredients.</p>
            </div>
            {selectedCondition.length > 0 && <div className='flex flex-col border-(--border) bg-(--surface) p-4 rounded-2xl gap-3'>

                <div className='flex gap-2 items-center'>
                    <div className="w-7 h-7 bg-green-300/30 flex items-center justify-center text-(--primary) rounded-md"><Heart size={15} strokeWidth={2.5} /></div>
                    <h1 className='text-lg font-medium'>Health Conditions</h1>
                </div>
                <div className='flex flex-wrap gap-2'>

                    {selectedCondition.map((cond, id) => {
                        const condition = healthConditions.find(c => c.id === cond)
                        return <div key={id} className='flex gap-2 items-center justify-center bg-(--background) rounded-xl p-2'>
                            <div>{condition.icon}</div>
                            <div>{condition.name}</div>
                        </div>
                    })}
                </div>
            </div>
            }
            {selectedAllergies.length > 0 && <div className='flex flex-col border-(--border) bg-(--surface) p-4 rounded-2xl gap-3'>

                <div className='flex gap-2 items-center'>
                    <div className="w-7 h-7 bg-red-300/30 flex justify-center items-center text-(--danger) rounded-xl"><AlertCircle size={15} strokeWidth={2.5} /></div>
                    <h1 className='text-lg font-medium'>Food Allergies</h1>
                </div>
                <div className='flex flex-wrap gap-2'>

                    {selectedAllergies.map((al, id) => {
                        const allergy = allergies.find(a => a.id === al)
                        return <div key={id} className='flex gap-2 items-center justify-center bg-(--background) rounded-xl p-2'>
                            <div>{allergy.icon}</div>
                            <div>{allergy.name}</div>
                        </div>
                    })}
                </div>
            </div>
            }
            <div className='flex bg-blue-200/20 gap-3 items-center justify-center p-4 rounded-2xl'>
                <Shield className='text-blue-500 h-7 w-7' size={10}/>
                <p className='text-(--textLight)'>Your health information is encrypted and never shared with third parties.</p>
            </div>

            <button onClick={()=>navigate("/home")} className='card p-5 rounded-2xl text-white'>Start Scanning</button>
            <p className='text-center text-(--textLight) text-xs'>You can change your profile anytime in settings</p>
        </div>
    }
    return (
        <div>
            {currentScreen === 'onboarding1' && <Onboarding1 />}
            {currentScreen === 'onboarding2' && <Onboarding2 />}
            {currentScreen === 'onboarding3' && <Onboarding3 />}
        </div>
    )
}

export default Onboarding
