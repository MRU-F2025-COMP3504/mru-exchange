import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';

    export default function Footer() {

        
        const navigate = useNavigate();


        // Initialize
        const sitename = "MRUExchange.com";
        const address = "4825 Mt Royal Gate SW, Calgary, Alberta, Canada, T3E 6K6"
        const phone = '1-800-467-6287';
        const separator = " | ";

        // Return
        return (
            <footer className="bg-gray-500 py-6 mt-8">

                {/* Copyright line */}
                <div>
                    <p className='text-center text-sm text-white'>
                        &copy; {new Date().getFullYear()}-{new Date().getFullYear()}, {sitename}
                    </p>
                </div>

                {/* Address line */}
                <div>
                    <p className='text-center text-sm text-gray-900'>
                        {sitename}{separator}{address}{separator}{phone}
                    </p>
                </div>

                {/* Links */}
                <div className='mt-4 text-center'>
                    <Link
                    to='/contact-us'
                    className='text-sm text-indigo-600 hover:text-indigo-800 hover:underline'
                    >
                    Contact Us
                    </Link>
                </div>
                
            </footer>
    )
    }