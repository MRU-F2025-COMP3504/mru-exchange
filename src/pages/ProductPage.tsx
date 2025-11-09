import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from './Header';

export default function ProductPage() {
    
    const Product = {
        name: "Sample Product",
        description: "This is a sample product description.",
        price: 49.99,
        imageUrl: "https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fthumbs.dreamstime.com%2Fz%2Fstack-textbooks-20767064.jpg&sp=1762724834T32da08f0ce1d6153cedfbd344b1dde3a60716543a8f64376066d650b2292b1ae"
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>

        <Header/>
        <main style={{ padding: '2rem', backgroundColor: 'gray'}}>
            <h1>{Product.name}</h1>
        </main>
        </div>
    )
}   