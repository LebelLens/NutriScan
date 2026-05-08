import React from 'react'
import { saveUserProfile } from '../Services/db';
import { useAuthContext } from '../Context/authContext';

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000"

const useGetUser = () => {
    const {authUser, setAuthUser, setIsCheckingAuth}=useAuthContext()
    // Checking if user is logged in or not if yes saving userdata to IndexedDB
    const getUser = async () => {
      setIsCheckingAuth(true)
      try {
          const res = await fetch(`${apiUrl}/api/users/login/success`, {
              method: 'GET',
              credentials: 'include',
              headers: {
                  'content-type': 'application/json',
              }
          });            
          const data = await res.json()
          if(data.success) {
            console.log(data.user);
            
            await saveUserProfile({
              name: data.user.name,
              email: data.user.email,
              conditions: data.user.healthData? data.user.healthData.healthCondition: [],
              allergies: data.user.healthData? data.user.healthData.allergy: [],
            })

            // If user is loggedin with google setting the authUser
            if(data.user.googleId){                            
              setAuthUser({
                id: data.user._id,
                name: data.user.name,
                email: data.user.email,
              })
            }
          }
          console.log(authUser);
      } catch (err) {
          console.log("Not logged in");
      } finally {
        setIsCheckingAuth(false)
      }
    };

    return {getUser}
}

export default useGetUser