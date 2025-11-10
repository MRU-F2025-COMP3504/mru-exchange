import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import type { Breadcrumb } from '../shared/components/BreadcrumbTrail';
import BreadcrumbTrail from '../shared/components/BreadcrumbTrail';

export default function ProductPage() {

    const breadcrumbs: Array<Breadcrumb> = [
        { name: 'School', path: '/product-search/school' },
        { name: 'Course Supplies', path: '/product-search/school/course-supplies/' },
        { name: 'Textbooks', path: '/product-search/school/course-supplies/textbooks' },
    ];

    type Product = {
        name: string;
        description: string;
        price: number;
        imageUrl: string;
    }

    const Product: Product = {
        name: "Textbooks",
        description: "Unused textbooks.",
        price: 49.99,
        imageUrl: "https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fthumbs.dreamstime.com%2Fz%2Fstack-textbooks-20767064.jpg&sp=1762724834T32da08f0ce1d6153cedfbd344b1dde3a60716543a8f64376066d650b2292b1ae"
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>

            <Header />

            <main style={{ padding: '2rem', backgroundColor: '#A7E2FC', color: '#003A5F' }}>

                {/* Main display */}
                <section>

                    {/* Navigation */}
                    <div>
                        <BreadcrumbTrail breadcrumbs={breadcrumbs}/>
                    </div>

                    <h1>{Product.name}</h1>


                </section>
            </main>

            <Footer />
        </div>
    )
}   