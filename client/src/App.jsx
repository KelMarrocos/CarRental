import React, { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'

// Layout
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Layout from './pages/owner/Layout'

// Pages
import Home from './pages/Home'
import Cars from './pages/Cars'
import CarDetails from './pages/CarDetails'
import MyBookings from './pages/MyBookings'

// Owner pages
import Dashboard from './pages/owner/Dashboard'
import AddCar from './pages/owner/AddCar'
import EditCar from './pages/owner/EditCar'
import ManageCars from './pages/owner/ManageCars'
import ManageBookings from './pages/owner/ManageBookings'

const App = () => {
  const [showLogin, setShowLogin] = useState(false)

  const location = useLocation()
  const isOwnerPath = location.pathname.startsWith('/owner')

  return (
    <>
      {/* Navbar só aparece fora do painel do dono */}
      {!isOwnerPath && <Navbar setShowLogin={setShowLogin} />}

      <Routes>
        {/* Public */}
        <Route path='/' element={<Home />} />
        <Route path='/cars' element={<Cars />} />
        <Route path='/cars/:id' element={<CarDetails />} />
        <Route path='/my-bookings' element={<MyBookings />} />

        {/* Owner (nested routes) */}
        <Route path='/owner' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='add-car' element={<AddCar />} />
          <Route path='edit-car/:id' element={<EditCar />} />
          <Route path='manage-cars' element={<ManageCars />} />
          <Route path='manage-bookings' element={<ManageBookings />} />
        </Route>

        {/* 404 */}
        <Route path='*' element={<h1>Page not found</h1>} />
      </Routes>

      {/* Footer só aparece fora do painel */}
      {!isOwnerPath && <Footer />}
    </>
  )
}

export default App