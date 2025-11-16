import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import type { LinkData } from '../shared/components/LinkDelimitedList';
import LinkDelimitedList from '../shared/components/LinkDelimitedList';
import { supabase } from '@shared/api';
import { useAuth } from '@shared/contexts';

interface Product {
  id: number;
  title: string | null;
  description: string | null;
  price: number | null;
  image: any | null;
  stock_count: number | null;
  isListed: boolean | null;
  isDeleted: boolean | null;
  user_id: string | null;
  created_at: string | null;
}

interface SellerInfo {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  user_name: string | null;
  supabase_id: string;
}

interface Review {
  id: number;
  rating: number;
  description: string | null;
  created_by_id: string;
  created_at: string;
  reviewer_name: string;
}

export default function ProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [seller, setSeller] = useState<SellerInfo | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarking, setBookmarking] = useState(false);
  const [bookmarkSuccess, setBookmarkSuccess] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const mainImgRef = useRef<HTMLImageElement>(null);

  const currentUserId = user.ok ? user.data.id : null;

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
      fetchProductReviews();
    }
  }, [productId]);

  useEffect(() => {
    if (currentUserId && productId && product) {
      checkIfBookmarked();
    }
  }, [currentUserId, productId, product]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: productData, error: productError } = await supabase
        .from('Product_Information')
        .select('*')
        .eq('id', Number(productId))
        .eq('"isListed"', true)
        .eq('"isDeleted"', false)
        .single();

      if (productError) throw productError;
      if (!productData) throw new Error('Product not found');

      setProduct(productData);

      const { data: sellerData, error: sellerError } = await supabase
        .from('User_Information')
        .select('id, first_name, last_name, email, user_name, supabase_id')
        .eq('supabase_id', productData.user_id)
        .single();

      if (sellerError) throw sellerError;
      setSeller(sellerData);
    } catch (err: any) {
      console.error('Error fetching product details:', err);
      setError(err?.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductReviews = async () => {
    try {
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('Reviews')
        .select(
          `
                    id,
                    rating,
                    description,
                    created_by_id,
                    created_at,
                    User_Information!Reviews_created_by_id_fkey (
                        first_name,
                        last_name
                    )
                `,
        )
        .eq('product_id', Number(productId))
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;

      const transformedReviews =
        reviewsData?.map((review: any) => ({
          id: review.id,
          rating: review.rating,
          description: review.description,
          created_by_id: review.created_by_id,
          created_at: review.created_at,
          reviewer_name:
            `${review.User_Information?.first_name || ''} ${review.User_Information?.last_name || ''}`.trim() ||
            'Anonymous',
        })) || [];

      setReviews(transformedReviews);
    } catch (err: any) {
      console.error('Error fetching reviews:', err);
    }
  };

  const checkIfBookmarked = async () => {
    if (!currentUserId || !productId || !product) return;

    try {
      const { data: cartData, error: cartError } = await supabase
        .from('Shopping_Cart')
        .select('id')
        .eq('user_id', currentUserId as string)
        .maybeSingle();

      if (cartError || !cartData) return;

      const { data: bookmarkData, error: bookmarkError } = await supabase
        .from('Shopping_Cart_Products')
        .select('*')
        .eq('shopping_cart_id', cartData.id)
        .eq('product_id', product.id)
        .maybeSingle();

      if (!bookmarkError && bookmarkData) {
        setIsBookmarked(true);
      }
    } catch (err: any) {
      console.error('Error checking bookmark status:', err);
    }
  };

  const handleToggleBookmark = async () => {
    if (!currentUserId) {
      setError('You must be logged in to bookmark products');
      return;
    }

    if (!product) {
      setError('Product information not available');
      return;
    }

    try {
      setBookmarking(true);
      setError(null);

      let { data: cartData, error: cartError } = await supabase
        .from('Shopping_Cart')
        .select('id')
        .eq('user_id', currentUserId as string)
        .maybeSingle();

      if (cartError && cartError.code !== 'PGRST116') {
        throw cartError;
      }

      let cartId: number;
      if (!cartData) {
        const { data: newCart, error: createCartError } = await supabase
          .from('Shopping_Cart')
          .insert({ user_id: currentUserId as string })
          .select('id')
          .single();

        if (createCartError) throw createCartError;
        if (!newCart) throw new Error('Failed to create shopping cart');

        cartId = newCart.id;
      } else {
        cartId = cartData.id;
      }

      if (isBookmarked) {
        const { error: deleteError } = await supabase
          .from('Shopping_Cart_Products')
          .delete()
          .eq('shopping_cart_id', cartId)
          .eq('product_id', product.id);

        if (deleteError) throw deleteError;

        setIsBookmarked(false);
        setBookmarkSuccess(false);
      } else {
        const { error: insertError } = await supabase
          .from('Shopping_Cart_Products')
          .insert({
            shopping_cart_id: cartId,
            product_id: product.id,
          });

        if (insertError) throw insertError;

        setIsBookmarked(true);
        setBookmarkSuccess(true);
        setTimeout(() => setBookmarkSuccess(false), 3000);
      }
    } catch (err: any) {
      console.error('Error toggling bookmark:', err);
      setError(err?.message || 'Failed to update bookmark');
    } finally {
      setBookmarking(false);
    }
  };

  const handleMessageSeller = async () => {
    if (!currentUserId || !product || !seller) {
      setError('You must be logged in to message sellers');
      return;
    }

    try {
      const { data: existingChat, error: chatCheckError } = await supabase
        .from('Chats')
        .select('id')
        .or(
          `and(user_id_1.eq.${currentUserId},user_id_2.eq.${seller.supabase_id}),and(user_id_1.eq.${seller.supabase_id},user_id_2.eq.${currentUserId})`,
        )
        .maybeSingle();

      if (chatCheckError && chatCheckError.code !== 'PGRST116') {
        throw chatCheckError;
      }

      let chatId;

      if (existingChat) {
        chatId = existingChat.id;
      } else {
        const { data: newChat, error: chatCreateError } = await supabase
          .from('Chats')
          .insert({
            user_id_1: currentUserId as string,
            user_id_2: seller.supabase_id,
            visible: true,
          })
          .select('id')
          .single();

        if (chatCreateError) throw chatCreateError;
        chatId = newChat.id;

        const { error: messageError } = await supabase.from('Messages').insert({
          chat_id: chatId,
          sender_id: currentUserId as string,
          logged_message: `Hi! I'm interested in your product: ${product.title}`,
          visible: true,
        });

        if (messageError) throw messageError;
      }

      navigate(`/messaging?chatId=${chatId}`);
    } catch (err: any) {
      console.error('Error initiating chat:', err);
      setError(err?.message || 'Failed to start conversation');
    }
  };

  function getImageUrls(imageData: { [key: string]: string }): string[] | null {

        try {

            // Create an array.
            const imagesArray = [];

            // For every image,
            for (const key in imageData) {

                // Get the imagePath.
                const imagePath: string = imageData[key];

                if (!imagePath) return null;

                if (imagePath.startsWith('http')) {
                    imagesArray.push(imagePath);
                }


                const filename = imagePath.replace('database/images/', '').split('/').pop();

                if (!filename) return null;

                const { data } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(filename);

                imagesArray.push(data.publicUrl);

            }

            // Return
            return imagesArray;


        } catch (error) {
            console.error('Error getting image URL:', error);
            return null;
        }
    };

    /**
     * Fetches all images for a product from the database.
     * @param imageData An object passed from the database containing image info.
     *  image: string[] The arry containing image paths.
     * @returns 
     */
    // function getImageUrls(imageData: { image: string[] }): string[] | null {

    //     try {

    //         // Create an array.
    //         const imagesArray = [];

    //         // For every image,
    //         for (const imagePath of imageData.image) {

    //             if (!imagePath) return null;

    //             if (imagePath.startsWith('http')) {
    //                 imagesArray.push(imagePath);
    //             }


    //             const filename = imagePath.replace('database/images/', '').split('/').pop();

    //             if (!filename) return null;

    //             const { data } = supabase.storage
    //                 .from('product-images')
    //                 .getPublicUrl(filename);

    //             imagesArray.push(data.publicUrl);

    //         }

    //         // Return
    //         return imagesArray;


    //     } catch (error) {
    //         console.error('Error getting image URL:', error);
    //         return null;
    //     }
    // };

  const calculateAverageRating = (): number => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round(sum / reviews.length);
  };

  const displayStars = (rating: number): string => {
    const fullStar: string = '★';
    const emptyStar: string = '☆';
    let result: string = '';

    for (let i = 1; i <= 5; i++) {
      result += i <= rating ? fullStar : emptyStar;
    }

    return result;
  };

  if (loading) {
    return (
      <div className='bg-[#F9FAFB] min-h-screen'>
        <Header />
        <main className='flex items-center justify-center min-h-[60vh]'>
          <p className='text-xl text-gray-600'>Loading product...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className='bg-[#F9FAFB] min-h-screen'>
        <Header />
        <main className='flex flex-col items-center justify-center min-h-[60vh]'>
          <p className='text-xl text-red-600 mb-4'>
            {error || 'Product not found'}
          </p>
          <button
            onClick={() => navigate('/product-search')}
            className='px-6 py-2 bg-[#007FB5] text-white rounded-lg hover:bg-[#006B9E]'
          >
            Back to Search
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const avgRating = calculateAverageRating();
  const imageUrls: string[] | null = getImageUrls(product.image);
  const isOwnProduct =
    currentUserId && seller && currentUserId === product.user_id;
  const isOutOfStock = !product.stock_count || product.stock_count <= 0;

  const linkData: Array<LinkData> = [
    {
      name: 'Product Search',
      path: '/product-search',
      className: 'hover:text-[#0F76D7]',
    },
    {
      name: product.title || 'Product',
      path: '#',
      className: 'hover:text-[#0F76D7]',
    },
  ];

  return (
    <div className='bg-[#F9FAFB] min-h-screen'>
      <Header />

      <main>
        <section id='details' className='p-8 bg-[#A7E2FC] text-[#003A5F]'>
          <section className='mb-4'>
            <LinkDelimitedList items={linkData} separator=' &gt; ' />
          </section>

          <section className='p-5 flex flex-col lg:flex-row gap-8'>
            <div className='lg:hidden'>
              <h1 className='text-3xl py-2 font-bold'>{product.title}</h1>
              {seller && (
                <p className='text-xl'>
                  Seller: {seller.first_name} {seller.last_name}
                </p>
              )}
            </div>

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
                        {/* <div className="my-2 mr-1">
                                        <img
                                            id={"img" + i}
                                            src={imageUrls[i]}
                                            alt={product.title || 'Product'}
                                            className="w-[50px] h-[50px] object-cover rounded-lg cursor-pointer"
                                            onClick={(e) => {

                                                // Get elements.
                                                const thisImg: HTMLImageElement = e.target as HTMLImageElement;

                                                // If it exists,
                                                if(mainImgRef.current){

                                                    // Update its link.
                                                    mainImgRef.current.src = "google.com";

                                                }

                                            }}
                                            onError={(e) => {
                                                const target = e.currentTarget as HTMLImageElement;
                                                target.style.display = 'none';
                                                if (target.parentElement) {
                                                    target.parentElement.innerHTML = '<div class="w-full h-[300px] flex items-center justify-center bg-gray-200"><span class="text-gray-500">Image unavailable</span></div>';
                                                }
                                            
                                            }}
                                        />
                                    </div> */}
                      </>
                    ))
                  : null}
              </div>
            </div>

            <div className='lg:w-2/3'>
              <div className='hidden lg:block'>
                <h1 className='text-3xl py-2 font-bold'>{product.title}</h1>
                {seller && (
                  <p className='text-xl pb-4'>
                    Seller: {seller.first_name} {seller.last_name}
                  </p>
                )}
              </div>

              {product.price !== null && (
                <p className='text-4xl font-bold text-[#007FB5] mb-4'>
                  ${product.price.toFixed(2)}
                </p>
              )}

              <p
                className={`text-lg mb-4 font-semibold ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}
              >
                {isOutOfStock
                  ? 'Out of Stock'
                  : `${product.stock_count} in stock`}
              </p>

              <div className='mb-6'>
                <h3 className='text-xl font-semibold mb-2'>Description</h3>
                <p className='whitespace-pre-line'>
                  {product.description || 'No description available'}
                </p>
              </div>

              {!isOwnProduct && (
                <div className='flex flex-col sm:flex-row gap-4'>
                  <button
                    onClick={handleToggleBookmark}
                    disabled={bookmarking}
                    className={`px-6 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                      bookmarking
                        ? 'bg-gray-400 cursor-not-allowed'
                        : isBookmarked
                          ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                          : 'bg-[#007FB5] hover:bg-[#006B9E] text-white'
                    }`}
                  >
                    <span className='text-xl'>{isBookmarked ? '★' : '☆'}</span>
                    {bookmarking
                      ? 'Updating...'
                      : isBookmarked
                        ? 'Bookmarked'
                        : 'Bookmark'}
                  </button>

                  <button
                    onClick={handleMessageSeller}
                    className='px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors'
                  >
                    Message Seller
                  </button>
                </div>
              )}

              {isOwnProduct && (
                <div className='bg-blue-100 border border-blue-300 text-blue-800 px-4 py-3 rounded-lg'>
                  <p className='font-semibold'>This is your product listing</p>
                </div>
              )}

              {bookmarkSuccess && (
                <div className='mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg'>
                  <p className='font-semibold'>
                    Product bookmarked successfully!
                  </p>
                </div>
              )}

              {error && (
                <div className='mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg'>
                  <p className='font-semibold'>{error}</p>
                </div>
              )}
            </div>
          </section>
        </section>

        {/* You might also like...
                <section className="p-10">
                    <h2>You might also like...</h2>
                    <div>
                        
                    </div>
                </section> */}

        {/* Reviews */}
        <section className='p-10'>
          <h2 className='text-2xl font-bold mb-4'>Reviews</h2>
          <p className='text-2xl mb-6'>
            <span className='text-3xl'>{displayStars(avgRating)}</span> (
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
          </p>

          {reviews.length === 0 ? (
            <p className='text-gray-600'>
              No reviews yet. Be the first to review this product!
            </p>
          ) : (
            <div className='space-y-4'>
              {reviews.map((review) => (
                <div key={review.id} className='bg-white p-4 rounded-lg shadow'>
                  <div className='flex items-center justify-between mb-2'>
                    <p className='font-semibold'>{review.reviewer_name}</p>
                    <p className='text-yellow-500'>
                      {displayStars(review.rating)}
                    </p>
                  </div>
                  {review.description && (
                    <p className='text-gray-700'>{review.description}</p>
                  )}
                  <p className='text-sm text-gray-500 mt-2'>
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
