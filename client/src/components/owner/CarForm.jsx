import React, { useEffect, useMemo, useRef, useState } from "react";
import { assets } from "../../constants/assets";

/*
  CarForm (reutilizável)
  ---------------------
  Usado por:
  pages/owner/AddCar.jsx   (mode="create")
  pages/owner/EditCar.jsx  (mode="edit")

  Features:
  ✔ Moeda automática via VITE_CURRENCY
  ✔ Upload de capa + galeria (máx 8)
  ✔ Limite por arquivo (máx 5MB)
  ✔ Mensagem de erro “bonita”
  ✔ Preview com remoção
  ✔ Pronto pra integrar com API (onSubmit recebe payload)

  Observação:
  - Como você está em mockData, a "galeria" não existe no modelo original.
    Aqui já deixamos preparado com `gallery` (urls/arquivos).
*/

const MAX_GALLERY = 8;
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const buildDefaultCar = () => ({
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  pricePerDay: 0,
  category: "",
  transmission: "",
  fuel_type: "",
  seating_capacity: 4,
  location: "",
  description: "",
  // coverUrl: string (imagem de capa, para preview)
  coverUrl: "",
  // galleryUrls: string[] (imagens extras, para preview)
  galleryUrls: [],
});

const CarForm = ({
  mode = "create",                 // "create" | "edit"
  initialData = null,              // dados do carro (edit)
  onSubmit,                        // (payload) => void | Promise<void>
  onCancel,                        // () => void
}) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";

  // Estado do formulário
  const [car, setCar] = useState(buildDefaultCar());

  // Arquivos selecionados (capa e galeria)
  const [coverFile, setCoverFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]); // File[]

  // Erros (mensagem única com UI bonita)
  const [error, setError] = useState("");

  // Input refs (pra resetar o input quando precisar)
  const coverInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  // Preenche formulário no modo EDIT
  useEffect(() => {
    if (!initialData) return;

    setCar((prev) => ({
      ...prev,
      brand: initialData.brand ?? "",
      model: initialData.model ?? "",
      year: initialData.year ?? new Date().getFullYear(),
      pricePerDay: initialData.pricePerDay ?? 0,
      category: initialData.category ?? "",
      transmission: initialData.transmission ?? "",
      fuel_type: initialData.fuel_type ?? "",
      seating_capacity: initialData.seating_capacity ?? 4,
      location: initialData.location ?? "",
      description: initialData.description ?? "",
      // mockData atual tem `image` (capa). Vamos mapear.
      coverUrl: initialData.image ?? "",
      // se um dia tiver `images`, pega aqui; por enquanto vazio
      galleryUrls: initialData.images ?? [],
    }));

    // limpa arquivos selecionados (edit pode trocar se quiser)
    setCoverFile(null);
    setGalleryFiles([]);
    setError("");
  }, [initialData]);

  // Helpers: gera preview URL de um file sem quebrar
  const fileToPreviewUrl = (file) => {
    try {
      return URL.createObjectURL(file);
    } catch {
      return "";
    }
  };

  // Preview da capa: arquivo (se selecionado) > coverUrl (edit) > placeholder
  const coverPreview = useMemo(() => {
    if (coverFile) return fileToPreviewUrl(coverFile);
    if (car.coverUrl) return car.coverUrl;
    return assets.upload_icon;
  }, [coverFile, car.coverUrl]);

  // Preview da galeria: mistura urls + arquivos
  const galleryPreviews = useMemo(() => {
    const fromUrls = (car.galleryUrls || []).map((url) => ({ type: "url", value: url }));
    const fromFiles = galleryFiles.map((file) => ({ type: "file", value: fileToPreviewUrl(file), raw: file }));
    return [...fromUrls, ...fromFiles].slice(0, MAX_GALLERY);
  }, [car.galleryUrls, galleryFiles]);

  // Valida 1 arquivo (tamanho e tipo)
  const validateFile = (file) => {
    if (!file) return "Arquivo inválido.";
    if (!file.type?.startsWith("image/")) return "Apenas imagens são permitidas.";
    if (file.size > MAX_FILE_SIZE_BYTES) return `Imagem acima de ${MAX_FILE_SIZE_MB}MB.`;
    return "";
  };

  // Capa
  const handleCoverChange = (e) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    const err = validateFile(file);
    if (err) {
      setError(`❌ Capa: ${err}`);
      if (coverInputRef.current) coverInputRef.current.value = "";
      return;
    }

    setCoverFile(file);
  };

  // Galeria (múltiplas)
  const handleGalleryChange = (e) => {
    setError("");
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // calcula quantas já existem (urls + files)
    const existingCount = (car.galleryUrls?.length || 0) + galleryFiles.length;
    const remaining = MAX_GALLERY - existingCount;

    if (remaining <= 0) {
      setError(`⚠️ Você já atingiu o limite de ${MAX_GALLERY} fotos na galeria.`);
      if (galleryInputRef.current) galleryInputRef.current.value = "";
      return;
    }

    const accepted = [];
    for (const f of files) {
      if (accepted.length >= remaining) break;

      const err = validateFile(f);
      if (err) {
        // Mostra um erro amigável, mas ainda permite adicionar as válidas
        setError(`⚠️ Algumas imagens foram ignoradas. Motivo: ${err} (máx ${MAX_FILE_SIZE_MB}MB)`);
        continue;
      }

      accepted.push(f);
    }

    if (accepted.length > 0) {
      setGalleryFiles((prev) => [...prev, ...accepted].slice(0, MAX_GALLERY));
    }

    if (galleryInputRef.current) galleryInputRef.current.value = "";
  };

  // Remover imagem da galeria (suporta urls e files)
  const removeGalleryItem = (itemIndex) => {
    setError("");

    // A lista mostrada = urls + files
    const urlCount = car.galleryUrls?.length || 0;

    if (itemIndex < urlCount) {
      // remove da lista de urls
      setCar((prev) => ({
        ...prev,
        galleryUrls: prev.galleryUrls.filter((_, i) => i !== itemIndex),
      }));
      return;
    }

    // remove da lista de files
    const fileIndex = itemIndex - urlCount;
    setGalleryFiles((prev) => prev.filter((_, i) => i !== fileIndex));
  };

  // Remover capa selecionada (volta pra url da capa no edit)
  const clearCoverFile = () => {
    setCoverFile(null);
    setError("");
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  // Atualiza campos do form
  const updateField = (key, value) => {
    setCar((prev) => ({ ...prev, [key]: value }));
  };

  // Submit: monta payload “pronto pra API”
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // validações mínimas
    if (!car.brand.trim() || !car.model.trim()) {
      setError("⚠️ Preencha pelo menos Brand e Model.");
      return;
    }

    // capa: no create recomendamos ter uma capa
    if (mode === "create" && !coverFile) {
      setError("⚠️ Adicione uma imagem de capa para o carro.");
      return;
    }

    const payload = {
      ...car,
      // padroniza campos numéricos
      year: Number(car.year),
      pricePerDay: Number(car.pricePerDay),
      seating_capacity: Number(car.seating_capacity),

      // arquivos (para futura API)
      coverFile,             // File | null
      galleryFiles,          // File[]
    };

    await onSubmit?.(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-3xl">
      {/* Error banner (bonito) */}
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex items-start gap-2">
            <span className="mt-0.5">🚨</span>
            <div>
              <p className="font-medium">Something needs attention</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: imagens */}
        <div className="lg:col-span-1 space-y-6">
          {/* Cover */}
          <div className="bg-white border border-bordercolor rounded-xl p-4 shadow-sm">
            <p className="font-medium text-gray-800">Cover image</p>
            <p className="text-xs text-gray-500 mt-1">
              Recommended: 1 clear front photo.
            </p>

            <div className="mt-4 flex items-center gap-4">
              <label htmlFor="car-cover" className="cursor-pointer">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 border border-bordercolor">
                  <img
                    src={coverPreview}
                    alt="cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <input
                  ref={coverInputRef}
                  type="file"
                  id="car-cover"
                  accept="image/*"
                  hidden
                  onChange={handleCoverChange}
                />
              </label>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg border border-bordercolor hover:bg-gray-50 transition text-sm"
                  onClick={() => coverInputRef.current?.click()}
                >
                  Upload cover
                </button>

                {coverFile && (
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg border border-bordercolor hover:bg-gray-50 transition text-sm"
                    onClick={clearCoverFile}
                  >
                    Remove
                  </button>
                )}

                <p className="text-xs text-gray-500">
                  Max {MAX_FILE_SIZE_MB}MB • JPG/PNG/WebP
                </p>
              </div>
            </div>
          </div>

          {/* Gallery */}
          <div className="bg-white border border-bordercolor rounded-xl p-4 shadow-sm">
            <p className="font-medium text-gray-800">Gallery</p>
            <p className="text-xs text-gray-500 mt-1">
              Add up to {MAX_GALLERY} photos (interior, details, etc).
            </p>

            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dull transition text-sm"
                onClick={() => galleryInputRef.current?.click()}
              >
                Add photos
              </button>

              <p className="text-xs text-gray-500">
                {galleryPreviews.length}/{MAX_GALLERY}
              </p>

              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleGalleryChange}
              />
            </div>

            {/* previews */}
            {galleryPreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {galleryPreviews.map((item, idx) => (
                  <div key={`${item.type}-${idx}`} className="relative">
                    <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-100 border border-bordercolor">
                      <img
                        src={item.type === "url" ? item.value : item.value}
                        alt="gallery"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeGalleryItem(idx)}
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gray-900 text-white
                      flex items-center justify-center shadow hover:scale-105 transition"
                      aria-label="Remove photo"
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {galleryPreviews.length === 0 && (
              <div className="mt-4 rounded-xl border border-dashed border-bordercolor p-4 text-xs text-gray-500">
                No gallery photos yet.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: campos */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-bordercolor rounded-xl p-5 shadow-sm">
            <p className="font-medium text-gray-800">Car details</p>
            <p className="text-xs text-gray-500 mt-1">
              Keep it consistent for better search results.
            </p>

            {/* Campos */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex flex-col gap-2">
                <label className="font-medium">Brand</label>
                <input
                  value={car.brand}
                  onChange={(e) => updateField("brand", e.target.value)}
                  className="border border-bordercolor rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g. BMW"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-medium">Model</label>
                <input
                  value={car.model}
                  onChange={(e) => updateField("model", e.target.value)}
                  className="border border-bordercolor rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g. X5"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-medium">Year</label>
                <input
                  type="number"
                  value={car.year}
                  onChange={(e) => updateField("year", e.target.value)}
                  className="border border-bordercolor rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                  min={1990}
                  max={new Date().getFullYear() + 1}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-medium">Price per day</label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">{currency}</span>
                  <input
                    type="number"
                    value={car.pricePerDay}
                    onChange={(e) => updateField("pricePerDay", e.target.value)}
                    className="w-full border border-bordercolor rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                    min={0}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-medium">Category</label>
                <input
                  value={car.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className="border border-bordercolor rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Sedan / SUV / Coupe..."
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-medium">Transmission</label>
                <input
                  value={car.transmission}
                  onChange={(e) => updateField("transmission", e.target.value)}
                  className="border border-bordercolor rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Automatic / Manual..."
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-medium">Fuel type</label>
                <input
                  value={car.fuel_type}
                  onChange={(e) => updateField("fuel_type", e.target.value)}
                  className="border border-bordercolor rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Petrol / Diesel / Hybrid..."
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-medium">Seats</label>
                <input
                  type="number"
                  value={car.seating_capacity}
                  onChange={(e) => updateField("seating_capacity", e.target.value)}
                  className="border border-bordercolor rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                  min={1}
                  max={9}
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="font-medium">Location</label>
                <input
                  value={car.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  className="border border-bordercolor rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g. Houston"
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="font-medium">Description</label>
                <textarea
                  rows={5}
                  value={car.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className="border border-bordercolor rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Write a clear description of the car..."
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center gap-3">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-primary text-white hover:bg-primary-dull transition
                hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
              >
                {mode === "edit" ? "Save changes" : "Add car"}
              </button>

              <button
                type="button"
                onClick={onCancel}
                className="px-5 py-2 rounded-xl border border-bordercolor hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <p className="text-xs text-gray-500 ml-auto">
                Max {MAX_GALLERY} gallery photos • {MAX_FILE_SIZE_MB}MB each
              </p>
            </div>
          </div>

          {/* Hint box (padrão produto) */}
          <div className="mt-4 text-xs text-gray-500">
            Tip: For best results, add interior + dashboard photos in the gallery.
          </div>
        </div>
      </div>
    </form>
  );
};

export default CarForm;