import React, { useState, useMemo } from 'react'
import { assets, cityList } from '../constants'

const Hero = () => {

    /*
    ==============================
    STATE
    ==============================
    pickupLocation:
    Guarda a cidade selecionada pelo usuário.
    Futuramente pode ser enviado para:
    ✔ API de busca
    ✔ filtros globais
    ✔ query params da URL
    */
    const [pickupLocation, setPickupLocation] = useState('')

    /*
    ==============================
    MEMOIZATION
    ==============================

    today:
    useMemo evita recalcular a data a cada render.

    ✔ Otimização pequena, mas boa prática.
    ✔ Principalmente útil se no futuro essa lógica ficar mais pesada.
    ✔ Mantém os inputs sempre bloqueando datas passadas.
    */
    const today = useMemo(() => {
        return new Date().toISOString().split('T')[0]
    }, [])

    /*
    ==============================
    FORM SUBMIT
    ==============================

    Atualmente apenas faz um console.log,
    mas já está estruturado para evoluir facilmente.

    IDEIAS FUTURAS:
    ✔ navegar para /cars com filtros
    ✔ chamar uma API
    ✔ salvar no contexto global
    ✔ usar react-query
    */
    const handleSubmit = (e) => {
        e.preventDefault()

        console.log({
            pickupLocation
        })
    }

  return (
    /*
    ==============================
    HERO SECTION
    ==============================

    h-screen → ocupa toda altura da tela
    flex + center → centralização perfeita
    bg-light → mantém identidade visual clean
    */
    <section className='h-screen flex flex-col items-center justify-center gap-14 bg-light text-center'>

        {/* Headline principal */}
        <h1 className='text-4xl md:text-5xl font-semibold'>
            Luxury cars on Rent
        </h1>

        {/* 
        ==============================
        SEARCH FORM
        ==============================

        Estrutura pensada para:

        ✔ virar um componente reutilizável
        ✔ receber filtros extras
        ✔ integrar com backend
        */}
        <form
            onSubmit={handleSubmit}
            className='flex flex-col md:flex-row items-start md:items-center
            justify-between p-6 rounded-lg md:rounded-full w-full max-w-80 md:max-w-[800px]
            bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]'
        >

            {/* Container dos filtros */}
            <div className='flex flex-col md:flex-row items-start md:items-center gap-10 md:ml-8'>
                
                {/* ==============================
                    LOCATION SELECT
                   ============================== */}
                <div className='flex flex-col items-start gap-2'>
                    <label className='text-sm font-medium'>Pickup Location</label>

                    <select
                        required
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        className='border rounded-md px-2 py-1'
                    > 
                        <option value="">Select location</option>

                        {/*
                        cityList:
                        Ideal manter em constants mesmo.

                        FUTURO:
                        pode vir de uma API.
                        */}
                        {cityList.map((city) => (
                            <option key={city} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>

                    {/* Feedback visual para o usuário */}
                    <p className='px-1 text-sm text-gray-500'>
                        {pickupLocation
                            ? pickupLocation
                            : 'Please select location'}
                    </p>
                </div>

                {/* ==============================
                    PICKUP DATE
                   ============================== */}
                <div className='flex flex-col items-start gap-2'>
                   <label htmlFor='pickup-date' className='text-sm font-medium'>
                        Pick-up Date
                   </label>

                   <input
                        type="date"
                        id="pickup-date"
                        min={today} // impede datas passadas
                        className='text-sm text-gray-500 border rounded-md px-2 py-1'
                        required
                    />
                </div>

                {/* ==============================
                    RETURN DATE
                   ============================== */}
                <div className='flex flex-col items-start gap-2'>
                   <label htmlFor='return-date' className='text-sm font-medium'>
                        Return Date
                   </label>

                   <input
                        type="date"
                        id="return-date"
                        min={today}
                        className='text-sm text-gray-500 border rounded-md px-2 py-1'
                        required
                    />
                </div>
               
            </div>

            {/* ==============================
                SEARCH BUTTON
               ==============================

            bg-primary:
            Ideal manter como token do Tailwind para
            padronização da identidade visual.
            */}
            <button
                type='submit'
                className='flex items-center justify-center gap-1 px-9 py-3
                max-sm:mt-4 bg-primary hover:bg-primary-dull text-white
                rounded-full cursor-pointer transition'
            >
                <img src={assets.search_icon} alt="" />
                Search
            </button>

        </form>

        {/* 
        ==============================
        HERO IMAGE
        ==============================

        object-contain evita cortes.
        max-h-74 mantém responsividade.
        */}
        <img
            src={assets.main_car}
            alt="Luxury car"
            className='max-h-74 object-contain'
        />

    </section>
  )
}

export default Hero
