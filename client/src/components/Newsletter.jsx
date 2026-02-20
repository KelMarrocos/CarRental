import React, { useState } from 'react'

/*
==================================
NEWSLETTER COMPONENT
==================================

Responsável por capturar emails para campanhas.

BOAS PRÁTICAS:
✔ input controlado
✔ preventDefault no form
✔ type="email" para validação nativa
✔ reset após envio
✔ foco visual no input

FUTURO (altamente recomendado):
→ integrar com Mailchimp / Resend / Sendgrid
→ mostrar toast de sucesso
→ loading state
→ validar email antes do envio
→ evitar múltiplos envios
→ salvar leads no banco
*/

const Newsletter = () => {

  // controla o valor do input (controlled component)
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    /*
      FUTURO:
      trocar console.log por chamada API.

      Exemplo:
      await api.post('/newsletter', { email })
    */
    console.log("Email enviado:", email)

    // limpa campo após envio
    setEmail('')
  }

  return (
    <section
      /*
      space-y → espaçamento automático entre elementos
      mb-40 → cria respiro antes do footer
      */
      className="flex flex-col items-center justify-center 
      text-center space-y-3 max-md:px-4 my-10 mb-40"
    >

      {/* ================= TITLE ================= */}
      <h2 className="md:text-4xl text-2xl font-semibold">
        Never Miss a Deal!
      </h2>


      {/* ================= SUBTITLE ================= */}
      <p className="md:text-lg text-gray-500/70 pb-6 max-w-xl">
        Subscribe to get the latest offers, new arrivals, and exclusive discounts.
      </p>


      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-between 
        max-w-2xl w-full h-12 md:h-14"
      >

        {/* EMAIL INPUT
        
        border-r-0 → remove linha duplicada com botão
        focus:ring → feedback visual moderno
        */}
        <input
          className="border border-gray-300 h-full w-full 
          outline-none px-4 text-gray-700
          rounded-l-md border-r-0
          focus:ring-2 focus:ring-primary/30
          transition"
          type="email" // validação automática do browser
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />


        {/* BUTTON
        
        rounded-r-md → encaixa perfeitamente no input
        */}
        <button
          type="submit"
          className="px-8 md:px-12 h-full text-white 
          bg-primary hover:bg-primary-dull
          transition-all cursor-pointer
          rounded-r-md font-medium"
        >
          Subscribe
        </button>

      </form>

    </section>
  )
}

export default Newsletter
