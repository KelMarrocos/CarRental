import React from "react";
import { useNavigate } from "react-router-dom";
import Title from "../../components/owner/Title";
import CarForm from "../../components/owner/CarForm";

/*
  AddCar Page
  -----------
  Responsável por:
  ✔ exibir a página de criação
  ✔ enviar payload do CarForm (futuro: API)
*/

const AddCar = () => {
  const navigate = useNavigate();

  const handleCreate = async (payload) => {
    // FUTURO: enviar para API (FormData com coverFile + galleryFiles)
    console.log("CREATE payload:", payload);

    // UX: depois de criar, volta pra lista
    navigate("/owner/manage-cars");
  };

  return (
    <div className="px-4 py-10 md:px-10 flex-1">
      <Title
        title="Add New Car"
        subTitle="Fill in details to list a new car for booking, including pricing, images, and car specifications."
      />

      <CarForm
        mode="create"
        onSubmit={handleCreate}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
};

export default AddCar;