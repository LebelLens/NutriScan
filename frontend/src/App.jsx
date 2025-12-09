import React from 'react'
import './index.css'
import Home from './Pages/Home'
import { Route, Routes } from 'react-router-dom'
import History from './Pages/History'
import Profile from './Pages/Profile'

const App = () => {
  return (
    <div className=''>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/history' element={<History />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>

    </div>
  )
}

export default App
