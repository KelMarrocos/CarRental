import React, { useEffect, useState } from "react";
import Title from "./Title";
import { assets } from "../constants/assets";
import CarCard from "./CarCard";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

/*
  FeaturedSection
  ----------------
  Mostra carros em destaque (agora via API).
*/

const FeaturedSection = () => {
  const navigate = useNavigate();
  const { axios } = useAppContext();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // evita recriar função dentro do JSX
  const handleNavigate = () => {
    navigate("/cars");
    scrollTo(0, 0);
  };

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get("/api/user/cars");

        if (!data?.success) {
          toast.error(data?.message || "Failed to load cars");
          setCars([]);
          return;
        }

        // normaliza "disponível" (caso exista typo antigo isAvaliable)
        const list = (data.cars || [])
          .filter((c) => {
            if (typeof c.isAvailable === "boolean") return c.isAvailable;
            if (typeof c.isAvaliable === "boolean") return c.isAvaliable;
            return true; // se não tiver flag, não filtra
          })
          .slice(0, 6);

        setCars(list);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || error?.message || "Failed to load cars"
        );
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCars();
  }, [axios]);

  return (
    <section
      className="flex flex-col items-center
      py-24 px-6 md:px-16 lg:px-24 xl:px-32"
    >
      {/* TITLE */}
      <Title
        title="Featured Cars"
        subtitle="Explore our selection of premium vehicles available for your next adventure."
      />

      {/* GRID */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
        gap-8 mt-20 w-full max-w-7xl"
      >
        {loading && (
          <>
            <div className="h-64 rounded-xl border border-bordercolor bg-white animate-pulse" />
            <div className="h-64 rounded-xl border border-bordercolor bg-white animate-pulse" />
            <div className="h-64 rounded-xl border border-bordercolor bg-white animate-pulse hidden lg:block" />
          </>
        )}

        {!loading && cars.map((car) => <CarCard key={car._id} car={car} />)}

        {!loading && cars.length === 0 && (
          <div className="col-span-full text-center text-gray-500">
            No featured cars available right now.
          </div>
        )}
      </div>

      {/* CTA BUTTON */}
      <button
        onClick={handleNavigate}
        className="group flex items-center justify-center gap-2
        px-6 py-2 border border-bordercolor
        hover:bg-gray-50 rounded-md mt-20
        cursor-pointer transition-all duration-300
        hover:-translate-y-1 hover:shadow-lg"
      >
        Explore all cars

        {/* animação da seta */}
        <img
          src={assets.arrow_icon}
          alt="arrow"
          className="transition-transform duration-300
          group-hover:translate-x-1"
        />
      </button>
    </section>
  );
};

export default FeaturedSection;