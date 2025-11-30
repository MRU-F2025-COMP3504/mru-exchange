import { useLocation } from 'react-router-dom';
import { ProductListing } from '../features/listing/api';
import { ok, err } from '../shared/utils';
import { supabase } from '@shared/api';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@shared/contexts';
import type { ProductImage, Result } from '@shared/types';
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
  const form = state?.form;
  const avgRating = 4;
  const totalReviews = 1;
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const navigate = useNavigate();

  const imageUrls =
    images?.map((file: Blob | MediaSource) => URL.createObjectURL(file)) || [];
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
    return files.map((file) => {
      const uuid = crypto.randomUUID();
      const ext = file.name.slice(file.name.lastIndexOf('.'));

      return {
        path: `${uuid}${ext}`,
        body: file,
      };
    });
  }

  async function handleProductPosting() {
    if (!product) {
      alert('No product data found!');
    }

    try {
      const builder = ProductListing.create();

      let result: Result<unknown> = builder.title(form);
      if (!result.ok) throw result.error;

      result = builder.description(form);
      if (!result.ok) throw result.error;
      result = builder.images(form);

      if (!result.ok) throw result.error;

      result = builder.price(form);
      if (!result.ok) throw result.error;

      result = builder.stock(form);
      if (!result.ok) throw result.error;

      const insert = await builder.submit();
      if (!insert.ok) throw insert.error;

      const insertedProduct = insert.data;

      const { error: updateError } = await supabase
        .from('Product_Information')
        .update({ isListed: true })
        .eq('id', insertedProduct.id);

      if (updateError) {
        console.error(updateError);
        alert('Product posted, but failed to update listing status');
        return;
      }

      alert('Product successfully inserted');

      navigate(`/product/${insertedProduct.id}`);
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
    <div className="bg-white min-h-screen">
      <main className="flex justify-center p-12">
        <div className="relative w-full max-w-6xl">
          <div className="absolute -top-5 left-6 text-red-500 text-2xl font-bold">
            Preview
          </div>

          {/* Outer Box */}
          <div className="bg-white rounded-2xl p-8 w-full max-w-6xl shadow-lg border border-gray-300">
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
                        <span className='text-gray-500'>
                          No Image Available
                        </span>
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

          <div className="flex mt-8 justify-center gap-2">
            <button
              onClick={() => {
                navigate('/post-product', { state: { product, images } });
              }}
              className="px-8 py-3 rounded-lg bg-[#007fb5] text-white text-base cursor-pointer hover:bg-[#006699] transition-colors"
            >
              ← Continue Editing
            </button>
            <button
              onClick={handleProductPosting}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg text-base font-medium cursor-pointer hover:bg-blue-700 transition-colors"
            >
              Post Product
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
