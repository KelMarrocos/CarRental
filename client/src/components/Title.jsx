import React from 'react'

/*
=====================================
TITLE COMPONENT
=====================================

Componente reutilizável para títulos de seções.

Vantagens:
✔ evita repetição
✔ padroniza tipografia
✔ facilita manutenção do design
✔ pronto para Design System

Props:
- title → texto principal
- subtitle → descrição abaixo
- align → "center" | "left"
- className → permite customizações futuras sem alterar o core
*/

const Title = ({
  title,
  subtitle,
  align = "center",
  className = ""
}) => {
  return (
    <div
      className={`
        flex flex-col justify-center
        ${align === 'left'
          ? 'items-start text-left'
          : 'items-center text-center'}
        ${className}
      `}
    >
      {/* 
        TITLE
        
        clamp() → técnica MUITO usada em sites premium
        Faz o texto escalar suavemente entre mobile e desktop.
        
        FUTURO:
        → pode virar um "Heading component"
        → aceitar tag dinâmica (h1, h2, h3...)
      */}
      <h2 className='font-semibold text-[clamp(28px,4vw,40px)] leading-tight'>
        {title}
      </h2>

      {/* 
        SUBTITLE
        
        max-w melhora leitura
        60–75 caracteres por linha = ideal UX
      */}
      {subtitle && (
        <p className='text-sm md:text-base text-gray-500/90 mt-3 max-w-2xl'>
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default Title