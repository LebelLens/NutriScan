import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuthContext } from '../Context/authContext'

const useLogin = () => {
    const {setAuthUser}=useAuthContext()
    const [isLoading, setisLoading] = useState(false)
    
    // This function handles the login functionality
    const LoginUser = async ({ email, password }) => {
        setisLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error)
            }
            localStorage.setItem("NutriScan", JSON.stringify(data))
            setAuthUser(data);
        } catch (error) {
            toast.error("Error while login", error)
        } finally {
            setisLoading(false)
        }
    }
 
    return {LoginUser, isLoading}
}

export default useLogin
