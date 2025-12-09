import React from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import PreviousSearched from '../Components/PreviousSearched'

const History = () => {
  return (
    <div>
      <Navbar/>
      <PreviousSearched/>
      <Footer open={'history'}/>
    </div>
  )
}

export default History
