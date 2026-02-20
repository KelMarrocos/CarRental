import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../constants/assets";
import { dummyCarData } from "../data/mockData";
import RippleButton from "../components/RippleButton";
import CarDetailsSkeleton from "../components/CarDetailsSkeleton";

/*
  CarDetails

  Página de detalhes do carro.

  Estrutura pensada para escalar facilmente
  para dados vindos de API.

  Separação clara de responsabilidades:

  - loading state
  - cálculo derivado (useMemo)
  - UI isolada
*/

const CarDetails = () => {

  // id vindo da URL
  const { id } = useParams();

  const navigate = useNavigate();

  /*
    Estados principais
  */
  const [car, setCar] = useState(null);
  const [image, setImage] = useState(null);

  const [pickup, setPickup] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const currency =
    import.meta.env.VITE_CURRENCY_SYMBOL || "$";

  /*
    Simula fetch.

    Basta trocar por:

    await fetch(...)
  */
  useEffect(() => {

    const timer = setTimeout(() => {

      const found =
        dummyCarData.find(c => c._id === id);

      setCar(found);

      if(found){
        setImage(found.image);
      }

    }, 600);

    return () => clearTimeout(timer);

  }, [id]);

  /*
    Total de dias — valor DERIVADO.

    Nunca guardar isso em state.
  */
  const totalDays = useMemo(() => {

    if(!pickup || !returnDate) return 0;

    const start = new Date(pickup);
    const end = new Date(returnDate);

    const diff =
      (end - start) / (1000 * 60 * 60 * 24);

    return diff > 0 ? diff : 0;

  }, [pickup, returnDate]);

  /*
    Preço total também é derivado.
  */
  const totalPrice = useMemo(() => {
    if(!car) return 0;
    return totalDays * car.pricePerDay;
  }, [totalDays, car]);

  // evita render quebrado
  if (!car) return <CarDetailsSkeleton />;

  /*
    Estrutura da galeria.

    Futuramente pode vir da API:
    car.images[]
  */
  const gallery = [
    car.image,
    car.image,
    car.image,
    car.image
  ];

  return (

    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16">

      {/* NAV BACK */}
      <RippleButton
        onClick={() => navigate("/cars")}
        className="
          mb-10 flex items-center gap-2
          px-5 py-2 border rounded-lg
          hover:shadow-md transition
        "
      >
        <img
          src={assets.arrow_icon}
          className="rotate-180 opacity-60"
        />

        Back to cars
      </RippleButton>

      <div className="grid lg:grid-cols-3 gap-12">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-8">

          {/* TESLA STYLE GALLERY */}
          <div className="space-y-4">

            {/* imagem principal */}
            <img
              src={image}
              className="
                w-full h-[480px]
                object-cover rounded-2xl
                shadow-sm transition duration-500
              "
            />

            {/* thumbnails */}
            <div className="grid grid-cols-4 gap-4">

              {gallery.map((img, i)=>(
                <img
                  key={i}
                  src={img}
                  onClick={()=>setImage(img)}
                  className={`
                    h-24 w-full object-cover
                    rounded-xl cursor-pointer
                    transition hover:scale-105
                    ${image===img && "ring-2 ring-primary"}
                  `}
                />
              ))}

            </div>
          </div>

          {/* TITLE */}
          <div>
            <h1 className="text-4xl font-bold">
              {car.brand} {car.model}
            </h1>

            <p className="text-gray-500 text-lg">
              {car.category} · {car.year}
            </p>
          </div>

          {/* SPECS */}
          <div className="grid sm:grid-cols-4 gap-4">

            {[
              {icon: assets.users_icon, text:`${car.seating_capacity} seats`},
              {icon: assets.fuel_icon, text:car.fuel_type},
              {icon: assets.car_icon, text:car.transmission},
              {icon: assets.location_icon, text:car.location},
            ].map((item,i)=>(
              <div
                key={i}
                className="
                  bg-white border rounded-xl p-4
                  hover:shadow-md transition
                "
              >
                <img src={item.icon} className="h-5 mb-2"/>
                <p className="text-sm text-gray-600">
                  {item.text}
                </p>
              </div>
            ))}

          </div>

          {/* DESCRIPTION */}
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Description
            </h2>

            <p className="text-gray-600 leading-relaxed">
              {car.description}
            </p>
          </div>

        </div>

        {/* FLOATING PRICE CARD */}
        <div
          className="
            sticky top-24 h-max
            bg-white border rounded-2xl
            p-7 shadow-xl space-y-6
          "
        >

          {/* preço */}
          <div className="flex justify-between items-end">
            <p className="text-3xl font-bold">
              {currency}{car.pricePerDay}
            </p>

            <span className="text-gray-400">
              /day
            </span>
          </div>

          {/* datas */}
          <div className="space-y-3">

            <input
              type="date"
              value={pickup}
              onChange={e=>setPickup(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />

            <input
              type="date"
              value={returnDate}
              onChange={e=>setReturnDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />

          </div>

          {/* cálculo */}
          {totalDays > 0 && (
            <div className="bg-gray-50 p-4 rounded-xl">
              <p>{totalDays} days</p>

              <p className="font-semibold text-lg">
                Total: {currency}{totalPrice}
              </p>
            </div>
          )}

          <RippleButton
            className="
              w-full py-3 rounded-xl
              bg-primary text-white font-medium
              hover:scale-[1.02]
              active:scale-[.98]
              transition
            "
          >
            Reserve Now
          </RippleButton>

          <p className="text-xs text-center text-gray-400">
            No credit card required
          </p>

        </div>

      </div>
    </div>
  );
};

export default CarDetails;
