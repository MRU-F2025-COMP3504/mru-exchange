
import { Link } from 'react-router-dom';

export default function Footer() {

    // System Variables
    const currentYear: number = new Date().getFullYear();

    // Configurable Variables
    const sitename: string = "MRUExchange.com";
    const address: string = "4825 Mt Royal Gate SW, Calgary, Alberta, Canada, T3E 6K6"
    const phone: string = '1-800-467-6287';
    const separator: string = " | ";
    const startYear: number = 2025;

    // Functions
    /**
     * Formats a range of years for display.
     * @param year1 The starting year.
     * @param year2 The ending year.
     * @returns Formatted year range string.
     */
    function formatYearRange(year1: number, year2: number): string {

        // If before year1,
        if (year2 < year1) {

            // Throw an error.
            throw new Error("The starting year for the range cannot be before the ending year.");
            
        }

        // If the same year, display the year, otherwise, display a range.
        let str: string = year1 === year2 ? `${year1}` : `${year1}-${year2}`;

        // Return
        return str;

    }

    // Return
    return (
        <footer className="p-6 text-white bg-[#003A5F]">

            {/* Copyright section */}
            <section className="py-4">
                <p className='text-center text-sm'>
                    &copy; {formatYearRange(startYear, currentYear)}, {sitename}
                </p>
            </section>

            {/* Info section */}
            <section className='pb-4 text-center text-sm'>
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