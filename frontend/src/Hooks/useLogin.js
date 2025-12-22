import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuthContext } from '../Context/authContext'

const apiUrl = import.meta.env.API_URL || "http://localhost:5000"


const useLogin = () => {
    const {setAuthUser}=useAuthContext()
    const [isLoading, setisLoading] = useState(false)
    
    // This function handles the login functionality
    const LoginUser = async ({ email, password }) => {
        setisLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/users/login`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error)
            }
            if(data.success){
                localStorage.setItem("NutriScan", JSON.stringify(data.user))
                setAuthUser(data.user);
            }
            else throw new Error(data.message)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setisLoading(false)
        }
    }
 
    return {LoginUser, isLoading}
}

export default useLogin
