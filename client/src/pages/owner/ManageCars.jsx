import React, { useEffect, useMemo, useState } from 'react'
import { dummyCarData } from '../../data/mockData'
import Title from '../../components/owner/Title'
import { assets } from '../../constants/assets'
import { useNavigate } from 'react-router-dom'

/*
  ManageCars (Owner)
  -----------------
  Objetivo:
  → listar carros do proprietário
  → facilitar ações (editar / remover / toggle disponibilidade)
  → UI com cara de painel SaaS (Airbnb/Stripe)

  Melhorias incluídas:
  ✔ tabela responsiva e legível
  ✔ thumbnail nítida (sem “perder qualidade”)
  ✔ nome sempre visível no mobile (infos extras só no desktop)
  ✔ badge de status com cores + hover suave
  ✔ coluna de preço com moeda automática (VITE_CURRENCY)
  ✔ ações com ícones + hover
  ✔ empty state elegante
  ✔ skeleton loading simples (para futura integração com API)

  Futuras melhorias fáceis:
  → buscar carros via API + paginação
  → modal de confirmação (delete)
  → edição inline
  → ordenação e filtros
*/

const ManageCars = () => {
  /* =========================
     State
  ========================== */

  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();
  const toggleAvailability = (id) => {
  setCars(prev =>
    prev.map(car =>
      car._id === id
        ? { ...car, isAvailable: !car.isAvailable }
        : car
    )
  )
}

  // moeda automática (conforme seu .env: VITE_CURRENCY=$)
  const currency = import.meta.env.VITE_CURRENCY || '$'

  /* =========================
     Fetch (mock)
     - aqui futuramente vira API
  ========================== */
  const fetchOwnerCars = async () => {
    setLoading(true)

    // simula fetch
    setTimeout(() => {
      setCars(dummyCarData)
      setLoading(false)
    }, 400)
  }

  useEffect(() => {
    fetchOwnerCars()
  }, [])

  /* =========================
     Helpers
  ========================== */

  // Formata preço (ex.: $ 300)
  const formatPrice = (value) => `${currency} ${value}`

  // Status calculado a partir de isAvailable (mock)
  const getStatus = (car) => (car.isAvailable ? 'Available' : 'Unavailable')

  // Classes do badge (cores + hover)
  const getStatusClasses = (status) => {
    if (status === 'Available') {
      return 'bg-green-500/10 text-green-700 border-green-500/20 hover:bg-green-500/15'
    }
    return 'bg-gray-500/10 text-gray-700 border-gray-500/20 hover:bg-gray-500/15'
  }

  /* =========================
     Actions (mock)
     - futuramente vira API
  ========================== */

  const handleToggleAvailability = (carId) => {
    setCars((prev) =>
      prev.map((c) =>
        c._id === carId ? { ...c, isAvailable: !c.isAvailable } : c
      )
    )
  }

  const handleEdit = (carId) => {
    // Futuro: navegar para /owner/edit-car/:id
    console.log('Edit car:', carId)
  }

  const handleDelete = (carId) => {
    // Futuro: modal de confirmação + API
    setCars((prev) => prev.filter((c) => c._id !== carId))
  }

  /* =========================
     Skeleton UI
     - deixa o dashboard "vivo"
  ========================== */
  const SkeletonRow = () => (
    <tr className="border-t border-bordercolor">
      <td className="p-3">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-md bg-gray-200 animate-pulse shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-28 bg-gray-200 rounded mt-2 animate-pulse hidden md:block" />
          </div>
        </div>
      </td>
      <td className="p-3 max-md:hidden">
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
      </td>
      <td className="p-3">
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
      </td>
      <td className="p-3 max-md:hidden">
        <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse" />
      </td>
      <td className="p-3">
        <div className="flex items-center gap-2 justify-end">
          <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse hidden sm:block" />
        </div>
      </td>
    </tr>
  )

  /* =========================
     Empty state
  ========================== */
  const EmptyState = () => (
    <div className="py-14 px-6 text-center">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
        <img src={assets.carIconColored || assets.car_icon} alt="" className="w-7 h-7" />
      </div>

      <h2 className="mt-4 text-lg font-semibold text-gray-800">
        No cars listed yet
      </h2>
      <p className="text-sm text-gray-500 mt-1">
        Add your first car to start receiving bookings.
      </p>

      {/* Futuro: Link para /owner/add-car */}
      <button
        type="button"
        onClick={() => console.log('Go to add-car')}
        className="mt-6 px-5 py-2 rounded-xl bg-primary text-white
        hover:bg-primary-dull transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
      >
        Add new car
      </button>
    </div>
  )

  return (
    <div className="px-4 pt-10 md:px-10 w-full">
      <Title
        title="Manage Cars"
        subTitle="View all listed cars, update their details, or remove them from the booking platform."
      />

      {/* Container da tabela */}
      <div className="max-w-5xl w-full rounded-xl overflow-hidden border border-bordercolor mt-6 bg-white shadow-sm">
        {/* Header (top bar) */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-bordercolor">
          <p className="text-sm text-gray-500">
            Showing <span className="text-gray-800 font-medium">{cars.length}</span> cars
          </p>

          {/* Futuro: search + filtros */}
          <button
            type="button"
            onClick={fetchOwnerCars}
            className="text-sm px-4 py-2 rounded-lg border border-bordercolor
            hover:bg-gray-50 transition"
          >
            Refresh
          </button>
        </div>

        {/* Tabela */}
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-gray-600">
            <thead className="text-gray-500 bg-gray-50">
              <tr>
                <th className="p-3 font-medium">Car</th>
                <th className="p-3 font-medium max-md:hidden">Category</th>
                <th className="p-3 font-medium">Price</th>
                <th className="p-3 font-medium max-md:hidden">Status</th>
                <th className="p-3 font-medium text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {/* Loading skeleton */}
              {loading && (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              )}

              {/* Empty state */}
              {!loading && cars.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <EmptyState />
                  </td>
                </tr>
              )}

              {/* Lista real */}
              {!loading &&
                cars.map((car) => {
                  const status = getStatus(car)

                  return (
                    <tr
                      key={car._id}
                      className="border-t border-bordercolor hover:bg-gray-50/60 transition"
                    >
                      {/* Car column: imagem + infos */}
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          {/* Thumbnail (não perde qualidade) */}
                          <div className="w-14 h-14 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                            <img
                              src={car.image}
                              alt={`${car.brand} ${car.model}`}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Texts */}
                          <div className="min-w-0">
                            {/* Nome sempre visível (mobile também) */}
                            <p className="font-medium text-gray-800 truncate">
                              {car.brand} {car.model}
                            </p>

                            {/* Infos extras só no desktop */}
                            <p className="text-xs text-gray-500 truncate hidden md:block">
                              {car.seating_capacity} Seats • {car.transmission}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-3 max-md:hidden">
                        {car.category}
                      </td>

                      {/* Price */}
                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800">
                            {formatPrice(car.pricePerDay)}
                          </span>
                          <span className="text-xs text-gray-500">per day</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-3 max-md:hidden">
                        <button
                          type="button"
                          onClick={() => handleToggleAvailability(car._id)}
                          className={`
                            inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                            border text-xs font-medium transition
                            hover:-translate-y-[1px] hover:shadow-sm
                            ${getStatusClasses(status)}
                          `}
                          title="Toggle availability"
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${
                              status === 'Available' ? 'bg-green-600' : 'bg-gray-500'
                            }`}
                          />
                          {status}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-3">
                        <div className="flex items-center gap-2 justify-end">

                          {/* AVAILABILITY TOGGLE */}
                          <button
                            onClick={() => toggleAvailability(car._id)}
                            className={`
                              px-3 py-1.5 rounded-md text-sm font-medium transition
                              ${car.isAvailable
                                ? 'bg-green-50 text-green-600 hover:bg-green-100'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                            `}
                          >
                            {car.isAvailable ? 'Listed' : 'Hidden'}
                          </button>
                            
                          {/* EDIT */}
                          <button
                            type="button"
                            onClick={() => navigate(`/owner/edit-car/${car._id}`)}
                            className="
                              h-10 w-10 flex items-center justify-center
                              rounded-lg border border-bordercolor bg-white
                              hover:bg-gray-900 group transition-all
                            "
                            title="Edit"
                          >
                            <img
                              src={assets.edit_icon}
                              alt="edit"
                              className="w-5 h-5 invert group-hover:invert-0"
                            />
                          </button>

                          {/* DELETE */}
                          <button
                            type="button"
                            onClick={() => handleDelete(car._id)}
                            className="
                              h-10 w-10 flex items-center justify-center
                              rounded-lg border border-red-200 bg-red-50
                              hover:bg-red-100 transition hover:-translate-y-[1px] hover:shadow-sm
                            "
                            title="Delete"
                          >
                            <img
                              src={assets.delete_icon || assets.trash_icon}
                              alt="delete"
                              className="w-5 h-5 object-contain opacity-90"
                            />
                          </button>

                          {/* MOBILE STATUS */}
                          <button
                            type="button"
                            onClick={() => handleToggleAvailability(car._id)}
                            className="
                              h-10 px-3 rounded-lg border border-bordercolor bg-white
                              hover:bg-gray-50 transition hover:-translate-y-[1px] hover:shadow-sm
                              text-xs font-medium md:hidden
                            "
                            title="Toggle availability"
                          >
                            {status}
                          </button>

                        </div>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ManageCars