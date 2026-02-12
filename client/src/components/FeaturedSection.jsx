import React from 'react'
import Title from './Title'
import { assets} from '../constants/assets'
import { dummyCarData } from '../data/mockData'
import CarCard from './CarCard'
import { useNavigate } from 'react-router-dom'

/*
  FeaturedSection
  ----------------
  Seção responsável por mostrar carros em destaque.
  Normalmente conectaria com uma API futuramente.
*/

const FeaturedSection = () => {

  const navigate = useNavigate()

  // evita recriar função dentro do JSX
  const handleNavigate = () => {
    navigate('/cars')
    scrollTo(0, 0)
  }

  return (

    // section > melhor semântica que div
    <section
      className='flex flex-col items-center
      py-24 px-6 md:px-16 lg:px-24 xl:px-32'
    >

      {/* TITLE */}
      <Title
        title='Featured Cars'
        subtitle='Explore our selection of premium vehicles available for your next adventure.'
      />

      {/* GRID */}
      <div
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
        gap-8 mt-20 w-full max-w-7xl'
      >
        {dummyCarData.slice(0, 6).map((car) => (
          <CarCard key={car._id} car={car} />
        ))}
      </div>

      {/* CTA BUTTON */}
      <button
        onClick={handleNavigate}
        className='group flex items-center justify-center gap-2
        px-6 py-2 border border-bordercolor
        hover:bg-gray-50 rounded-md mt-20
        cursor-pointer transition-all duration-300
        hover:-translate-y-1 hover:shadow-lg'
      >
        Explore all cars

        {/* animação da seta */}
        <img
          src={assets.arrow_icon}
          alt='arrow'
          className='transition-transform duration-300
          group-hover:translate-x-1'
        />
      </button>

    </section>
  )
}

export default FeaturedSection
