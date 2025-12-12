import React from 'react'
import './index.css'
import Home from './Pages/Home'
import { Route, Routes } from 'react-router-dom'
import History from './Pages/History'
import Profile from './Pages/Profile'
import Splash from './Pages/Splash'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Onboarding from './Pages/Onboarding'

const App = () => {
  return (
    <div className=''>
      <Routes>
        <Route path='/' element={<Splash />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={<Home />} />
        <Route path='/history' element={<History />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/onboarding' element={<Onboarding/>} />
      </Routes>

    </div>
  )
}

export default App
