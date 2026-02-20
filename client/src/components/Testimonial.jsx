import React from 'react'
import Title from './Title'
import { assets } from '../constants/assets';

/*
=====================================
TESTIMONIAL DATA
=====================================

Ideal manter isso fora do componente.

FUTURO:
→ substituir por dados vindos da API
→ ex: GET /testimonials
→ permitir avaliações reais de usuários
*/

const testimonials = [
  {
    id: 1,
    name: "Emma Rodriguez",
    location: "Barcelona, Spain",
    image: assets.testimonial_image_1,
    rating: 5, // ⭐ já preparado para nota dinâmica
    testimonial:
      "I've rented cars from various companies, but the experience with CarRental was exceptional."
  },
  {
    id: 2,
    name: "John Smith",
    location: "New York, USA",
    image: assets.testimonial_image_2,
    rating: 5,
    testimonial:
      "CarRental made my trip so much easier. The car was delivered right to my door, and the customer service was fantastic!"
  },
  {
    id: 3,
    name: "Ava Johnson",
    location: "Sydney, Australia",
    image: assets.testimonial_image_1,
    rating: 5,
    testimonial:
      "I highly recommend CarRental! Their fleet is amazing, and I always feel like I'm getting the best deal with excellent service."
  }
];

const Testimonials = () => {
  return (
    <section
      /*
      py-24 → cria bastante respiro visual
      Ideal para separar blocos importantes da Home
      */
      className="py-24 px-6 md:px-16 lg:px-24 xl:px-40"
    >

      {/* SECTION TITLE */}
      <Title
        title="What Our Customers Say"
        subtitle="Discover why discerning travelers choose CarRental for premium vehicles around the world."
      />

      {/* GRID DE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">

        {testimonials.map((testimonial) => (

          <article
            key={testimonial.id}
            /*
            group → permite animações nos filhos
            hover:-translate-y → efeito premium
            */
            className="
              group
              bg-white p-7 rounded-2xl border border-gray-100
              shadow-sm hover:shadow-2xl
              hover:-translate-y-3
              transition-all duration-500
            "
          >

            {/* USER INFO */}
            <div className="flex items-center gap-4">

              <img
                className="
                  w-14 h-14 rounded-full object-cover
                  ring-2 ring-gray-100
                  group-hover:ring-primary/30
                  transition
                "
                src={testimonial.image}
                alt={`Photo of ${testimonial.name}`}
              />

              <div>
                <p className="text-lg font-semibold">
                  {testimonial.name}
                </p>

                <p className="text-gray-500 text-sm">
                  {testimonial.location}
                </p>
              </div>

            </div>

            {/* RATING
            
            FUTURO:
            → suportar notas quebradas (4.5)
            → mostrar estrelas vazias
            */}
            <div className="flex items-center gap-1 mt-4">

              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <img
                  key={i}
                  className="
                    w-4 opacity-90
                    group-hover:scale-110
                    transition
                  "
                  src={assets.star_icon}
                  alt="rating star"
                />
              ))}

            </div>

            {/* TESTIMONIAL TEXT */}
            <p className="
              text-gray-600 mt-4
              leading-relaxed
            ">
              “{testimonial.testimonial}”
            </p>

          </article>
        ))}

      </div>

    </section>
  )
}

export default Testimonials