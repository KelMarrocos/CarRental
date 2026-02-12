import React, { useState } from 'react'

const Newsletter = () => {

  // controla o valor do input (boa prática)
  const [email, setEmail] = useState('')

  // evita reload da página
  const handleSubmit = (e) => {
    e.preventDefault()

    // aqui futuramente você envia para API
    console.log("Email enviado:", email)

    setEmail('')
  }

  return (
    <section
      className="flex flex-col items-center justify-center 
      text-center space-y-3 max-md:px-4 my-10 mb-40"
    >

      {/* Title */}
      <h2 className="md:text-4xl text-2xl font-semibold">
        Never Miss a Deal!
      </h2>

      {/* Subtitle */}
      <p className="md:text-lg text-gray-500/70 pb-6 max-w-xl">
        Subscribe to get the latest offers, new arrivals, and exclusive discounts.
      </p>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-between 
        max-w-2xl w-full h-12 md:h-14"
      >

        {/* Email Input */}
        <input
          className="border border-gray-300 h-full w-full 
          outline-none px-4 text-gray-700
          rounded-l-md border-r-0
          focus:ring-2 focus:ring-primary/30
          transition"
          type="email" // 🔥 melhor que text
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Button */}
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
