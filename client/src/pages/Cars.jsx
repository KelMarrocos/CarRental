import React from 'react';
import Title from '../components/Title';
import { assets } from '../constants/assets';
import { dummyCarData } from '../data/mockData';
import CarCard from '../components/CarCard';

/*
  Cars Page

  Responsável por listar todos os veículos disponíveis.

  Estrutura pensada para fácil migração futura de:
  -> dummy data → API
  -> filtro local → server-side search
*/

const Cars = () => {

  /*
    Estado da busca.

    Mantido local pois ainda não há integração com API.
    
    Futuro upgrade recomendado:
    -> debounce
    -> query params
    -> cache (React Query / TanStack)
  */
  const [input, setInput] = React.useState('');

  return (
    <div className="bg-light min-h-screen">

      {/* 
        HERO SECTION
        Contém título + busca.
        Centralizado para criar foco visual imediato.
      */}
      <div className="flex flex-col items-center py-20 max-md:px-4">

        {/* 
          Componente reutilizável.
          Mantém consistência tipográfica no app inteiro.
        */}
        <Title
          title="Available Cars"
          subtitle="Browse our select of premium vehicles available for your next adventure."
        />

        {/* 
          SEARCH BAR

          Estrutura preparada para:
          -> filtros
          -> busca inteligente
          -> autocomplete
        */}
        <div className="flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow">

          {/* Ícone puramente decorativo */}
          <img src={assets.search_icon} alt="" className="w-4.5 h-4.5 mr-2" />

          <input
            /*
              Atualiza o estado a cada digitação.
              
              Quando migrar para API:
              -> aplicar debounce (~300ms)
              -> evitar requisições excessivas
            */
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Search by make, model, or features"
            className="w-full h-full outline-none text-gray-500 bg-transparent"
          />

          {/* Futuro botão de filtros */}
          <img src={assets.filter_icon} alt="" className="w-4.5 h-4.5 ml-2" />
        </div>
      </div>

      {/* 
        LISTAGEM DE CARROS

        Container controla largura máxima
        para manter leitura confortável em telas grandes.
      */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10">

        {/* 
          Feedback imediato ao usuário.

          Futuramente trocar para:
          -> resultado filtrado
          -> paginação
          -> contagem vinda da API
        */}
        <p className="text-gray-500 xl:px-26 max-w-7xl mx-auto">
          Showing {dummyCarData.length} Cars
        </p>

        {/* 
          GRID RESPONSIVO

          1 coluna → mobile  
          2 → tablet  
          3 → desktop  

          Evita media queries manuais.
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

          {/*
            Cada carro é isolado em um Card.

            Benefícios:
            -> reutilização
            -> menor complexidade
            -> facilita memoização
          */}
          {dummyCarData.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}

        </div>
      </div>
    </div>
  );
};

export default Cars;
