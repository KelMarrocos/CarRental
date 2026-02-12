import React from 'react'
import { assets } from '../constants/assets'

/*
  Banner Component
  ----------------
  Seção de destaque usada para conversão.
  Objetivo: incentivar donos de carros a listarem seus veículos.
*/

const Banner = () => {
  return (

    // Container principal
    // gradient + rounded-xl = aparência mais premium
    <section
      className='flex flex-col md:flex-row md:items-center items-center
      justify-between px-8 md:pl-14 pt-10 bg-gradient-to-r
      from-[#0558FE] to-[#A9CFFF] max-w-6xl mx-3 md:mx-auto
      rounded-2xl overflow-hidden'
    >

      {/* ===== TEXTO ===== */}
      <div className='text-white'>

        {/* Headline (sempre importante para conversão) */}
        <h2 className='text-3xl font-medium'>
          Do You Own a Luxury Car?
        </h2>

        {/* Subheadline */}
        <p className='mt-2'>
          Monetize your vehicle effortlessly by listing it on CarRental.
        </p>

        {/* Texto complementar */}
        <p className='max-w-[520px]'>
          We take care of insurance, driver verification and secure payments — so you
          can earn passive income, stress-free.
        </p>

        {/* CTA — Call To Action */}
        <button
          className='px-6 py-2 bg-white hover:bg-slate-100 transition-all
          text-primary rounded-lg text-sm mt-4 cursor-pointer font-medium
          
          // micro-interação (deixa MUITO mais premium)
          hover:scale-105 active:scale-95 duration-300'
        >
          List your car
        </button>

      </div>

      {/* ===== IMAGEM ===== */}
      <img
        src={assets.banner_car_image}
        alt="Luxury car"
        className='max-h-52 mt-10 md:mt-0 object-contain
        transition-transform duration-500 hover:scale-105'
      />

    </section>
  )
}

export default Banner