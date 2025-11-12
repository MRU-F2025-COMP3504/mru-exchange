import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import type { LinkData } from '../shared/components/LinkDelimitedList';
import LinkDelimitedList from '../shared/components/LinkDelimitedList';

export default function ProductPage() {

    // System Variables
    type Product = {
        name: string;
        seller: string;
        description: string;
        price: number;
        imageUrl: string;
    }

    // Configurable Variables
    const linkData: Array<LinkData> = [
        { name: 'School', path: '/product-search/school', className: 'hover:text-[#0F76D7]' },
        { name: 'Course Supplies', path: '/product-search/school/course-supplies/', className: 'hover:text-[#0F76D7]' },
        { name: 'Textbooks', path: '/product-search/school/course-supplies/textbooks', className: 'hover:text-[#0F76D7]' },
    ];
    const Product: Product = {
        name: "USB Drive 1TB",
        seller: "Logan Hayes",
        description: `A USB Drive that can hold 1TB of data. 
            
            Perfect for storing and transferring files between devices.
            Comes as-is, along with the swivel cap to protect the USB connector when not in use.`,
        price: 49.99,
        imageUrl: "https://i5.walmartimages.com/seo/USB-Flash-Drive-1TB-1000GB-Rotatable-Thumb-Drive-Memory-Stick-for-Computer-USB-Backup-Zip-Drive_4b925a9c-0c5c-4863-800e-a82a919ab23d.94a5aea196db4b49e091d1499cc127d6.png?odnHeight=573&odnWidth=573&odnBg=FFFFFF"
    }
    const avgRating: number = Math.round(3.49);
    const totalReviews: number = 24;

    // Functions
    function displayStars(avgRating: number): string {

        // Initialize
        const fullStar: string = '★';
        const emptyStar: string = '☆';
        let result: string = "";

        // Build
        for (let i = 1; i <= 5; i++){
            result += i <= avgRating ? fullStar : emptyStar;
        }

        // Return
        return result;

    }

    // Main
    return (
        <div className="bg-[#F9FAFB] min-h-screen">

            <Header />

            {/* Main display */}
            <main>

                {/* Product Details */}
                <section id="details" className="p-8 bg-[#A7E2FC] text-[#003A5F]">

                    {/* Navigation */}
                    <section>

                        {/* Breadcrumbs */}
                        <div>
                            <LinkDelimitedList items={linkData} separator=" &gt; " />
                        </div>


                    </section>

                    {/* Product Information */}
                    <section className="p-5 flex flex-col sm:flex-row gap-5">

                        <div className="sm:hidden">
                            <h1 className="text-3xl py-2">{Product.name}</h1>
                            <p className="text-xl">{Product.seller}</p>
                        </div>

                        <div>
                            <img src={Product.imageUrl}
                                alt={Product.name}
                                width='250px'
                                height='250px'
                                className="bg-red-500 object-cover mx-auto sm:mx-0 rounded-2xl shadow-xl" />
                        </div>

                        {/* <div className="p-3 w-full bg-amber-50"> */}
                        <div className="p-3">
                            <div className="hidden sm:block">
                                <h1 className="text-3xl py-2">{Product.name}</h1>
                                <p className="text-xl pb-4">{Product.seller}</p>
                            </div>
                            <p className="whitespace-pre-line">{Product.description}</p>
                        </div>

                    </section>
                </section>

                {/* You might also like... */}
                <section className="p-10">
                    <h2>You might also like...</h2>
                    <div>
                        
                    </div>
                </section>

                {/* Reviews */}
                <section className="p-10">
                    <h2 className="text-2xl">Reviews</h2>
                    <p className="text-2xl"><span className="text-3xl">{ displayStars(avgRating) }</span> ({totalReviews})</p>
                </section>
            </main>

            <Footer />
        </div>
    )
}   