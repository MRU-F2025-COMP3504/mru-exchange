import Header from './Header';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';
import { ProductListing } from '../features/listing/api';
import { ok, err } from '../shared/utils';
import { supabase } from '@shared/api';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@shared/contexts';
import type { ProductImage } from '@shared/types';
import { useNavigate } from 'react-router-dom';

interface SellerInfo {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  user_name: string | null;
  supabase_id: string;
}



export default function PreviewPostPage() {
  const { user } = useAuth();
  const { state } = useLocation();
  const product = state?.product;
  const images = state?.images;
  const seller = state?.seller;
  const categories = state?.categories;
  const avgRating = 4;
  const totalReviews = 1;
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const navigate = useNavigate();

  const imageUrls = images?.map((file: Blob | MediaSource) => URL.createObjectURL(file)) || [];
  const mainImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    fetchUserName();
  }, [user]);

  function displayStars(avgRating: number): string {
    // Initialize
    const fullStar = '★';
    const emptyStar = '☆';
    let result = '';

    // Build
    for (let i = 1; i <= 5; i++) {
      result += i <= avgRating ? fullStar : emptyStar;
    }

    // Return
    return result;
  }

  function convertToProductImages(files: File[]): ProductImage[] {
  return files.map((file) => ({
    path: `${file.name}`, // unique + original file name
    body: file                                         // File is already a Blob
  }));
}


  async function handleProductPosting() {
    if (!product) {
      alert('No product data found!');
    }

    try {
      const builder = ProductListing.register()

      let result = builder.title(product.title);
      if (!result.ok) throw result.error;

      result = result.data.description(product.description);
      if (!result.ok) throw result.error;

      result = result.data.image(convertToProductImages(images || []))
      console.log(result);
      if (result.ok === false) throw result.error;

      result = result.data.price(product.price);
      if (!result.ok) throw result.error;

      result = result.data.stock(product.stock_count);
      if (!result.ok) throw result.error;

      result = result.data.seller(seller)
      if (!result.ok) throw result.error;
  
      const insert = await result.data.build();
      if (insert.ok === false) throw insert.error;

      const insertedProduct = insert.data;

      const { error: updateError } = await supabase
        .from("Product_Information")
        .update({ isListed: true })
        .eq("id", insertedProduct.id );

      if (updateError) {
        console.error(updateError);
        alert("Product posted, but failed to update listing status");
        return;
      }

      alert('Product successfully inserted');
      console.log('inserted:', insert);
    } catch (e) {
      alert('Error: failed to register product');
      throw e;
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
        setLastName(data.last_name || '');
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

                {/* Image Box & Selector */}
                <div className='lg:w-1/3'>
                  <div className='bg-white rounded-2xl shadow-xl overflow-hidden'>
                    {imageUrls ? (
                      <img
                        ref={mainImgRef}
                        src={imageUrls[0]}
                        alt={product.title || 'Product'}
                        className='w-full h-[300px] object-cover'
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.style.display = 'none';
                          if (target.parentElement) {
                            target.parentElement.innerHTML =
                              '<div class="w-full h-[300px] flex items-center justify-center bg-gray-200"><span class="text-gray-500">Image unavailable</span></div>';
                          }
                        }}
                      />
                    ) : (
                      <div className='w-full h-[300px] flex items-center justify-center bg-gray-200'>
                        <span className='text-gray-500'>No Image Available</span>
                      </div>
                  )}
                </div>
              <div className='flex'>
                {imageUrls
                  ? imageUrls.map((value: string, i: number) => (
                    <>
                      <div className='my-2 mr-1'>
                        <img
                          id={'img' + i}
                          src={imageUrls[i]}
                          alt={product.title || 'Product'}
                          className='w-[50px] h-[50px] object-cover rounded-lg cursor-pointer'
                          onClick={(e) => {
                            // Get elements.
                            const thisImg: HTMLImageElement =
                              e.target as HTMLImageElement;

                            // If it exists,
                            if (mainImgRef.current) {
                              // Update its link.
                              mainImgRef.current.src = thisImg.src;
                            }
                          }}
                          onError={(e) => {
                            const target =
                              e.currentTarget as HTMLImageElement;
                            target.style.display = 'none';
                            if (target.parentElement) {
                              target.parentElement.innerHTML =
                                '<div class="w-full h-[300px] flex items-center justify-center bg-gray-200"><span class="text-gray-500">Image unavailable</span></div>';
                            }
                          }}
                        />
                      </div>
                    </>
                  ))
                  : null}
                </div>
              </div>
                <div className='lg:w-2/3'>
                  <div className='flex flex-col gap-2'>
                    <h1 className='text-3x1 font-bold'>{product.title}</h1>
                    <p className='text-xl'>
                      Seller: {firstName} {lastName}
                    </p>
                  </div>

                  {product.price !== null && (
                    <p className='text-4xl font-bold text-[#007FB5] mb-4'>
                      ${product.price}
                    </p>
                  )}

                  <p className='text-lg mb-4 font-semibold text-green-600'>
                    {product.stock_count} in stock
                  </p>

                  <div className='mb-6'>
                    <h3 className='text-xl font-semibold mb-2'>Description</h3>
                    <p className='whitespace-pre-line'>
                      {product.description || 'No description available'}
                    </p>
                  </div>
                  <div className='flex flex-col sm:flex-row gap-4'>
                    <button className='px-6 py-2 bg-[#007FB5] rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-white'>
                      Bookmark
                    </button>
                    <button className='px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors'>
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
          <div style={{ 
            display: "flex",
            marginTop: '2rem',
            justifyContent: "center",
            gap: "0.5rem"
          }}>
            <button 
              onClick={() => navigate(-1)}
              style={{
                padding: '0.75rem 2rem',
                background: "none",
                border: "none",
                borderRadius: '0.5rem',
                backgroundColor: "#007fb5",
                color: "white",
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              ← Continue Editing
            </button>
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
