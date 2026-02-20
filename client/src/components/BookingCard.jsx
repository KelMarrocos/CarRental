import React from 'react'
import { assets } from '../constants/assets'

/*
====================================
        Booking Card Component
====================================

Responsabilidade:
-> Renderizar UM booking
-> Facilitar manutenção
-> Evitar código gigante no MyBookings

Futuro:
✔ adicionar botão "Cancel Booking"
✔ adicionar "Download receipt"
✔ animações
✔ rating pós-viagem
*/

const BookingCard = ({ booking, currency }) => {

  /*
  ====================================
        STATUS STYLES (ESCALÁVEL)
  ====================================

  Se amanhã surgirem novos status,
  basta adicionar aqui.
  */

  const statusStyles = {
    confirmed: "bg-green-400/15 text-green-600",
    pending: "bg-yellow-400/15 text-yellow-600",
    cancelled: "bg-red-400/15 text-red-600",
  }

  /*
  ====================================
        DATE FORMATTER
  ====================================

  Evita usar split("T")
  Muito mais profissional.
  */

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "—"

  return (
    <div
      className='grid grid-cols-1 md:grid-cols-4 gap-6
      p-6 border border-bordercolor rounded-xl
      hover:shadow-lg transition'
    >

      {/* ================================
            CAR IMAGE + INFO
      ================================= */}

      <div className='md:col-span-1'>
        <div className='rounded-lg overflow-hidden mb-3'>
          <img
            src={booking.car.image}
            alt=''
            className='w-full h-auto aspect-video object-cover'
          />
        </div>

        <p className='text-lg font-semibold'>
          {booking.car.brand} {booking.car.model}
        </p>

        <p className='text-gray-500'>
          {booking.car.year} • {booking.car.category} • {booking.car.location}
        </p>
      </div>

      {/* ================================
            BOOKING INFO
      ================================= */}

      <div className='md:col-span-2'>

        {/* Booking Header */}
        <div className='flex items-center gap-2'>
          <p className='px-3 py-1.5 bg-light rounded-md'>
            Booking #{booking._id.slice(-5)}
          </p>

          <p
            className={`px-3 py-1 text-xs rounded-full
            ${statusStyles[booking.status] || "bg-gray-200 text-gray-600"}`}
          >
            {booking.status}
          </p>
        </div>

        {/* Rental Period */}
        <div className='flex items-start gap-2 mt-3'>
          <img src={assets.calendar_icon_colored} className='w-4 h-4 mt-1'/>
          <div>
            <p className='font-medium'>Rental Period</p>
            <p className='text-gray-500'>
              {formatDate(booking.pickupDate)} → {formatDate(booking.returnDate)}
            </p>
          </div>
        </div>

        {/* Location */}
        <div className='flex items-start gap-2 mt-3'>
          <img src={assets.location_icon_colored} className='w-4 h-4 mt-1'/>
          <div>
            <p className='font-medium'>Pick-up Location</p>
            <p className='text-gray-500'>{booking.car.location}</p>
          </div>
        </div>

      </div>

      {/* ================================
                PRICE
      ================================= */}

      <div className='md:col-span-1 flex flex-col justify-between'>

        <div className='text-right'>
          <p className='text-gray-500'>Total Price</p>

          {/* 🔵 PREÇO EM AZUL */}
          <h1 className='text-2xl font-bold text-blue-600'>
            {currency} {booking.price}
          </h1>

          <p className='text-gray-400'>
            Booked on {formatDate(booking.createdAt)}
          </p>
        </div>

      </div>
    </div>
  )
}

export default BookingCard
