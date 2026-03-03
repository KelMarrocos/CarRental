import React from "react";
import { useNavigate } from "react-router-dom";
import Title from "../../components/owner/Title";
import CarForm from "../../components/owner/CarForm";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const MAX_GALLERY = 8;

// aceita File[], FileList, ou arrays com {file} / {originFileObj}
const normalizeFiles = (input) => {
  if (!input) return [];

  // FileList -> array
  const arr = Array.isArray(input) ? input : Array.from(input);

  return arr
    .map((item) => {
      // caso já seja File
      if (item instanceof File) return item;

      // casos comuns de libs:
      if (item?.file instanceof File) return item.file;
      if (item?.originFileObj instanceof File) return item.originFileObj;

      return null;
    })
    .filter(Boolean);
};

const AddCar = () => {
  const { axios } = useAppContext();
  const navigate = useNavigate();

  const handleCreate = async (payload) => {
    try {
      const formData = new FormData();

      const {
        coverFile,
        galleryFiles,
        coverUrl,     // preview (não manda)
        galleryUrls,  // preview (não manda)
        ...carFields
      } = payload;

      // capa
      if (!(coverFile instanceof File)) {
        toast.error("Selecione a imagem de capa.");
        return;
      }

      // normaliza extras
      const gallery = normalizeFiles(galleryFiles).slice(0, MAX_GALLERY);

      formData.append("carData", JSON.stringify(carFields));
      formData.append("image", coverFile, coverFile.name);

      gallery.forEach((file) => {
        formData.append("images", file, file.name);
      });

      // ⚠️ NÃO setar Content-Type manualmente (axios coloca boundary)
      const { data } = await axios.post("/api/owner/add-car", formData);

      if (!data?.success) {
        toast.error(data?.message || "Failed to add car");
        return;
      }

      localStorage.removeItem("car_rental:add_car_draft:v1");

      toast.success(data?.message || "Car Added");
      navigate("/owner/manage-cars");
    } catch (error) {
      const status = error?.response?.status;

      if (status === 413) {
        toast.error(
          "Imagens muito pesadas (413). Reduza o tamanho/quantidade ou faça upload direto para o ImageKit."
        );
        return;
      }

      toast.error(
        error?.response?.data?.message || error?.message || "Add failed"
      );
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