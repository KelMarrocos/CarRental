import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../constants/assets";
import RippleButton from "../components/RippleButton";
import CarDetailsSkeleton from "../components/CarDetailsSkeleton";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { axios } = useAppContext();

  const [car, setCar] = useState(null);
  const [image, setImage] = useState(null);

  const [pickup, setPickup] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const [loading, setLoading] = useState(true);

  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "$";

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);

        // API pública
        const { data } = await axios.get("/api/user/cars");

        if (!data?.success) {
          toast.error(data?.message || "Failed to load cars");
          setCar(null);
          return;
        }

        const found = (data.cars || []).find((c) => c._id === id);

        if (!found) {
          setCar(null);
          return;
        }

        setCar(found);

        // Se tiver images[], usa a primeira como principal; senão usa car.image.
        const extra = Array.isArray(found.images) ? found.images.filter(Boolean) : [];
        setImage(extra[0] || found.image || null);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || error?.message || "Failed to load car"
        );
        setCar(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id, axios]);

  // Galeria (capa + extras, sem duplicar)
  const gallery = useMemo(() => {
    if (!car) return [];
    const extras = Array.isArray(car.images) ? car.images.filter(Boolean) : [];
    return Array.from(new Set([car.image, ...extras].filter(Boolean)));
  }, [car]);

  // Garante que a imagem principal esteja sempre setada quando a galeria mudar
  useEffect(() => {
    if (!car) return;
    if (!image && gallery.length) {
      setImage(gallery[0]);
      return;
    }
    // se a imagem atual não existe mais (ex: depois de editar), volta pra primeira
    if (image && gallery.length && !gallery.includes(image)) {
      setImage(gallery[0]);
    }
  }, [car, gallery, image]);

  const totalDays = useMemo(() => {
    if (!pickup || !returnDate) return 0;

    const start = new Date(pickup);
    const end = new Date(returnDate);

    const diff = (end - start) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 0;
  }, [pickup, returnDate]);

  const totalPrice = useMemo(() => {
    if (!car) return 0;
    return totalDays * car.pricePerDay;
  }, [totalDays, car]);

  if (loading) return <CarDetailsSkeleton />;

  if (!car) {
    return (
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16">
        <div className="bg-white border rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-gray-900">Car not found</h1>
          <p className="text-gray-600 mt-2">
            This car may have been removed or is unavailable.
          </p>

          <RippleButton
            onClick={() => navigate("/cars")}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2 border rounded-lg hover:shadow-md transition"
          >
            <img src={assets.arrow_icon} className="rotate-180 opacity-60" />
            Back to cars
          </RippleButton>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16">
      <RippleButton
        onClick={() => navigate("/cars")}
        className="
          mb-10 flex items-center gap-2
          px-5 py-2 border rounded-lg
          hover:shadow-md transition
        "
      >
        <img src={assets.arrow_icon} className="rotate-180 opacity-60" />
        Back to cars
      </RippleButton>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <img
              src={image || car.image}
              alt={`${car.brand} ${car.model}`}
              className="
                w-full h-[480px]
                object-cover rounded-2xl
                shadow-sm transition duration-500
              "
            />

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {(gallery.length ? gallery : [car.image]).map((img, i) => (
                <img
                  key={`${img}-${i}`}
                  src={img}
                  alt={`thumb-${i}`}
                  onClick={() => setImage(img)}
                  className={`
                    h-24 w-full object-cover
                    rounded-xl cursor-pointer
                    transition hover:scale-105
                    ${image === img ? "ring-2 ring-primary" : ""}
                  `}
                />
              ))}
            </div>
          </div>

          <div>
            <h1 className="text-4xl font-bold">
              {car.brand} {car.model}
            </h1>
            <p className="text-gray-500 text-lg">
              {car.category} · {car.year}
            </p>
          </div>

          <div className="grid sm:grid-cols-4 gap-4">
            {[
              { icon: assets.users_icon, text: `${car.seating_capacity} seats` },
              { icon: assets.fuel_icon, text: car.fuel_type },
              { icon: assets.car_icon, text: car.transmission },
              { icon: assets.location_icon, text: car.location },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white border rounded-xl p-4 hover:shadow-md transition"
              >
                <img src={item.icon} className="h-5 mb-2" alt="" />
                <p className="text-sm text-gray-600">{item.text}</p>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-600 leading-relaxed">{car.description}</p>
          </div>
        </div>

        <div className="sticky top-24 h-max bg-white border rounded-2xl p-7 shadow-xl space-y-6">
          <div className="flex justify-between items-end">
            <p className="text-3xl font-bold">
              {currency}
              {car.pricePerDay}
            </p>
            <span className="text-gray-400">/day</span>
          </div>

          <div className="space-y-3">
            <input
              type="date"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {totalDays > 0 && (
            <div className="bg-gray-50 p-4 rounded-xl">
              <p>{totalDays} days</p>
              <p className="font-semibold text-lg">
                Total: {currency}
                {totalPrice}
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
            onClick={() => toast("Reserve flow: implementar depois :)")}
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