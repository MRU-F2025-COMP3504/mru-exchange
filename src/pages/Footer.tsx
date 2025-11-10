import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Footer() {


    const navigate = useNavigate();


    // Variables
    const sitename = "MRUExchange.com";
    const address = "4825 Mt Royal Gate SW, Calgary, Alberta, Canada, T3E 6K6"
    const phone = '1-800-467-6287';
    const separator = " | ";
    const startYear = 2025;

    // Constants
    const currentYear = new Date().getFullYear();

    // Functions
    function copyrightYear() {

        // Initialize
        let str = `${startYear}`;

        // If multi-year,
        if (currentYear > startYear) {

            // Update
            str = `${startYear}-${currentYear}`;

        }
        // Otherwise, if before start year,
        else if (currentYear < startYear) {

            // Throw an error.
            throw new Error("Current year is before start year.");
            
        }

        // Return
        return str;

    }

    // Return
    return (
        <footer className="py-6 mt-8 text-white bg-[#003A5F]">

            {/* Copyright section */}
            <section style={{ padding: '1rem 0' }}>
                <p className='text-center text-sm'>
                    &copy; {copyrightYear()}, {sitename}
                </p>
            </section>

            {/* Info section */}
            <section style={{ padding: '0 0 1rem 0' }} className='text-center text-sm'>
                <p>
                    {sitename}{separator}{address}{separator}{phone}
                </p>
                <Link
                    to='/contact-us'
                    className='text-sm hover:text-[#C2EAFC] hover:underline'
                >
                    Contact Us
                </Link>
            </section>

        </footer>
    )
}