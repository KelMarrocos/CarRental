import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Title from "../../components/owner/Title";
import CarForm from "../../components/owner/CarForm";
import { dummyCarData } from "../../data/mockData";

/*
  EditCar Page
  ------------
  Responsável por:
  ✔ buscar o carro por :id
  ✔ preencher CarForm com initialData
  ✔ enviar payload atualizado (futuro: API)
*/

const EditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);

  useEffect(() => {
    // FUTURO: fetch API by id
    const found = dummyCarData.find((c) => c._id === id);
    setCar(found || null);
  }, [id]);

  const handleUpdate = async (payload) => {
    // FUTURO: enviar para API (PUT/PATCH)
    console.log("UPDATE payload:", { id, ...payload });

    // UX: volta pra lista
    navigate("/owner/manage-cars");
  };

  if (!car) {
    return (
      <div className="px-4 py-10 md:px-10 flex-1">
        <Title
          title="Edit Car"
          subTitle="We couldn't find this car. It may have been removed."
        />
        <button
          onClick={() => navigate("/owner/manage-cars")}
          className="mt-6 px-5 py-2 rounded-xl border border-bordercolor hover:bg-gray-50 transition"
        >
          Back to Manage Cars
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-10 md:px-10 flex-1">
      <Title
        title="Edit Car"
        subTitle="Update details, images, and pricing of your listed car."
      />

      <CarForm
        mode="edit"
        initialData={car}
        onSubmit={handleUpdate}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
};

export default EditCar;