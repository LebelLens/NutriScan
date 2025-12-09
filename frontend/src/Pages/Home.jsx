import React from 'react'
import Navbar from '../Components/Navbar'
import Scan from '../Components/Scan'
import Footer from '../Components/Footer'

const Home = () => {
  return (
    <div>
      <Navbar/>
      <Scan/>
      <Footer open={'home'}/>
    </div>
  )
}

export default Home
