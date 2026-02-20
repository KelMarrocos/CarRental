import React, { useState } from 'react'
import { dummyUserData } from '../../data/mockData'
import { useLocation, NavLink } from 'react-router-dom'
import { assets } from '../../constants/assets'
import { ownerMenuLinks } from '../../constants/menuLinks'

const Sidebar = () => {

  const user = dummyUserData
  const location = useLocation()

  const [image, setImage] = useState(null)
  const [collapsed, setCollapsed] = useState(false)

  const updateImage = () => {
    user.image = URL.createObjectURL(image)
    setImage(null)
  }

  return (
    <div
      className={`
        relative min-h-screen flex flex-col items-center pt-8
        border-r border-borderColor text-sm bg-white
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-20' : 'w-64'}
      `}
    >

      {/* botão collapse */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className='
          absolute -right-4 top-10 z-50
          bg-white border border-borderColor
          rounded-full p-2
          shadow-md
          hover:scale-110
          transition
        '
      >
        <img
          src={assets.arrow_icon}
          alt=""
          className={`w-4 transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`}
        />
      </button>

      {/* AVATAR */}
      <div className='relative group flex flex-col items-center'>

        <label htmlFor='image' className='cursor-pointer relative'>

          <img
            src={
              image
                ? URL.createObjectURL(image)
                : user?.image ||
                  "https://i.pravatar.cc/300"
            }
            alt="User avatar"
            className='
              w-32 h-32
              object-cover
              rounded-2xl
              border-2 border-gray-200
              shadow-md
              transition-all duration-300
              group-hover:brightness-90
            '
          />

          <input
            type="file"
            id='image'
            accept='image/*'
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />

          {/* overlay edit */}
          <div
            className='
              absolute inset-0
              bg-black/25
              rounded-2xl
              opacity-0
              group-hover:opacity-100
              flex items-center justify-center
              transition
            '
          >
            <img src={assets.edit_icon} alt="edit" className='w-6'/>
          </div>

        </label>

        {/* botão salvar */}
        {image && (
          <button
            onClick={updateImage}
            className='
              absolute -top-2 -right-2
              flex items-center gap-1
              px-2 py-1
              bg-primary text-white text-xs
              rounded-lg
              shadow-md
              hover:scale-105
              transition
            '
          >
            Save
            <img src={assets.check_icon} width={12} alt="" />
          </button>
        )}

      </div>

      {/* nome */}
      {!collapsed && (
        <p className='mt-4 text-base font-semibold'>
          {user?.name}
        </p>
      )}

      {/* MENU */}
      <div className='w-full mt-10 flex flex-col gap-1'>

        {ownerMenuLinks.map((link) => {

          const isActive = location.pathname === link.path

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={`
                relative flex items-center
                ${collapsed ? 'justify-center' : 'gap-3 pl-6'}
                py-3
                transition-all duration-200
                group overflow-hidden
                ${isActive
                  ? 'text-primary'
                  : 'text-gray-600 hover:text-gray-900'}
              `}
            >

              {/* highlight */}
              <span
                className={`
                  absolute left-0 top-0 h-full
                  bg-primary/10
                  transition-all duration-300
                  ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0'}
                `}
              />

              {/* barra lateral */}
              {isActive && (
                <div className='absolute left-0 h-full w-1 bg-primary rounded-r'/>
              )}

              <img
                src={isActive ? link.coloredIcon : link.icon}
                alt=""
                className='relative z-10 w-5'
              />

              {!collapsed && (
                <span className='relative z-10 font-medium'>
                  {link.name}
                </span>
              )}

            </NavLink>
          )
        })}

      </div>

    </div>
  )
}

export default Sidebar