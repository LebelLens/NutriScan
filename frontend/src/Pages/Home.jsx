import React, { useEffect } from 'react'
import Navbar from '../Components/Navbar'
import Scan from '../Components/Scan'
import Footer from '../Components/Footer'
import { useAuthContext } from '../Context/authContext'

const Home = () => {
  const {setAuthUser, setIsCheckingAuth} = useAuthContext()

  return (
    <div>
      <Navbar/>
      <Scan/>
      <Footer open={'home'}/>
    </div>
  )
}

export default Home
