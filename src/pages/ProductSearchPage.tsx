import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from './Header';
// import React from react

export default function ProductSearchPage() {
        
    const products = Array.from({ length: 32 }).map((_, i) => ({

        id: i + 1,
        title: 'Item ${i + 1}',
        desc: "Description goes here...",

    }));

    const productsToShow = products.slice(0,20);

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
                <aside
                    style={{
                        width: "250px",
                        background: "white",
                        padding: "1rem",
                        borderRadius: "8px",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                        height: "fit-content",
                    }}
                >
                    <h3>Filters</h3>
                    <label style={{ display: "block", marginBottom: "0.5rem" }}>
                        <input type="checkbox" /> Filter 1
                    </label>
                    <label style={{ display: "block", marginBottom: "0.5rem" }}>
                        <input type="checkbox" /> Filter 2
                    </label>
                    <label style={{ display: "block", marginBottom: "0.5rem" }}>
                        <input type="checkbox" /> Filter 3
                    </label>
                </aside>

                <main 
                    style={{
                        flex: 1,
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "2rem",
                    }}
                >
                    {productsToShow.map((product) => (
                    <div
                        key={product.id}
                        style={{
                            background: "white",
                            borderRadius: "12px",
                            padding: "1rem",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                        }}
                    >
                        <div
                            style={{
                                width: "100%",
                                height: "140px",
                                backgroundColor: "#d9d9d9",
                                borderRadius: "8px",
                            }}
                        ></div>

                        <div 
                            style={{
                                marginTop: "0.5rem",
                            }}
                        >
                            <h4>{product.title}</h4>
                            <p>{product.desc}</p>
                        </div>
                    </div>
                    ))}
                </main>
            </div>
        </div>
    )
}

//<main
 //           style={{
  //          maxWidth: '1200px',
   //         margin: '0 auto',
    //        padding: '2rem',
   //         }}
     //       ></main>