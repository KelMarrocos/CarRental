import React, { useEffect, useMemo, useRef, useState } from "react";
import { assets } from "../../constants/assets";

/*
  CarForm (reutilizável)
  ---------------------
  - Auto-save draft (create) via localStorage (com debounce)
  - Restore draft (create)
  - Expiração do draft (default 24h)
  - Botão "Clear draft"
  - Toast opcional via window.dispatchEvent (sem acoplar com toast aqui)

  Observação:
  - Arquivos (coverFile / galleryFiles) NÃO podem ser persistidos no localStorage
*/

const MAX_GALLERY = 8;
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

//  Config do draft (profissional)
const DRAFT_KEY = "car_rental:add_car_draft:v1";
const DRAFT_TTL_MS = 24 * 60 * 60 * 1000; // 24h
const DRAFT_DEBOUNCE_MS = 500;

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
  coverUrl: "",
  galleryUrls: [],
});

// ============ draft helpers ============
const now = () => Date.now();

const readDraft = () => {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed?.data || !parsed?.savedAt) return null;

    // expiração
    if (now() - parsed.savedAt > DRAFT_TTL_MS) {
      localStorage.removeItem(DRAFT_KEY);
      return null;
    }

    return parsed.data;
  } catch {
    localStorage.removeItem(DRAFT_KEY);
    return null;
  }
};

const writeDraft = (data) => {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ savedAt: now(), data }));
  } catch {
    // se estourar quota, só ignora (não quebra o app)
  }
};

const clearDraft = () => {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {}
};

// ======================================

