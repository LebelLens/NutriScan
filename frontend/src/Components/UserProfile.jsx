import { User, PlusIcon, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {useGetUserProfile, useUpdateUserProfile, useSaveUserProfile} from '../Hooks/useUserProfile'
import toast from 'react-hot-toast';

// function to convert time to moment
function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 0) return "in the future";

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval + (interval === 1 ? " year ago" : " years ago");

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval + (interval === 1 ? " month ago" : " months ago");

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + (interval === 1 ? " day ago" : " days ago");

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + (interval === 1 ? " hour ago" : " hours ago");

  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + (interval === 1 ? " minute ago" : " minutes ago");

  return "just now";
}

const UserProfile = () => {
  const {isLoadingGet, getUserProfile}=useGetUserProfile()
  const {isLoadingUpdate, updateUserProfile}=useUpdateUserProfile()
  const {saveToDB}=useSaveUserProfile()

  const [profile, setProfile] = useState({})
  const [extraConditions, setExtraConditions] = useState([])
  const [extraAllergies, setExtraAllergies] = useState([])

  // fetching userProfile from db
  useEffect(()=>{
    async function f(){
      const data= await getUserProfile();
      setProfile(data)
    }
    f()
  }, [])
  

  const handleUpdate=async ()=>{
    console.log(extraAllergies, extraConditions);
    
    if(Object.keys(profile).length===0){
      let newProfile = await saveToDB(extraConditions, extraAllergies)

      if(newProfile){
        setProfile([newProfile])      
        toast.success("Updated Successfully")
        setExtraAllergies([])
        setExtraConditions([])
      }
      return;
    }
    const newConditions=[...profile[0]?.healthCondition, ...extraConditions];
    const newAllergies=[...profile[0]?.allergy, ...extraAllergies]
    const newProfile=await updateUserProfile(newConditions, newAllergies)
    if(newProfile){
      setProfile([newProfile])      
      toast.success("Updated Successfully")
      setExtraAllergies([])
      setExtraConditions([])
    }
  }
  
  if(isLoadingGet || isLoadingUpdate){
    return (
      <div>Loading...</div>
    )
  }

  return (
    <div className='md:w-[50vw] p-4 rounded-2xl m-auto my-24 border border-(--border) bg-(--background) shadow-[0_10px_30px_rgba(5, 150, 105, 0.3)]'>
      {/* Health profile */}
      <h1 className='text-2xl font-semibold'>Health Profile</h1>
      <div className='card rounded-2xl flex gap-4 py-6 px-3 mt-4'>
        <User className='w-15 h-15 text-white bg-white/30 rounded-full p-3'/>
        <div className=''>
            <h1 className='text-white font-xl font-semibold'>Your profile</h1>
            <p className='text-white/50'>Last updated {timeAgo(profile[0]?.updatedAt)}</p>
        </div>
      </div>
      {/* Checkboxes of health conditions */}
      <div className='flex flex-col gap-4 mt-5'>
        <h1 className='text-xl font-semibold'>Health Conditions</h1>
        {profile[0]?.healthCondition && profile[0].healthCondition.map((c, i)=>{
          return (
            <div key={i} className='flex gap-2 bg-(--primary)/10 rounded-lg p-4 items-center border border-(--primary)'>
              <input checked={true} readOnly type="checkbox" />
              <span>{c}</span>
            </div>
          )
        })}

        {/* Render dynamically added input fields */}
        {extraConditions.map((val, idx) => (
          <div key={idx} className='flex gap-2 w-full border rounded-lg justify-between items-center'>
            <input
              value={val}
              onChange={e => {
                const copy = [...extraConditions]
                copy[idx] = e.target.value
                setExtraConditions(copy)                
              }}
              placeholder='Health condition'
              className='p-2 rounded-lg outline-0'
            />
            {/* Remove button */}
            <button
              onClick={() => setExtraConditions(prev => prev.filter((_, i) => i !== idx))}
              className='text-red-500 px-2'
            ><X/></button>
          </div>
        ))}

        {/* add more health condition button */}
        <button onClick={() => setExtraConditions(prev => [...prev, ''])} className='flex w-1/3 text-xs font-medium gap-2 bg-(--safe) text-white items-center rounded-xl p-2'>
          <PlusIcon className='w-5 h-5'/>Add health conditions
        </button>

      </div>
      {/* Allergies */}
      <div className='mt-5 flex flex-col gap-4'>
        <h1 className='text-xl font-semibold'>Allergies</h1>
        <div className='flex gap-2 flex-wrap text-sm'>
            {profile[0]?.allergy && profile[0].allergy.map((a, i)=>{
              return <span key={i} className='p-3 rounded-xl bg-(--danger)/10 border border-(--danger)'>{a}</span>
            })}
            <div className='flex gap-2 flex-wrap'>

            {/* Render dynamically added input fields */}
            {extraAllergies.map((val, idx) => (
              <div key={idx} className='flex justify-between border rounded-xl items-center'>
                <input
                  value={val}
                  onChange={e => {
                    const copy = [...extraAllergies]
                    copy[idx] = e.target.value
                    setExtraAllergies(copy)                
                  }}
                  placeholder='Allergy'
                  className='p-1 rounded-lg w-15 outline-0'
                  />
                <button
                  onClick={() => setExtraAllergies(prev => prev.filter((_, i) => i !== idx))}
                  className='text-red-500'
                  ><X size={15}/></button>
              </div>
            ))}
            </div>
            {/* Add allergies */}
            <span onClick={() => setExtraAllergies(prev => [...prev, ''])} className='flex gap-2 bg-(--safe) text-white items-center rounded-full p-3'><PlusIcon className='w-5 h-5'/>Add</span>
        </div>
        {/* Update profile */}
        <button onClick={handleUpdate} className='text-2xl text-white font-semibold bg-(--safe) w-full p-3 rounded-lg'>Save Profile</button>
      </div>
    </div>
  )
}

export default UserProfile
