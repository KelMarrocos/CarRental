import React from 'react'

/*
  Componente reutilizável de título de seção.

  Props:
  - title: texto principal
  - subtitle: descrição abaixo do título
  - align: controla alinhamento ("center" | "left")
*/

const Title = ({ title, subtitle, align = "center" }) => {
  return (
    <div
      className={`
        flex flex-col justify-center items-center text-center
        ${align === 'left' ? 'md:items-start md:text-left' : ''}
      `}
    >
      {/* Title */}
      <h2 className='font-semibold text-3xl md:text-[40px] leading-tight'>
        {title}
      </h2>

      {/* Subtitle */}
      <p className='text-sm md:text-base text-gray-500/90 mt-3 max-w-2xl'>
        {subtitle}
      </p>
    </div>
  )
}

export default Title
