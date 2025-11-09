import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from './Header';

export default function ProductSearchPage() {
        
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>

            <Header/>

            <section
                style={{
                    backgroundColor: "#007FB5",
                    padding: "1.5rem 2rem",
                    display: "flex",
                    gap: "1rem",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <input
                    type="text"
                    placeholder="Search listings..."
                    style={{
                        width: "60%",
                        padding: "0.6rem",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "1rem",
                    }}
                />
                <button 
                    style={{
                        backgroundColor: "White",
                        padding: "0.6rem 1.2rem",
                        borderRadius: "6px",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                >
                    Post Ad
                </button>
            </section>
            <div
                style={{
                    display: "flex",
                    maxWidth: "1200px",
                    margin: "2rem auto",
                    gap: "2rem",
                }}
            >
                
            </div>
        </div>
    )
}

<main
            style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '2rem',
            }}
            ></main>