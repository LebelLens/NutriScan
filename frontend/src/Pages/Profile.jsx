import React from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import UserProfile from '../Components/UserProfile'

const Profile = () => {
  return (
    <div>
      <Navbar/>
      <UserProfile/>
      <Footer open={'profile'}/>
    </div>
  )
}

export default Profile
