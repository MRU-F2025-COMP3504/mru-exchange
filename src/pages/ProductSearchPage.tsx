import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from './Header';

export default function ProductSearchPage() {
        
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>

            <Header/>

            <main
            style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '2rem',
            }}
            ></main>
        
        </div>
    )
}