import React from 'react'
import { assets } from '../constants/assets'

const Footer = () => {
    return (
        <footer className='px-6 md:px-16 lg:px-32 xl:px-32 mt-60 text-sm text-gray-500'>
            
            <div className='flex flex-wrap justify-between items-start gap-8 pb-6 border-bordercolor border-b'>
                
                {/* Logo + descrição */}
                <div>
                    <img src={assets.logo} alt="Luxury Rentals logo" className='h-8 md:h-9' />
                    <p className='max-w-80 mt-3'>
                        Premium car rental service with a wide selection of luxury and
                        everyday vehicles for all your driving needs.
                    </p>

                    {/* Redes sociais */}
                    <div className='flex items-center gap-3 mt-6'>
                        <a href='#' aria-label="Instagram">
                            <img src={assets.instagram_logo} alt="" className='w-5 h-5'/>
                        </a>

                        <a href='#' aria-label="Facebook">
                            <img src={assets.facebook_logo} alt="" className='w-5 h-5'/>
                        </a>

                        <a href='#' aria-label="Twitter">
                            <img src={assets.twitter_logo} alt="" className='w-5 h-5'/>
                        </a> 

                        <a href='#' aria-label="Email">
                            <img src={assets.gmail_logo} alt="" className='w-5 h-5'/>
                        </a>
                    </div>
                </div>

                {/* Links rápidos */}
                <div>
                    <h2 className='text-base font-medium text-gray-800 uppercase'>Quick Links</h2>
                    <ul className='mt-3 flex flex-col gap-1.5'>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">Browse Cars</a></li>
                        <li><a href="#">List Your Car</a></li>
                        <li><a href="#">About Us</a></li>
                    </ul>
                </div>

                {/* Recursos */}
                <div>
                    <h2 className='text-base font-medium text-gray-800 uppercase'>Resources</h2>
                    <ul className='mt-3 flex flex-col gap-1.5'>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Terms of Service</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Insurance</a></li>
                    </ul>
                </div>

                {/* Contato */}
                <div>
                    <h2 className='text-base font-medium text-gray-800 uppercase'>Contact</h2>
                    <ul className='mt-3 flex flex-col gap-1.5'>
                        <li>123 Luxury Car</li>
                        <li>San Francisco, CA</li>
                        <li>Phone: +1 (555) 123-4567</li>
                        <li>Email: info@luxuryrentals.com</li>
                        <li>Hours: Mon-Fri 9AM-6PM</li>
                    </ul>
                </div>

            </div>

            {/* Bottom */}
            <div className='flex flex-col md:flex-row gap-2 items-center justify-between py-5'>
                <p>
                    © {new Date().getFullYear()}{" "}
                    <a 
                        href="https://prebuiltui.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-700"
                    >
                        PrebuiltUI
                    </a>. All rights reserved.
                </p>

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
