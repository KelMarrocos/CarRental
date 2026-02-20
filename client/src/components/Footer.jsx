import React from 'react'
import { assets } from '../constants/assets'

/*
====================================================
                    FOOTER
====================================================

Responsabilidade:
-> Exibir informações institucionais
-> Facilitar navegação rápida
-> Reforçar identidade da marca
-> Melhorar SEO

Futuras melhorias recomendadas:

✔ transformar links em um array (evita repetição)
✔ integrar com React Router (Link ao invés de <a>)
✔ adicionar newsletter
✔ dark mode automático
✔ internacionalização (i18n)
✔ dados vindos da API / CMS
✔ lazy load das imagens
✔ footer responsivo ainda mais compacto para mobile
✔ adicionar Trust badges / security seals
*/

const Footer = () => {
    return (
        /*
        mt-60 cria um respiro grande da página.
        Se quiser algo mais dinâmico futuramente,
        prefira usar min-h-screen no layout global.
        */

        <footer className='px-6 md:px-16 lg:px-32 xl:px-32 mt-60 text-sm text-gray-500'>
            
            <div className='flex flex-wrap justify-between items-start gap-8 pb-6 border-bordercolor border-b'>
                
                {/* =====================================================
                        LOGO + BRAND DESCRIPTION
                ===================================================== */}

                <div>
                    {/* Ideal futuramente:
                       -> usar <Link />
                       -> imagem em formato webp
                       -> loading="lazy"
                    */}

                    <img 
                        src={assets.logo}
                        alt="Luxury Rentals logo"
                        className='h-8 md:h-9'
                    />

                    <p className='max-w-80 mt-3'>
                        Premium car rental service with a wide selection of luxury and
                        everyday vehicles for all your driving needs.
                    </p>

                    {/* ================= SOCIAL MEDIA =================
                    
                    Melhor prática:
                    -> links reais
                    -> abrir em nova aba
                    -> rel="noopener noreferrer"
                    -> aria-label para acessibilidade
                    */}

                    <div className='flex items-center gap-3 mt-6'>
                        <a href='#' aria-label="Instagram">
                            <img src={assets.instagram_logo} className='w-5 h-5'/>
                        </a>

                        <a href='#' aria-label="Facebook">
                            <img src={assets.facebook_logo} className='w-5 h-5'/>
                        </a>

                        <a href='#' aria-label="Twitter">
                            <img src={assets.twitter_logo} className='w-5 h-5'/>
                        </a> 

                        <a href='#' aria-label="Email">
                            <img src={assets.gmail_logo} className='w-5 h-5'/>
                        </a>
                    </div>
                </div>

                {/* =====================================================
                        QUICK LINKS
                =====================================================

                FUTURO (fortemente recomendado):
                -> Criar array:

                const quickLinks = [
                  {name:"Home", path:"/"},
                  ...
                ]

                -> map()

                Isso evita retrabalho.
                */}

                <div>
                    <h2 className='text-base font-medium text-gray-800 uppercase'>
                        Quick Links
                    </h2>

                    <ul className='mt-3 flex flex-col gap-1.5'>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">Browse Cars</a></li>
                        <li><a href="#">List Your Car</a></li>
                        <li><a href="#">About Us</a></li>
                    </ul>
                </div>

                {/* =====================================================
                        RESOURCES
                ===================================================== */}

                <div>
                    <h2 className='text-base font-medium text-gray-800 uppercase'>
                        Resources
                    </h2>

                    <ul className='mt-3 flex flex-col gap-1.5'>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Terms of Service</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Insurance</a></li>
                    </ul>
                </div>

                {/* =====================================================
                        CONTACT
                =====================================================

                Ideal futuramente:
                -> dados vindo do backend
                -> suporte via chat
                -> botão WhatsApp
                */}

                <div>
                    <h2 className='text-base font-medium text-gray-800 uppercase'>
                        Contact
                    </h2>

                    <ul className='mt-3 flex flex-col gap-1.5'>
                        <li>123 Luxury Car</li>
                        <li>San Francisco, CA</li>
                        <li>Phone: +1 (555) 123-4567</li>
                        <li>Email: info@luxuryrentals.com</li>
                        <li>Hours: Mon-Fri 9AM-6PM</li>
                    </ul>
                </div>

            </div>

            {/* =====================================================
                        FOOTER BOTTOM
            =====================================================

            Contém:
            -> copyright
            -> links legais
            */}

            <div className='flex flex-col md:flex-row gap-2 items-center justify-between py-5'>
                
                <p>
                    © {new Date().getFullYear()}{" "}
                    <a 
                        href="https://prebuiltui.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-700 transition"
                    >
                        PrebuiltUI
                    </a>. All rights reserved.
                </p>

                {/* Ideal transformar em array também */}
                <ul className='flex items-center gap-4'>
                    <li><a href="#">Privacy</a></li>
                    <li>|</li>
                    <li><a href="#">Terms</a></li>
                    <li>|</li>
                    <li><a href="#">Cookies</a></li>
                </ul>
            </div>
        </footer>
    )
}

export default Footer
