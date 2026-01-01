import React from 'react'
import { useState } from 'react'
import { saveUserProfile } from '../Services/db'
import { useAuthContext } from '../Context/authContext'
import toast from 'react-hot-toast'

const apiUrl = import.meta.env.API_URL || "http://localhost:5000"


export const useSaveUserProfile = () => {
    const [isLoading, setIsLoading] = useState(false)
    const {authUser}=useAuthContext()

  const saveToIndexedDB=async(selectedCondition, selectedAllergies)=>{
    setIsLoading(true)
    try {
        await saveUserProfile({
        name: authUser.name,
        email: authUser.email,
        conditions: selectedCondition,
        allergies: selectedAllergies,
   })
    } catch (error) {
        toast.error(error.message)
    } finally {
        setIsLoading(false)
    }
  }

  const saveToDB=async(selectedCondition, selectedAllergies)=>{
    setIsLoading(true)
    try {
        const res=await fetch(`${apiUrl}/api/health`, {
            method: 'POST',
            credentials: 'include',
            headers: {"content-type": 'application/json'},
            body: JSON.stringify({healthCondition: selectedCondition, allergy: selectedAllergies}),
        })
        const data = await res.json();
        if(data.error){
            throw new Error(data.error)
        }
        return data;
    } catch (error) {
        toast.error(error.message)
    } finally {
        setIsLoading(false)
    }
  }

  return {isLoading, saveToIndexedDB, saveToDB}
}

export const useGetUserProfile=()=>{
    const [isLoadingGet, setIsLoadingGet] = useState(false)

    const getUserProfile = async ()=>{
        setIsLoadingGet(true)
        try {
            const res= await fetch(`${apiUrl}/api/health`, {
                method: 'GET',
                credentials: 'include',
            })
            const data = await res.json()
            if(data.error){
                throw new Error(data.error)
            }
            return data;
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsLoadingGet(false)
        }
        
    }
    return {isLoadingGet, getUserProfile}
}

export const useUpdateUserProfile=()=>{
    const [isLoadingUpdate, setisLoadingUpdate] = useState(false)

    const updateUserProfile =async (newHealthConditions, newAllergies)=>{
        setisLoadingUpdate(true)
        try {
           const res=await fetch(`${apiUrl}/api/health`, {
            method: 'PUT',
            credentials: 'include',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({healthCondition: newHealthConditions, allergy: newAllergies})
            })
            const data = await res.json()
            if(data.error){
                throw new Error(data.error)
            } 
            return data;
        } catch (error) {
            toast.error(error.message)
        } finally{
            setisLoadingUpdate(false)
        }
        
    }

    return {isLoadingUpdate, updateUserProfile}
}
