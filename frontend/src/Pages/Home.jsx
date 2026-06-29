import React from 'react'
import Navbar from '../Components/Navbar'
import Scan from '../Components/Scan'
import Footer from '../Components/Footer'

const Home = () => {
  return (
    <div className="relative min-h-screen flex flex-col pb-16">
      <Navbar/>
      <Scan/>
      <Footer open={'home'}/>
    </div>
  )
}

export default Home
