import React from 'react'
import '../index.css'

const Navbar = () => {
  return (
    <div className='fixed top-0 left-0 right-0 w-full px-4 py-7 flex justify-between backdrop-blur-lg z-50'>
      <h1 className='text-4xl font-semibold'>LebelLens</h1>
      <button className='border px-2 rounded-md bg-(--secondary) text-white'>Logout</button>
    </div>
  )
}

export default Navbar
