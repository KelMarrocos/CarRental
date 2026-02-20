import React, { useState } from 'react'
import { assets, menuLinks } from '../constants'
import { Link, useLocation, useNavigate } from 'react-router-dom'

/*
==================================
NAVBAR COMPONENT
==================================

Responsável pela navegação principal da aplicação.

BOAS PRÁTICAS APLICADAS:
✔ controle de rota ativa
✔ navegação programática
✔ menu mobile
✔ fechamento automático ao clicar
✔ layout responsivo
✔ transições suaves

FUTURO:
→ adicionar avatar do usuário
→ dropdown de perfil
→ logout
→ search real conectada à API
→ sticky navbar
*/

const Navbar = ({ setShowLogin }) => {

  // identifica rota atual
  const location = useLocation()

  // navegação via código
  const navigate = useNavigate()

  // controla menu mobile aberto/fechado
  const [open, setOpen] = useState(false)

  // muda cor da navbar na home
  const isHome = location.pathname === "/"

  return (
    <header
      /*
      relative → necessário para elementos mobile
      transition-all → suaviza troca de cores
      */
      className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 
      py-4 text-gray-600 border-b border-bordercolor relative transition-all
      ${isHome ? "bg-light" : "bg-white"}`}
    >

      {/* ================= LOGO ================= */}
      <Link to="/">
        <img src={assets.logo} alt="Company logo" className='h-8' />
      </Link>


      {/* ================= MENU =================

      max-sm:
      cria menu lateral ocupando tela inteira.

      translate-x-full:
      esconde fora da tela.

      translate-x-0:
      traz de volta com animação.
      */}
      <nav
        className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 
        max-sm:border-t border-bordercolor right-0 flex flex-col sm:flex-row 
        items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-transform 
        duration-300 z-50 ${isHome ? "bg-light" : "bg-white"}
        ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}
      >

        {/* LINKS DINÂMICOS
           Evita hardcode — basta alterar menuLinks.
        */}
        {menuLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className='hover:text-gray-900 transition'
            onClick={() => setOpen(false)} // fecha menu no mobile
          >
            {link.name}
          </Link>
        ))}


        {/* ================= SEARCH =================

        hidden lg:flex:
        só aparece em telas grandes.

        FUTURO:
        → transformar em componente próprio
        → debounce
        → autocomplete
        → integrar com backend
        */}
        <div
          className={`hidden lg:flex items-center text-sm gap-2 border 
          border-bordercolor px-3 rounded-full max-w-56
          ${isHome ? "bg-light" : "bg-white"}`}
        >
            <input
              type="text"
              className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
              placeholder="Search cars..."
            />
            <img src={assets.search_icon} alt="search" />
        </div>


        {/* ================= ACTIONS ================= */}
        <div className='flex max-sm:flex-col items-start sm:items-center gap-6'>
            
            {/* Navegação programática
               Melhor que <Link> quando envolve lógica
            */}
            <button
              onClick={() => navigate('/owner')}
              className="cursor-pointer hover:text-gray-900 transition"
            >
              Dashboard
            </button>

            {/* Abre modal de login (controlado pelo componente pai) */}
            <button
              onClick={() => setShowLogin(true)}
              className="cursor-pointer px-8 py-2 bg-primary 
              hover:bg-primary-dull transition text-white rounded-lg"
            >
              Login
            </button>

        </div>
      </nav>


      {/* ================= MOBILE BUTTON =================

      Alterna ícone automaticamente.

      DICA DE SENIOR:
      sempre use aria-label → melhora acessibilidade
      e SEO técnico.
      */}
      <button
        className='sm:hidden cursor-pointer'
        aria-label="Toggle menu"
        onClick={() => setOpen(!open)}
      >
        <img src={open ? assets.close_icon : assets.menu_icon} alt="" />
      </button>

    </header>
  )
}

export default Navbar
