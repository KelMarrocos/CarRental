import React from "react";

/*
  SkeletonBox

  Bloco base reutilizável para loading states.

  Por que usar skeleton ao invés de spinner?

  -> evita layout shift
  -> reduz ansiedade do usuário
  -> melhora UX percebida
*/

const SkeletonBox = ({ className }) => (
  <div
    className={`
      animate-pulse
      bg-gray-200
      rounded-xl
      ${className}
    `}
  />
);

/*
  CarDetailsSkeleton

  Replica a estrutura real da página.

  Regra de ouro:
  Skeleton deve ter o MESMO layout
  do conteúdo final.
*/

const CarDetailsSkeleton = () => {
  return (

    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16 grid lg:grid-cols-3 gap-12">

      {/* Left content */}
      <div className="lg:col-span-2 space-y-6">

        {/* imagem principal */}
        <SkeletonBox className="w-full h-[420px]" />

        {/* título */}
        <SkeletonBox className="h-10 w-2/3" />

        {/* subtítulo */}
        <SkeletonBox className="h-6 w-1/3" />

        {/* specs */}
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_,i)=>(
            <SkeletonBox key={i} className="h-20"/>
          ))}
        </div>

        {/* descrição */}
        <SkeletonBox className="h-32 w-full"/>

      </div>

      {/* price card */}
      <SkeletonBox className="h-[420px] w-full sticky top-24"/>

    </div>
  );
};

export default CarDetailsSkeleton;
