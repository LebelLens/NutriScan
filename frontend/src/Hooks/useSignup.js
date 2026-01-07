import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuthContext } from '../Context/authContext'

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000"

const useSignup = () => {
    const { setAuthUser } = useAuthContext()
    const [isLoading, setIsLoading] = useState(false)

    // This function handles the signup functionality
    const signupUser = async ({ name, email, password }) => {
        setIsLoading(true)
        try {
            const res = await fetch(`${apiUrl}/api/users/signup`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name, email, password }),
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
            console.log(error);
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }
    return {signupUser, isLoading}
}

export default useSignup
