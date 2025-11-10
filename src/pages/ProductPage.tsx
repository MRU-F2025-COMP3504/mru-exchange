import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function ProductPage() {

    type Breadcrumb = {
        name: string;
        path: string;
    }

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

    // Functions
    /**
     * Creates breadcrumb navigation links.
     * @param breadcrumbs An Array of Breadcrumb objects representing the breadcrumb trail.
     * @returns An array of JSX elements that can be displayed.
     */
    function createBreadcrumbTrail(breadcrumbs: Array<Breadcrumb>): JSX.Element[][] {

        // Return
        return (

            // Map
            breadcrumbs.map((Breadcrumb: Breadcrumb, i: number) => {

                // Initialize
                let navLink: JSX.Element[] = [];

                // If this is the second or later link, add a separator.
                if (i > 0) {
                    navLink.push(<span key={`sep-${i}`}> &gt; </span>);
                }

                // Add markup
                navLink.push(<Link key={Breadcrumb.name} to={Breadcrumb.path}>{Breadcrumb.name}</Link>);

                // Return
                return navLink;

            })
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>

            <Header />

            <main style={{ padding: '2rem', backgroundColor: '#A7E2FC', color: '#003A5F' }}>

                {/* Main display */}
                <section>

                    {/* Navigation */}
                    <div>
                        {createBreadcrumbTrail(breadcrumbs)}
                    </div>

                    <h1>{Product.name}</h1>


                </section>
            </main>

            <Footer />
        </div>
    )
}   