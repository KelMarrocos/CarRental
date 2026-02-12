import React, { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'

// Layout
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Pages
import Home from './pages/Home'
import CarDetails from './pages/CarDetails'
import Cars from './pages/Cars'
import MyBookings from './pages/MyBookings'

/*
  App Component

  Responsável por:

  ✔ Gerenciar rotas
  ✔ Controlar layout global
  ✔ Evitar renderizações desnecessárias
*/

const App = () => {
  // controla modal/login futuramente
  const [showLogin, setShowLogin] = useState(false)

  // identifica se estamos na área do proprietário
  const location = useLocation()
  const isOwnerPath = location.pathname.startsWith('/owner')

  return (
    <>
      {/* Navbar só aparece fora do painel do dono */}
      {!isOwnerPath && <Navbar setShowLogin={setShowLogin} />}

      {/* Router */}
      <Routes>
        {/* Landing */}
        <Route path='/' element={<Home />} />

        {/* Catálogo */}
        <Route path='/cars' element={<Cars />} />
        <Route path='/cars-details/:id' element={<CarDetails />} />

        {/* Usuário */}
        <Route path='/my-bookings' element={<MyBookings />} />

        {/* Opcional: rota catch-all para página 404 */}
        <Route path='*' element={<h1>Page not found</h1>} />
      </Routes>

      {/* Footer só aparece fora do painel */}
      {!isOwnerPath && <Footer />}
    </>
  )
}

export default App