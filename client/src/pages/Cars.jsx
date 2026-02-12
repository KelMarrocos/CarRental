import React from 'react';
import Title from '../components/Title';
import { assets } from '../constants/assets';
import { dummyCarData } from '../data/mockData';
import CarCard from '../components/CarCard'; // <- CORRIGIDO: import do CarCard

const Cars = () => {
  const [input, setInput] = React.useState('');

  return (
    <div className="bg-light min-h-screen">
      {/* Espaço superior */}
      <div className="flex flex-col items-center py-20 max-md:px-4">
        {/* Título */}
        <Title
          title="Available Cars"
          subtitle="Browse our select of premium vehicles available for your next adventure."
        />

        {/* Barra de pesquisa */}
        <div className="flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow">
          <img src={assets.search_icon} alt="" className="w-4.5 h-4.5 mr-2" />

          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Search by make, model, or features"
            className="w-full h-full outline-none text-gray-500 bg-transparent"
          />

          <img src={assets.filter_icon} alt="" className="w-4.5 h-4.5 ml-2" />
        </div>
      </div>

      {/* Conteúdo dos carros */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10">
        <p className="text-gray-500 xl:px-26 max-w-7xl mx-auto">Showing {dummyCarData.length} Cars</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {dummyCarData.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cars;
