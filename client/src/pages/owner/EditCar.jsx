import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Title from "../../components/owner/Title";
import CarForm from "../../components/owner/CarForm";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const EditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { axios } = useAppContext();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCar = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get("/api/owner/cars");

        if (!data?.success) {
          toast.error(data?.message || "Failed to load cars");
          setCar(null);
          return;
        }

        const found = (data.cars || []).find((c) => c._id === id);
        setCar(found || null);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || error?.message || "Failed to load car"
        );
        setCar(null);
      } finally {
        setLoading(false);
      }
    };

    loadCar();
  }, [id, axios]);

  const handleUpdate = async (payload) => {
  try {
    const formData = new FormData();

    const {
      coverFile,          // pode vir null
      galleryFiles = [],  // pode vir []
      coverUrl,
      galleryUrls,
      ...carFields
    } = payload;

    formData.append("carData", JSON.stringify(carFields));

    // capa opcional
    if (coverFile) formData.append("image", coverFile);

    // extras opcionais
    galleryFiles.forEach((f) => f && formData.append("images", f));

    const { data } = await axios.put(`/api/owner/car/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (!data?.success) {
      toast.error(data?.message || "Failed to update car");
      return;
    }

    toast.success(data?.message || "Car Updated");
    navigate("/owner/manage-cars");
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message || "Update failed");
  }
};

  if (loading) {
    return (
      <div className="px-4 py-10 md:px-10 flex-1">
        <Title title="Edit Car" subTitle="Loading car data..." />
      </div>
    );
  }

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