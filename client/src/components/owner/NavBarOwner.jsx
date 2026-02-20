import React from 'react'
import { dummyUserData } from '../../data/mockData'
import { Link } from 'react-router-dom'
import { assets } from '../../constants/assets'

/*
  Navbar do painel do proprietário

  Objetivo UX:
  - diferenciar painel do site público
  - oferecer "escape" claro (voltar ao site)
  - manter layout limpo estilo dashboard moderno
*/

const NavBarOwner = () => {
  const user = dummyUserData

  return (
    <div className='flex items-center justify-between px-6 md:px-10 py-4
    text-gray-600 border-b border-bordercolor bg-white'>

      {/* LEFT SIDE */}
      <div className='flex items-center gap-6'>

        {/* Logo → Home */}
        <Link to='/' className='flex items-center gap-2 group'>
          <img src={assets.logo} alt='logo' className='h-7'/>
        </Link>

        {/* Back to site */}
        <Link
          to='/'
          className='flex items-center gap-2 text-sm text-gray-500
          hover:text-primary transition group'
        >
          <img
            src={assets.arrow_icon}
            alt=''
            className='w-4 opacity-70 group-hover:-translate-x-1 transition'
          />
          <span className='hidden sm:inline'>Go Home</span>
        </Link>

      </div>

      {/* RIGHT SIDE */}
      <p className='text-sm'>
        Welcome, <span className='font-medium text-gray-800'>{user.name || "Owner"}</span>
      </p>

    </div>
  )
}

export default NavBarOwner