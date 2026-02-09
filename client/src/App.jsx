import React, { useState } from 'react'
import Navbar from './components/navbar'
import { Route ,Routes, useLocation } from 'react-router-dom'
import Home from './pages/home'
import CarDetails from './pages/CarDetails'
import Cars from './pages/Cars'
import MyBookings from './pages/MyBookings'

const App = () => {

  const [showLogin, setShowLogin] = React.useState(false)
  const isOwnerPath = useLocation().pathname.startsWith('/owner')

  return (
    <>
      {!isOwnerPath && <Navbar setShowLogin={setShowLogin}/>}

      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/cars/:id' element={<CarDetails/>}/>
        <Route path='/cars' element={<Cars/>}/>
        <Route path='/my-bookings' element={<MyBookings/>}/>
      </Routes>
    </>
  )
}

export default App