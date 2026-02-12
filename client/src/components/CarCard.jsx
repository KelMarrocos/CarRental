import React from 'react'
import { assets } from '../constants/assets'
import { useNavigate } from 'react-router-dom'

/*
  Spec Component
  --------------
  Pequeno componente reutilizável para exibir
  as especificações do carro (assentos, combustível, etc).

  Vantagem:
  -> evita repetição
  -> facilita manutenção
  -> deixa o código mais profissional
*/

const Spec = ({ icon, children }) => (
  <div
    className='flex items-center gap-2 bg-gray-50
    rounded-lg px-3 py-2
    transition hover:bg-gray-100'
  >
    <img src={icon} alt="" className='h-4 opacity-70' />

    <span className='text-sm text-gray-700'>
      {children}
    </span>
  </div>
)

const CarCard = ({ car }) => {

  const currency = import.meta.env.VITE_CURRENCY || '$'
  const navigate = useNavigate()

  const handleNavigate = () => {
    navigate(`/cars-details/${car._id}`)
    scrollTo(0, 0)
  }

  return (

    /*
      Card Container
      ----------------
      hover:-translate-y + shadow-xl
      cria efeito de "card flutuando"
      MUITO usado em SaaS.
    */

    <article
      onClick={handleNavigate}
      className='group rounded-2xl overflow-hidden
      bg-white shadow-md hover:shadow-2xl
      hover:-translate-y-2 transition-all duration-500
      cursor-pointer'
    >

      {/* ===== IMAGE AREA ===== */}
      <div className='relative h-52 overflow-hidden'>

        <img
          src={car.image}
          alt={`${car.brand} ${car.model}`}
          className='w-full h-full object-cover
          group-hover:scale-110 transition duration-700'
        />

        {/* Gradient overlay para melhorar leitura */}
        <div
          className='absolute inset-0 bg-gradient-to-t
          from-black/40 via-black/10 to-transparent'
        />

        {/* Badge */}
        {car.isAvailable && (
          <p
            className='absolute top-4 left-4
            bg-primary text-white text-xs
            px-3 py-1 rounded-full shadow-md'
          >
            Available Now
          </p>
        )}

        {/* Price Tag */}
        <div
          className='absolute bottom-4 right-4
          bg-white/90 backdrop-blur-md
          text-gray-900 px-4 py-2 rounded-xl shadow-lg'
        >
          <span className='font-semibold'>
            {currency}{car.pricePerDay}
          </span>

          <span className='text-sm text-gray-600'>
            {' '} / day
          </span>
        </div>

      </div>

      {/* ===== CONTENT ===== */}
      <div className='p-5'>

        <h3 className='text-lg font-semibold'>
          {car.brand} {car.model}
        </h3>

        <p className='text-gray-500 text-sm mb-4'>
          {car.category} • {car.year}
        </p>

        {/* Specs Grid */}
        <div className='grid grid-cols-2 gap-3'>
          <Spec icon={assets.users_icon}>
            {car.seating_capacity} Seats
          </Spec>

          <Spec icon={assets.fuel_icon}>
            {car.fuel_type}
          </Spec>

          <Spec icon={assets.car_icon}>
            {car.transmission}
          </Spec>

          <Spec icon={assets.location_icon}>
            {car.location}
          </Spec>
        </div>

      </div>

    </article>
  )
}

export default CarCard