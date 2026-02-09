import React from 'react'
import Title from './Title'
import { assets, dummyCarData } from '../assets/assets'
import CarCard from './CarCard'
import { useNavigate } from 'react-router-dom'

const FeaturedSection = () => {

  const navigate = useNavigate()

  return (
    <div className='flex flex-col items-center py-24 px-6 md:px-16
    lg:px-24 xl:px-32'>

      <div>
        <Title 
          title='Featured Cars' 
          subtitle='Explore our selection of premium vehicles available for your next adventure.'
        />
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-20'>
        {
          dummyCarData.slice(0,6).map((car) => (
            <CarCard key={car._id} car={car}/>
          ))
        }
      </div>
 
      <button 
        onClick={() => {
          navigate('/cars')
          scrollTo(0,0)
        }} 
        className='flex items-center justify-center gap-2 px-6 py-2 border  
                border-bordercolor hover:bg-gray-50 rounded-md mt-20 
                cursor-pointer transition-all duration-300
                hover:-translate-y-0.5 hover:shadow-md'
      >
        Explore all cars 
        <img src={assets.arrow_icon} alt='arrow' />
      </button>

    </div>
  )
}

export default FeaturedSection
