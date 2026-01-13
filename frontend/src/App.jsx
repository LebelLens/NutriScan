import React, { useEffect } from 'react'
import './index.css'
import {Toaster} from 'react-hot-toast'
import Home from './Pages/Home'
import { Navigate, Route, Routes } from 'react-router-dom'
import History from './Pages/History'
import Profile from './Pages/Profile'
import Splash from './Pages/Splash'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Onboarding from './Pages/Onboarding'
import Scanner from './Pages/Scanner'
import Results from './Pages/Results'
import { useAuthContext } from './Context/authContext'
import { saveUserProfile } from './Services/db'

const App = () => {
  const {authUser, setAuthUser, isCheckingAuth, setIsCheckingAuth} = useAuthContext()

  useEffect(() => {
    const getUser = async () => {
      setIsCheckingAuth(true)
      try {
          const res = await fetch("http://localhost:5000/api/users/login/success", {
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
    getUser();
  }, [])

  useEffect(()=>{
    if(authUser){
      localStorage.setItem("NutriScan", JSON.stringify(authUser))
    }
  },[authUser])

  if(isCheckingAuth){
    return <div className='loading-spinner'>Loading...</div>
  }

  return (
    <div className=''>
      <Toaster/>
      <Routes>
        <Route path='/' element={<Splash />} />
        <Route path='/login' element={!authUser ? <Login />:<Navigate to={'/home'}/>} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/onboarding' element={<Onboarding/>} />
        <Route path='/home' element={authUser ? <Home />:<Navigate to={'/login'}/>} />
        <Route path='/history' element={authUser ? <History />:<Navigate to={'/login'}/>} />
        <Route path='/profile' element={authUser ? <Profile />:<Navigate to={'/login'}/>} />
        <Route path='/scan' element={authUser ? <Scanner />:<Navigate to={'/login'}/>} />
        <Route path='/results' element={authUser ? <Results />:<Navigate to={'/login'}/>} />
      </Routes>

    </div>
  )
}

export default App
