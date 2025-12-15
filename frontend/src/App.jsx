import React from 'react'
import './index.css'
import {Toaster} from 'react-hot-toast'
import Home from './Pages/Home'
import { Route, Routes } from 'react-router-dom'
import History from './Pages/History'
import Profile from './Pages/Profile'
import Splash from './Pages/Splash'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Onboarding from './Pages/Onboarding'
import Scanner from './Pages/Scanner'
import Results from './Pages/Results'

const App = () => {
  return (
    <div className=''>
      <Toaster/>
      <Routes>
        <Route path='/' element={<Splash />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/onboarding' element={<Onboarding/>} />
        <Route path='/home' element={<Home />} />
        <Route path='/history' element={<History />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/scan' element={<Scanner/>} />
        <Route path='/results' element={<Results />} />
      </Routes>

    </div>
  )
}

export default App
