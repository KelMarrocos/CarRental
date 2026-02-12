import React, { useState, useMemo } from 'react'
import { assets, cityList } from '../constants'

const Hero = () => {

    const [pickupLocation, setPickupLocation] = useState('')

    // evita recalcular a cada render
    const today = useMemo(() => {
        return new Date().toISOString().split('T')[0]
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()

        // depois você pode integrar com router ou API
        console.log({
            pickupLocation
        })
    }

  return (
    <section className='h-screen flex flex-col items-center justify-center gap-14 bg-light text-center'>

        <h1 className='text-4xl md:text-5xl font-semibold'>
            Luxury cars on Rent
        </h1>

        <form
            onSubmit={handleSubmit}
            className='flex flex-col md:flex-row items-start md:items-center
            justify-between p-6 rounded-lg md:rounded-full w-full max-w-80 md:max-w-[800px]
            bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]'
        >

            <div className='flex flex-col md:flex-row items-start md:items-center gap-10 md:ml-8'>
                
                {/* Location */}
                <div className='flex flex-col items-start gap-2'>
                    <label className='text-sm font-medium'>Pickup Location</label>

                    <select
                        required
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        className='border rounded-md px-2 py-1'
                    > 
                        <option value="">Select location</option>

                        {cityList.map((city) => (
                            <option key={city} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>

                    <p className='px-1 text-sm text-gray-500'>
                        {pickupLocation
                            ? pickupLocation
                            : 'Please select location'}
                    </p>
                </div>

                {/* Pickup */}
                <div className='flex flex-col items-start gap-2'>
                   <label htmlFor='pickup-date' className='text-sm font-medium'>
                        Pick-up Date
                   </label>

                   <input
                        type="date"
                        id="pickup-date"
                        min={today}
                        className='text-sm text-gray-500 border rounded-md px-2 py-1'
                        required
                    />
                </div>

                {/* Return */}
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

        <img
            src={assets.main_car}
            alt="Luxury car"
            className='max-h-74 object-contain'
        />

    </section>
  )
}

export default Hero
