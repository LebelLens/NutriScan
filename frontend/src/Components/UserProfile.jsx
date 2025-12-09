import { User, PlusIcon } from 'lucide-react'
import React from 'react'

const UserProfile = () => {
  return (
    <div className='md:w-[50vw] p-4 rounded-2xl m-auto my-24 border border-(--border) bg-(--background) shadow-[0_10px_30px_rgba(5, 150, 105, 0.3)]'>
      {/* Health profile */}
      <h1 className='text-2xl font-semibold'>Health Profile</h1>
      <div className='card rounded-2xl flex gap-4 py-6 px-3 mt-4'>
        <User className='w-15 h-15 text-white bg-white/30 rounded-full p-3'/>
        <div className=''>
            <h1 className='text-white font-xl font-semibold'>Your profile</h1>
            <p className='text-white/50'>Last updated today</p>
        </div>
      </div>
      {/* Checkboxes of health conditions */}
      <div className='flex flex-col gap-4 mt-5'>
        <h1 className='text-xl font-semibold'>Health Conditions</h1>
        <div className='flex gap-2 bg-white rounded-lg p-4 items-center'>
            <input type="checkbox" name="" id="" />
            <span>Diabetes</span>
        </div>
        <div className='flex gap-2 bg-white rounded-lg p-4 items-center'>
            <input type="checkbox" name="" id="" />
            <span>Hypertension</span>
        </div>
        <div className='flex gap-2 bg-white rounded-lg p-4 items-center'>
            <input type="checkbox" name="" id="" />
            <span>High Cholesterol</span>
        </div>
      </div>
      {/* Allergies */}
      <div className='mt-5 flex flex-col gap-4'>
        <h1 className='text-xl font-semibold'>Allergies</h1>
        <div className='flex gap-3'>
            <span className='p-3 rounded-full bg-white'>Peanuts</span>
            <span className='p-3 rounded-full bg-white'>Dairy</span>
            {/* Add allergies */}
            <span className='flex gap-2 bg-(--safe) text-white items-center rounded-full p-3'><PlusIcon className='w-5 h-5'/>Add</span>
        </div>
        {/* Update profile */}
        <button className='text-2xl text-white font-semibold bg-(--safe) w-full p-3 rounded-lg'>Save Profile</button>
      </div>
    </div>
  )
}

export default UserProfile
