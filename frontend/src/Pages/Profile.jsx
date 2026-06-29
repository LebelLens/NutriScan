import React from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import UserProfile from '../Components/UserProfile'

const Profile = () => {
  return (
    <div className="relative min-h-screen flex flex-col pb-16">
      <Navbar/>
      <UserProfile/>
      <Footer open={'profile'}/>
    </div>
  )
}

export default Profile
