import React from 'react'

const Loader = () => {

  /*
  ==================================
  LOADER COMPONENT
  ==================================

  Responsável por indicar estados de carregamento da aplicação.

  USE CASES:
  ✔ chamadas de API
  ✔ carregamento de páginas
  ✔ suspense fallback
  ✔ filtros
  ✔ autenticação

  DICA PROFISSIONAL:
  Loader deve ser um componente GLOBAL.
  Ideal deixar em /components/ui/Loader.jsx
  */

  return (

    /*
    Container centralizado vertical e horizontalmente.

    h-[80vh]:
    - evita que o loader fique colado no topo
    - melhora percepção visual de carregamento
    - parece mais "premium"

    FUTURO:
    pode virar uma prop → height="80vh"
    */
    <div className='flex justify-center items-center h-[80vh]'>

        {/*
        Spinner

        animate-spin → rotação infinita
        rounded-full → formato circular
        border-t-primary → cria efeito moderno de loading

        DICA DE SENIOR:
        loaders minimalistas transmitem mais confiança
        do que animações exageradas.
        */}
        <div className='animate-spin rounded-full h-14 w-14 border-4 border-gray-300 border-t-primary'>
        </div>       

    </div>
  )
}

export default Loader
