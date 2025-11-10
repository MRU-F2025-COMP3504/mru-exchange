import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import type { Breadcrumb } from '../shared/components/BreadcrumbTrail';
import BreadcrumbTrail from '../shared/components/BreadcrumbTrail';

export default function ProductPage() {

    // System Variables
    type Product = {
        name: string;
        description: string;
        price: number;
        imageUrl: string;
    }

    // Configurable Variables
    const breadcrumbs: Array<Breadcrumb> = [
        { name: 'School', path: '/product-search/school' },
        { name: 'Course Supplies', path: '/product-search/school/course-supplies/' },
        { name: 'Textbooks', path: '/product-search/school/course-supplies/textbooks' },
    ];
    const Product: Product = {
        name: "Textbooks",
        description: "Unused textbooks.",
        price: 49.99,
        imageUrl: "https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fthumbs.dreamstime.com%2Fz%2Fstack-textbooks-20767064.jpg&sp=1762724834T32da08f0ce1d6153cedfbd344b1dde3a60716543a8f64376066d650b2292b1ae"
    }

    // Main
    return (
        <div className="bg-[#F9FAFB] min-h-screen">

            <Header />

            {/* Main display */}
            <main className="p-8 bg-[#A7E2FC] text-[#003A5F]">

                {/* Navigation */}
                <section>

                    {/* Breadcrumbs */}
                    <div>
                        <BreadcrumbTrail breadcrumbs={breadcrumbs} />
                    </div>


                </section>

                {/* Product Details */}
                <section className="p-5 flex flex-col sm:flex-row gap-5">

                    
                    <img src={Product.imageUrl}
                        alt={Product.name}
                        width='250px'
                        height='250px'
                        className="bg-red-500 object-cover mx-auto sm:mx-0" />
                    <h1>{Product.name}</h1>

                </section>
            </main>

            <Footer />
        </div>
    )
}   