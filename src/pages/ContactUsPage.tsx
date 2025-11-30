import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function ContactUsPage() {

  const [submitted, setSubmitted] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#f9fafb"
      }}
    >
      <Header/>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "4rem",
            paddingBottom: "4rem"
          }}
        >
          <main
            style={{
              width: '30rem',
              background: 'white',
              padding: '1rem',
              borderRadius: '8px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
              height: 'fit-content',
            }}
          >
            <h3
              style={{
                marginBottom: '1rem',
                fontSize: '1.25rem',
                fontWeight: 600,
              }}
            >
              {' '}
              Contact Us
            </h3>
            {submitted ? (
              <p
                style={{
                  padding: "0.75rem",
                  fontSize: "1.1rem",
                  fontWeight: "600"
                }}
                >
                  Thank you for your inqury. 
                  We will contact you in 3 to 5 business days!
                </p>
            ) : (
              <>
            
            
            <label
              style={{
                display: 'block',
                marginBottom: '0.25rem',
                padding: '0.5rem',
              }}
            >
          <div 
            style={{
              padding: '0.25rem',
            }}>Inquriy 
          </div>
          <textarea
            placeholder='Enter your Inquiry here: '
            rows={7}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '0.375rem',
              border: '1px solid #ccc',
              fontSize: '1rem',
              backgroundColor: 'white',
              cursor: 'pointer',
            }}
          />
          </label>
          <div 
            style={{
              padding: '1rem',
            }}>
          </div>
          <button
            onClick={() => setSubmitted(true)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#0F76D7',
              color: 'white',
              borderRadius: '0.375rem',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Submit
          </button>
          </>
        )}
        </main>
      </div>
      <Footer/>
    </div>
  )
};
