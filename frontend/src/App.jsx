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
import useGetUser from './Hooks/useGetUser'
import PWABadge from './PWABadge'

const App = () => {
  const {authUser, isCheckingAuth} = useAuthContext()
  const {getUser} = useGetUser()

  useEffect(() => {
    // Checking if user is logged in or not
    async function f(){
      await getUser()
    }
    f();
  }, [])

  useEffect(()=>{
    if(authUser){
      localStorage.setItem("NutriScan", JSON.stringify(authUser))
    }
  },[authUser])

  if(isCheckingAuth){
    return <div className='loading-spinner app-viewport'>
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500"></div>
      Loading...
    </div>
  }

  return (
    <div className='app-viewport'>
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            borderRadius: '16px',
            fontSize: '14px',
            padding: '12px 16px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)'
          }
        }}
      />
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
      <PWABadge />
    </div>
  )
}

export default App
