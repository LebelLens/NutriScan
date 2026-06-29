import { User, PlusIcon, X, Check, ShieldAlert, Award, Calendar } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useGetUserProfile, useUpdateUserProfile, useSaveUserProfile } from '../Hooks/useUserProfile'
import toast from 'react-hot-toast';
import { useAuthContext } from '../Context/authContext';

// function to convert time to moment
function timeAgo(dateString) {
  if (!dateString) return "never";
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
  const { authUser } = useAuthContext();
  const { isLoadingGet, getUserProfile } = useGetUserProfile()
  const { isLoadingUpdate, updateUserProfile } = useUpdateUserProfile()
  const { saveToDB } = useSaveUserProfile()

  const [profile, setProfile] = useState({})
  const [extraConditions, setExtraConditions] = useState([])
  const [extraAllergies, setExtraAllergies] = useState([])

  // fetching userProfile from db
  useEffect(() => {
    async function f() {
      const data = await getUserProfile();
      setProfile(data)
    }
    f()
  }, [])

  const handleUpdate = async () => {
    // Filter out empty values
    const filteredConditions = extraConditions.filter(c => c.trim() !== '')
    const filteredAllergies = extraAllergies.filter(a => a.trim() !== '')

    if (Object.keys(profile).length === 0) {
      let newProfile = await saveToDB(filteredConditions, filteredAllergies)
      if (newProfile) {
        setProfile([newProfile])
        toast.success("Updated Successfully")
        setExtraAllergies([])
        setExtraConditions([])
      }
      return;
    }
    const newConditions = [...(profile[0]?.healthCondition || []), ...filteredConditions];
    const newAllergies = [...(profile[0]?.allergy || []), ...filteredAllergies]
    const newProfile = await updateUserProfile(newConditions, newAllergies)
    if (newProfile) {
      setProfile([newProfile])
      toast.success("Updated Successfully")
      setExtraAllergies([])
      setExtraConditions([])
    }
  }

  if (isLoadingGet || isLoadingUpdate) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 py-12 text-slate-400 gap-2">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-semibold">Syncing profile...</span>
      </div>
    )
  }

  const userProfileData = profile[0] || {};

  return (
    <div className="flex-1 overflow-y-auto px-5 pt-4 pb-28 bg-slate-50">
      {/* Profile Header */}
      <h1 className="text-2xl font-black text-slate-800 tracking-tight mb-5">Profile Settings</h1>
      
      {/* User Info Card */}
      <div className="card rounded-3xl p-5 text-white mb-6 relative overflow-hidden shadow-lg shadow-emerald-700/20">
        <div className="absolute top-[-30%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
        <div className="flex gap-4 items-center relative z-10">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/25">
            <User size={30} className="text-white fill-white/15" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight">{authUser?.name || 'Healthy Eater'}</h2>
            <p className="text-xs text-emerald-100/70">{authUser?.email}</p>
            <div className="flex items-center gap-1 text-[10px] text-emerald-100/80 font-bold mt-1.5 bg-emerald-800/30 px-2.5 py-0.5 rounded-full inline-flex">
              <Calendar size={10} />
              <span>Profile updated {timeAgo(userProfileData.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Health Conditions Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Health Conditions</h3>
            <span className="text-xxs font-bold text-slate-400">MONITORED</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {/* Existing conditions */}
            {userProfileData.healthCondition?.length === 0 && extraConditions.length === 0 && (
              <p className="text-xs font-semibold text-slate-450 italic bg-white p-4 rounded-2xl border border-slate-100 text-center">
                No health conditions selected.
              </p>
            )}
            
            {userProfileData.healthCondition?.map((c, i) => (
              <div key={i} className="flex gap-3 bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 items-center justify-between shadow-xxs">
                <div className="flex items-center gap-2.5">
                  <div className="w-5.5 h-5.5 bg-emerald-550/10 text-emerald-600 rounded-full flex items-center justify-center">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className="text-sm font-bold text-slate-700">{c}</span>
                </div>
                <span className="text-[10px] font-extrabold uppercase bg-emerald-100/50 text-emerald-800 px-2 py-0.5 rounded-md">Active</span>
              </div>
            ))}

            {/* Custom additions */}
            {extraConditions.map((val, idx) => (
              <div key={idx} className="flex gap-2 w-full bg-white border border-slate-200 focus-within:border-emerald-500 px-3.5 py-1.5 rounded-2xl items-center justify-between shadow-xxs transition-all">
                <input
                  value={val}
                  onChange={e => {
                    const copy = [...extraConditions]
                    copy[idx] = e.target.value
                    setExtraConditions(copy)
                  }}
                  placeholder="e.g. Gluten Sensitivity"
                  className="w-full text-slate-800 text-sm font-bold bg-transparent outline-hidden py-2"
                  autoFocus
                />
                <button
                  onClick={() => setExtraConditions(prev => prev.filter((_, i) => i !== idx))}
                  className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          <button 
            onClick={() => setExtraConditions(prev => [...prev, ''])} 
            className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-dashed border-slate-300 hover:border-slate-400 text-slate-600 hover:text-slate-800 font-bold text-xs rounded-2xl transition-all cursor-pointer mt-1"
          >
            <PlusIcon size={14} />
            <span>Add health condition</span>
          </button>
        </div>

        {/* Allergies Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Allergies & Intolerances</h3>
            <span className="text-xxs font-bold text-slate-400">WARNINGS</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {/* Existing allergies */}
            {userProfileData.allergy?.length === 0 && extraAllergies.length === 0 && (
              <p className="text-xs font-semibold text-slate-450 italic bg-white p-4 rounded-2xl border border-slate-100 text-center">
                No food allergies specified.
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {userProfileData.allergy?.map((a, i) => (
                <span 
                  key={i} 
                  className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-extrabold shadow-xxs"
                >
                  <ShieldAlert size={14} />
                  <span>{a}</span>
                </span>
              ))}
            </div>

            {/* Custom additions */}
            {extraAllergies.map((val, idx) => (
              <div key={idx} className="flex gap-2 w-full bg-white border border-slate-200 focus-within:border-emerald-500 px-3.5 py-1.5 rounded-2xl items-center justify-between shadow-xxs transition-all">
                <input
                  value={val}
                  onChange={e => {
                    const copy = [...extraAllergies]
                    copy[idx] = e.target.value
                    setExtraAllergies(copy)
                  }}
                  placeholder="e.g. Peanut, Shellfish"
                  className="w-full text-slate-800 text-sm font-bold bg-transparent outline-hidden py-2"
                  autoFocus
                />
                <button
                  onClick={() => setExtraAllergies(prev => prev.filter((_, i) => i !== idx))}
                  className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          <button 
            onClick={() => setExtraAllergies(prev => [...prev, ''])} 
            className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-dashed border-slate-300 hover:border-slate-400 text-slate-600 hover:text-slate-800 font-bold text-xs rounded-2xl transition-all cursor-pointer mt-1"
          >
            <PlusIcon size={14} />
            <span>Add allergy</span>
          </button>
        </div>

        {/* Update Profile Button */}
        <button 
          onClick={handleUpdate} 
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-extrabold py-4 rounded-2xl shadow-xl shadow-emerald-500/15 active:scale-98 transition-all text-sm mt-8"
        >
          Save Profile Updates
        </button>
      </div>
    </div>
  )
}

export default UserProfile