const CarForm = ({
  mode = "create",
  initialData = null,
  onSubmit,
  onCancel,
}) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";

  const [car, setCar] = useState(buildDefaultCar());

  const [coverFile, setCoverFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);

  const [error, setError] = useState("");

  const coverInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const draftTimerRef = useRef(null);
  const [draftRestored, setDraftRestored] = useState(false);

  //  Restore draft (create) / Load initialData (edit)
  useEffect(() => {
    setError("");

    if (mode === "create") {
      const draft = readDraft();
      if (draft) {
        setCar((prev) => ({ ...prev, ...draft }));
        setDraftRestored(true);

        // evento opcional pra você ouvir fora (se quiser toast)
        window.dispatchEvent(new CustomEvent("carform:draft-restored"));
      } else {
        setDraftRestored(false);
      }

      setCoverFile(null);
      setGalleryFiles([]);
      return;
    }

    // mode edit
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
      coverUrl: initialData.image ?? "",
      galleryUrls: Array.isArray(initialData.images) ? initialData.images : [],
    }));

    setCoverFile(null);
    setGalleryFiles([]);
  }, [initialData, mode]);

  // Auto-save draft (create) com debounce
  useEffect(() => {
    if (mode !== "create") return;

    if (draftTimerRef.current) clearTimeout(draftTimerRef.current);

    draftTimerRef.current = setTimeout(() => {
      // salva somente dados serializáveis
      const dataToSave = {
        ...car,
        // protege pra não salvar urls de ObjectURL sem querer
        // (aqui só temos strings)
      };
      writeDraft(dataToSave);
    }, DRAFT_DEBOUNCE_MS);

    return () => {
      if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    };
  }, [car, mode]);

  // Helpers
  const fileToPreviewUrl = (file) => {
    try {
      return URL.createObjectURL(file);
    } catch {
      return "";
    }
  };

  const coverPreview = useMemo(() => {
    if (coverFile) return fileToPreviewUrl(coverFile);
    if (car.coverUrl) return car.coverUrl;
    return assets.upload_icon;
  }, [coverFile, car.coverUrl]);

  const galleryPreviews = useMemo(() => {
    const fromUrls = (car.galleryUrls || []).map((url) => ({
      type: "url",
      value: url,
    }));
    const fromFiles = galleryFiles.map((file) => ({
      type: "file",
      value: fileToPreviewUrl(file),
      raw: file,
    }));
    return [...fromUrls, ...fromFiles].slice(0, MAX_GALLERY);
  }, [car.galleryUrls, galleryFiles]);

  const validateFile = (file) => {
    if (!file) return "Arquivo inválido.";
    if (!file.type?.startsWith("image/")) return "Apenas imagens são permitidas.";
    if (file.size > MAX_FILE_SIZE_BYTES) return `Imagem acima de ${MAX_FILE_SIZE_MB}MB.`;
    return "";
  };

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

  const handleGalleryChange = (e) => {
    setError("");
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

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
        setError(
          `⚠️ Algumas imagens foram ignoradas. Motivo: ${err} (máx ${MAX_FILE_SIZE_MB}MB)`
        );
        continue;
      }

      accepted.push(f);
    }

    if (accepted.length > 0) {
      setGalleryFiles((prev) => [...prev, ...accepted].slice(0, MAX_GALLERY));
    }

    if (galleryInputRef.current) galleryInputRef.current.value = "";
  };

  const removeGalleryItem = (itemIndex) => {
    setError("");

    const urlCount = car.galleryUrls?.length || 0;

    if (itemIndex < urlCount) {
      setCar((prev) => ({
        ...prev,
        galleryUrls: prev.galleryUrls.filter((_, i) => i !== itemIndex),
      }));
      return;
    }

    const fileIndex = itemIndex - urlCount;
    setGalleryFiles((prev) => prev.filter((_, i) => i !== fileIndex));
  };

  const clearCoverFile = () => {
    setCoverFile(null);
    setError("");
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  const updateField = (key, value) => {
    setCar((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearDraft = () => {
    clearDraft();
    setCar(buildDefaultCar());
    setCoverFile(null);
    setGalleryFiles([]);
    setError("");
    setDraftRestored(false);
    window.dispatchEvent(new CustomEvent("carform:draft-cleared"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!car.brand.trim() || !car.model.trim()) {
      setError("⚠️ Preencha todos os campos abaixo.");
      return;
    }

    if (mode === "create" && !coverFile) {
      setError("⚠️ Adicione uma imagem de capa para o carro.");
      return;
    }

    const payload = {
      ...car,
      year: Number(car.year),
      pricePerDay: Number(car.pricePerDay),
      seating_capacity: Number(car.seating_capacity),
      coverFile,
      galleryFiles,
    };

    await onSubmit?.(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-3xl">
      {/* Draft banner (só no create) */}
      {mode === "create" && draftRestored && (
        <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          <div className="flex items-center justify-between gap-3">
            <p>
              ✅ Rascunho restaurado. Se quiser começar do zero, limpe o rascunho.
            </p>
            <button
              type="button"
              onClick={handleClearDraft}
              className="px-3 py-1.5 rounded-lg border border-blue-200 bg-white hover:bg-blue-100 transition text-xs font-medium"
            >
              Clear draft
            </button>
          </div>
        </div>
      )}

      {/* Error banner */}
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

            {galleryPreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {galleryPreviews.map((item, idx) => (
                  <div key={`${item.type}-${idx}`} className="relative">
                    <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-100 border border-bordercolor">
                      <img
                        src={item.value}
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

          {/* Clear draft quick action */}
          {mode === "create" && (
            <div className="bg-white border border-bordercolor rounded-xl p-4 shadow-sm">
              <p className="font-medium text-gray-800">Draft</p>
              <p className="text-xs text-gray-500 mt-1">
                Your draft is saved automatically.
              </p>

              <button
                type="button"
                onClick={handleClearDraft}
                className="mt-3 w-full px-4 py-2 rounded-lg border border-bordercolor hover:bg-gray-50 transition text-sm"
              >
                Clear draft
              </button>
            </div>
          )}
        </div>

        {/* RIGHT: campos */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-bordercolor rounded-xl p-5 shadow-sm">
            <p className="font-medium text-gray-800">Car details</p>
            <p className="text-xs text-gray-500 mt-1">
              Keep it consistent for better search results.
            </p>

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

          <div className="mt-4 text-xs text-gray-500">
            Tip: For best results, add interior + dashboard photos in the gallery.
          </div>
        </div>
      </div>
    </form>
  );
};

export default CarForm;