import Header from './Header';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';
import { register } from '../features/listing/api/product';
import { ok, err } from '../shared/utils';
import { supabase } from '@shared/api';
import { useEffect, useState } from 'react';
import { useAuth } from '@shared/contexts';


interface SellerInfo {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  user_name: string | null;
  supabase_id: string;
}

// System Variables
type Product = {
  title: string;
  category: string;
  description: string;
  price: number;
  imageUrl: string;
};

export default function PreviewPostPage() {
  const { user } = useAuth();
  const { state } = useLocation();
  const product = state?.product;
  const avgRating: number = 3;
  const totalReviews: number = 1;
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');

  useEffect(() => {
    fetchUserName();
  }, [user]);

  function displayStars(avgRating: number): string {
    // Initialize
    const fullStar: string = '★';
    const emptyStar: string = '☆';
    let result: string = '';

    // Build
    for (let i = 1; i <= 5; i++) {
      result += i <= avgRating ? fullStar : emptyStar;
    }

    // Return
    return result;
  }

  async function handleProductPosting() {
    if (!product) {
      alert('No product data found!');
    }

    try {
      const builder = register()

      let result = builder.title(product.title);
      if (result.ok === false) throw result.error;

      result = result.data.description(product.description)
      if (result.ok === false) throw result.error;

      result = result.data.image(URL.createObjectURL(product.image[0]))
      if (result.ok === false) throw result.error;

      result = result.data.price(product.price)
      if (result.ok === false) throw result.error;

      result = result.data.stock(product.stock_count)
      if (result.ok === false) throw result.error;

      console.log(product.image);
      const insert = await result.data.build();

      alert('Product successfully inserted');
      console.log('inserted:', insert);
    } catch (e) {
      console.error(e);
      alert('failed to register product');
    }
  }
  
  const fetchUserName = async () => {
    if (!user.ok) return;

    try {
      const { data, error } = await supabase
        .from('User_Information')
        .select('first_name, last_name')
        .eq('supabase_id', user.data.id)
        .single();

      if (!error && data) {
        setFirstName(data.first_name || '');
        setLastName(data.last_name || "");
      }
    } catch (error) {
      console.error('Error fetching user name:', error);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'white',
        minHeight: '100vh',
      }}
    >
      <main
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '3rem',
        }}
      >
        <div
          style={{ position: 'relative', width: '100%', maxWidth: '1200px' }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-1.2rem',
              left: '1.5rem',
              color: 'red',
              fontSize: '1.5rem',
              fontWeight: 'bold',
            }}
          >
            Preview
          </div>

          {/* Outer Box */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              width: '100%',
              maxWidth: '1200px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              border: '1px solid #D1D5DB',
            }}
          >

            {/* Product Details */}
            <section id='details' className='p-8 bg-[#A7E2FC] text-[#003A5F]'>
              {/* Product Information */}
              <section className='p-5 flex flex-col sm:flex-row gap-5'>
                <div className='w-full lg:w-1/3 flex justify-center lg:justify-start'>
                  <div className='inline-block rounded-2x1 shadow-x1 overflow-hidden'>
                    {product.image && product.image.length > 0 ? (
                      
                        <img
                          src={URL.createObjectURL(product.image[0])}
                          alt={product.title}
                          className='w-[300px] h-[200px] object-cover rounded-2xl shadow-xl'
                        />
                      
                    ) : (
                      <div
                        style={{
                          width: '250px',
                          height: '250px',
                          backgroundColor: 'white',
                          borderRadius: '0.5rem',
                          fontSize: '1rem',
                          fontWeight: '500',
                          cursor: 'pointer',
                        }}
                      >
                        No Image Selected
                      </div>
                    )}
                  </div>
                </div>

                <div className='lg:w-2/3'>
                  <div className='flex flex-col gap-2'>
                    <h1 className="text-3x1 font-bold">{product.title}</h1>
                      <p className='text-xl'>
                        Seller: {firstName} {lastName}
                      </p>
                  </div>
              

                  {product.price !== null && (
                    <p className='text-4xl font-bold text-[#007FB5] mb-4'>
                      ${product.price}
                    </p>
                  )}

                  <p className='text-lg mb-4 font-semibold text-green-600'
                  >
                    {product.stock_count} in stock
                  </p>

                  <div className='mb-6'>
                    <h3 className='text-xl font-semibold mb-2'>Description</h3>
                    <p className='whitespace-pre-line'>
                      {product.description || 'No description available'}
                    </p>
                  </div>
                <div className='flex flex-col sm:flex-row gap-4'>
                  <button
                    className='px-6 py-2 bg-[#007FB5] rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-white'
                  >
                    Bookmark
                  </button>
                  <button
                    
                    className='px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors'
                  >
                    Message Seller
                  </button>
                  </div>
                </div>
              </section>
            </section> 

            {/* Reviews */}
            <section className='p-10'>
              <h2 className='text-2xl'>Reviews</h2>
              <p className='text-2xl'>
                <span className='text-3xl'>{displayStars(avgRating)}</span> (
                {totalReviews})
              </p>
            </section>

            
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button
                onClick={handleProductPosting}
                style={{
                  padding: '0.75rem 2rem',
                  backgroundColor: '#0F76D7',
                  color: 'white',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                Post Product
              </button>
            </div>
        </div>
      </main>
    </div>
  );
}
