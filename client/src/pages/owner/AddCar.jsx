import React from "react";
import { useNavigate } from "react-router-dom";
import Title from "../../components/owner/Title";
import CarForm from "../../components/owner/CarForm";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const AddCar = () => {
  const { axios } = useAppContext();
  const navigate = useNavigate();

  const handleCreate = async (payload) => {
    try {
      const formData = new FormData();

      const {
        coverFile,
        galleryFiles = [],
        coverUrl,
        galleryUrls,
        ...carFields
      } = payload;

      if (!coverFile) {
        toast.error("Selecione a imagem de capa.");
        return;
      }

      formData.append("carData", JSON.stringify(carFields));
      formData.append("image", coverFile);

      galleryFiles.forEach((f) => f && formData.append("images", f));

      const { data } = await axios.post("/api/owner/add-car", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!data?.success) {
        toast.error(data?.message || "Failed to add car");
        return;
      }

      // limpa draft profissional
      localStorage.removeItem("car_rental:add_car_draft:v1");

      toast.success(data?.message || "Car Added");
      navigate("/owner/manage-cars");
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Add failed");
    }
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