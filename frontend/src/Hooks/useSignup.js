import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuthContext } from '../Context/authContext'

const useSignup = () => {
    const { setAuthUser } = useAuthContext()
    const [isLoading, setIsLoading] = useState(false)

    // This function handles the signup functionality
    const signupUser = async ({ fullName, email, password }) => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/auth/signup", {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ fullName, email, password }),
            })
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error)
            }
            localStorage.setItem("NutriScan", JSON.stringify(data))
            setAuthUser(data);
        } catch (error) {
            toast.error("Error while signup", error)
        } finally {
            setIsLoading(false)
        }
    }
    return {signupUser, isLoading}
}

export default useSignup
