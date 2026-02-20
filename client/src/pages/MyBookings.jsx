import React, { useEffect, useState } from 'react'
import { dummyMyBookingsData } from '../data/mockData'
import Title from '../components/Title'
import BookingCard from '../components/BookingCard'

/*
====================================
        MyBookings Page
====================================

Responsabilidade:
-> Buscar bookings
-> Renderizar lista
-> Controlar empty state

Futuro:
✔ integrar API
✔ paginação
✔ filtros
✔ busca
*/

const MyBookings = () => {

  const [bookings, setBookings] = useState([])
  const currency = import.meta.env.VITE_CURRENCY || "$"

  useEffect(() => {
    // Simulando fetch da API
    setBookings(dummyMyBookingsData)
  }, [])

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 
    mt-16 text-sm max-w-7xl mx-auto'>

      <Title
        title="My Bookings"
        subtitle="View and manage all your car bookings."
        align='left'
      />

      {/* ================================
            EMPTY STATE (MUUUUITO PRO)
      ================================= */}

      {bookings.length === 0 && (
        <div className='mt-20 text-center text-gray-500'>
          You have no bookings yet.
        </div>
      )}

      {/* ================================
            BOOKINGS LIST
      ================================= */}

      <div className='mt-10 space-y-6'>
        {bookings.map((booking) => (
          <BookingCard
            key={booking._id}
            booking={booking}
            currency={currency}
          />
        ))}
      </div>

    </div>
  )
}

export default MyBookings