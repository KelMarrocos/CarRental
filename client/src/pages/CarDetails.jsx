import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assets } from '../constants/assets';
import { dummyCarData } from '../data/mockData';
import Loader from '../components/Loader';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState();
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '$';
  const handleSubmit = (e)=> {
    e.preventDefault();
  }

  useEffect(() => {
    const foundCar = dummyCarData.find(car => car._id === id);
    setCar(foundCar);
  }, [id]);

  if (!car) {
    return <Loader />;
  }

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16">
  {/* Botão de voltar */}
  <div className="mb-6"> {/* <-- espaço abaixo do botão */}
    <button
      onClick={() => navigate('/cars')}
      className="group flex items-center justify-center gap-2
        px-6 py-2 border border-bordercolor
        hover:bg-gray-50 rounded-md
        cursor-pointer transition-all duration-300
        hover:-translate-y-1 hover:shadow-lg"
    >
      <img src={assets.arrow_icon} alt="" className='rotate-180 opacity-65'/>
      Back to all cars
    </button>
  </div>

  <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
    {/* Left: Car Image & Details */}
    <div className='lg:col-span-2'>
      <img
        src={car.image}
        alt={`${car.brand} ${car.model}`}
        className="w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md" 
      />
      <div className='space-y-6'>
            {/* Car Title */}
            <div>
              <h1 className='text-3xl font-bold'>{car.brand} {car.model}</h1>
              <p className='text-gray-500 text-lg'>{car.category} - {car.year}</p>
            </div>
            <hr className='border-bordercolor my-6'/>

            {/* Car Details Icons */}
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
              {[
                {icon: assets.users_icon, text:`${car.seating_capacity} Seats`},
                {icon: assets.fuel_icon, text:`${car.fuel_type}`},
                {icon: assets.car_icon, text:`${car.transmission}`},
                {icon: assets.location_icon, text:`${car.location}`},
              ].map((item, index) => (
                <div key={index} className='flex flex-col items-center bg-light p-4 rounded-lg'> 
                  <img src={item.icon} alt="" className='h-5 mb-2'/>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h1 className='text-lg font-medium mb-3'>Description</h1>
              <p className='text-gray-500'>{car.description}</p>
            </div>

            {/* Features */}
            <div>
              <h1 className='text-lg font-medium mb-3'>Features</h1>
              <ul className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                {["360 camera", "Bluetooth", "GPS", "Heated seats", "Rear View Mirror"].map((item) => (
                  <li key={item} className='flex items-center text-gray-500'>
                    <img src={assets.check_icon} className='h-4 mr-2' alt=''/>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Booking Form Placeholder */}
        <form onSubmit={handleSubmit} className='shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500'>
          <p className='flex items-center justify-between text-2xl text-gray-800 font-semibold'>
            {currency}{car.pricePerDay}<span className='text-base text-gray-400 
            font-normal'>per day</span></p>

            <hr className='border-bordercolor my-6'/>

            <div className='flex flex-col gap-2'>
              <label htmlFor="picture-date">Picture Date</label>
              <input type="date" className='border border-bordercolor px-3 py-2 
              rounded-lg' required id='pickup-date' min={new Date().toISOString().split('T')[0]}/>
            </div>

            <div className='flex flex-col gap-2'>
              <label htmlFor="return-date">Return Date</label>
              <input type="date" className='border border-bordercolor px-3 py-2 
              rounded-lg' required id='return-date'/>
            </div>

            <button className='w-full bg-primary houver:bg-primary-dull
            transition-all py-3 font-medium text-white rounded-xl cursor-pointer'
            >Book Now</button>

            <p className='text-center text-sm'>No credit card required to reserve</p>

        </form>
      </div>
    </div>
  );
};

export default CarDetails;
