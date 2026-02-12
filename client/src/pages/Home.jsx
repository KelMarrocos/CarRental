import React from 'react'

// Sections (ordem importa para legibilidade)
import Hero from '../components/Hero'
import FeaturedSection from '../components/FeaturedSection'
import Banner from '../components/Banner'
import Testimonial from '../components/Testimonial'
import Newsletter from '../components/Newsletter'

/*
  Home Page

  Responsável por montar a landing page principal.
  Apenas composição — nenhuma lógica deve viver aqui.

  REGRA DE OURO:
  Pages = estrutura
  Components = comportamento
*/

const Home = () => {
  return (
    <main>
      {/* Hero — primeira dobra */}
      <Hero />

      {/* Carros em destaque */}
      <FeaturedSection />

      {/* CTA para donos de veículos */}
      <Banner />

      {/* Prova social */}
      <Testimonial />

      {/* Captura de leads */}
      <Newsletter />
    </main>
  )
}

export default Home
