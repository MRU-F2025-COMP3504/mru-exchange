import { useState, useEffect, useRef, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import type { LinkData } from '../shared/components/LinkDelimitedList';
import LinkDelimitedList from '../shared/components/LinkDelimitedList';
import { supabase, UserAuthentication } from '@shared/api';
import { useAuth } from '@shared/contexts';
import { type UserProfile, type Result, type DatabaseQueryResult } from '@shared/types';
import { UserReviewing } from '@features/review';
import { type ReviewPublisher } from '@features/review';

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
  const [rating, setRating] = useState(0);

  const mainImgRef = useRef<HTMLImageElement>(null);
  const reviewBtn = useRef<HTMLButtonElement>(null);
  const reviewPopup = useRef<HTMLDivElement>(null);
  const reviewContent = useRef<HTMLDivElement>(null);
  const reviewStars: React.RefObject<HTMLSpanElement> = useRef<HTMLSpanElement>(null);

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
        .eq('user_id', currentUserId)
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

      const { data: cartData, error: cartError } = await supabase
        .from('Shopping_Cart')
        .select('id')
        .eq('user_id', currentUserId)
        .maybeSingle();

      if (cartError && cartError.code !== 'PGRST116') {
        throw cartError;
      }

      let cartId: number;
      if (!cartData) {
        const { data: newCart, error: createCartError } = await supabase
          .from('Shopping_Cart')
          .insert({ user_id: currentUserId })
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
        setTimeout(() => {
          setBookmarkSuccess(false);
        }, 3000);
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
            user_id_1: currentUserId,
            user_id_2: seller.supabase_id,
            visible: true,
          })
          .select('id')
          .single();

        if (chatCreateError) throw chatCreateError;
        chatId = newChat.id;

        const { error: messageError } = await supabase.from('Messages').insert({
          chat_id: chatId,
          sender_id: currentUserId,
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

  interface ImageURLs {
    images: string[];
  }

  // function getImageUrls(imageData: ImageURLs): string[] | null {
  //   try {
  //     // Create an array.
  //     const imagesArray = [];

  //     // For every image,
  //     for (const path of imageData.images) {
  //       // Get the imagePath.

  //       if (!path) return null;

  //       if (path.startsWith('http')) {
  //         imagesArray.push(path);
  //       }

  //       const filename = path.replace('database/images/', '').split('/').pop();

  //       if (!filename) return null;

  //       const { data } = supabase.storage
  //         .from('product-images')
  //         .getPublicUrl(filename);

  //       imagesArray.push(data.publicUrl);
  //     }

  //     // Return
  //     return imagesArray;
  //   } catch (error) {
  //     console.error('Error getting image URL:', error);
  //     return null;
  //   }
  // }

  /**
   * Fetches all images for a product from the database. <Note> If this works, this function is actually unnecessary.
   * @param imageData An object passed from the database containing image info.
   *  image: string[] The array containing image paths.
   * @returns An array of the image urls.
   */
  function getImageUrls(imageData: { images: string[] }): string[] | null {

    try {

      // Create an array.
      const imagesArray = [];

      // For every image,
      for (const imagePath of imageData.images) {

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

  const calculateAverageRating = (): number => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round(sum / reviews.length);
  };

  const displayStars = (rating: number): string => {
    const fullStar = '★';
    const emptyStar = '☆';
    let result = '';

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
            onClick={() => {
              navigate('/product-search');
            }}
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

  const linkData: LinkData[] = [
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

  function showReviewInput(): void {
    reviewPopup.current?.classList.remove("hidden");
    reviewPopup.current?.classList.add("flex");
  }

  function hideReviewInput(): void {
    reviewPopup.current?.classList.add("hidden");
    reviewPopup.current?.classList.remove("flex");
  }

  function resetReviewInput(): void {

  }

  // Also hide review input if Esc is pressed.
  document.addEventListener("keyup", e => {
    if (e.key === "Escape") {
      if (reviewPopup.current) {
        hideReviewInput();
      }
    }
  })

  /**
   * Displays the rating on the review input form.
   * @param e The event form
   */
  function displayRating(container: React.RefObject<HTMLSpanElement>, rating: number): void {

    // Fetch data
    const stars: string = displayStars(rating);

    // Update the value.
    setRating(rating);
    // console.log(rating);

    // For every star,
    for (let i = 0; i < container.current.children.length; i++) {

      // Update the stars.
      container.current.children[i].textContent = stars[i];

    }

  }

  /**
   * Submits the review to the database.
   * @param event The submit event.
   */
  async function submitReview(event: FormEvent<HTMLFormElement>): void {

    // Stop the submission.
    event.preventDefault();

    // Get values.
    const form: FormData = new FormData(event.currentTarget);
    const title: string = form.get("title") as string;
    const desc: string = form.get("description") as string;
    const rate: number = rating;

    // console.log(user);
    // console.log(title);
    // console.log(desc);
    // console.log(rate);

    // If success,
    if (user.ok) {

      // Get the profile.
      const profile: Result<UserProfile> = await UserAuthentication.getUserProfile(user.data);

      // console.log(typeof profile);
      // console.log(profile);

      // If success,
      if (profile.ok) {

        // console.log(profile.data);

        // Create review publisher
        const rpublisher: ReviewPublisher = UserReviewing.create(profile.data);
        rpublisher.description(form);
        rpublisher.rating(form);

        // console.log(rpublisher);

        // Publish
        const publish: DatabaseQueryResult<Review, "id"> = await rpublisher.submit();

        // If success,
        if(publish.ok){
          console.log("Published!");
          hideReviewInput();
          resetReviewInput();
        }
        else{
          console.error("Error: Failed to publish.");
        }

      }
      else {
        console.error("Error: Could not get profile.");
      }

    }
    else {
      console.error("Error: Could not get user.");
    }


  }

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
                    className={`px-6 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${bookmarking
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
          <h2 className='text-2xl font-bold'>Reviews</h2>
          <p className='text-2xl my-2'>
            <span className='text-3xl'>{displayStars(avgRating)}</span> (
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
          </p>

          <button
            ref={reviewBtn}
            className="hover:cursor-pointer bg-yellow-300 border-yellow-500 border p-3 rounded mb-4 text-[#0B2545] font-semibold transition-colors hover:bg-yellow-400"
            onClick={showReviewInput}
          >Write a review</button>

          <div
            ref={reviewPopup}
            className="hidden items-center justify-center fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.6)]"
            onClick={hideReviewInput}
          >
            <div
              ref={reviewContent}
              className="bg-white h-[75%] w-[75%] rounded-2xl p-8"
              onClick={e => { e.stopPropagation() }}
            >
              <div className="flex justify-between">
                <h3 className="text-3xl font-bold mb-2">Write a Review</h3>
                <button
                  id="reviewExitBtn"
                  className="bg-gray-200 w-10 h-10 rounded-full flex items-center cursor-pointer"
                  onClick={hideReviewInput}
                >
                  <p className="text-center w-full font-bold text-gray-700">✕</p>
                </button>
              </div>
              <form
                onSubmit={submitReview}
              >
                <label>
                  <p className="text-xl my-2">Title:</p>
                  <input name="title" type="text" className="bg-gray-100 border-2 rounded border-gray-300 p-2 w-[50%] min-w-60"></input>
                </label>
                <label>
                  <p className="text-xl my-2">Rate: &nbsp;
                    <span 
                      ref={reviewStars}
                      id="reviewRating" 
                      className="text-2xl my-2 text-yellow-400">
                      <span onClick={() => {displayRating(reviewStars, 1)}}>☆</span>
                      <span onClick={() => {displayRating(reviewStars, 2)}}>☆</span>
                      <span onClick={() => {displayRating(reviewStars, 3)}}>☆</span>
                      <span onClick={() => {displayRating(reviewStars, 4)}}>☆</span>
                      <span onClick={() => {displayRating(reviewStars, 5)}}>☆</span>
                    </span>
                  </p>
                </label>
                <label>
                  <p className="text-xl my-2">Description:</p>
                  <textarea name="description" className="bg-gray-100 border-2 rounded border-gray-300 p-2 w-full h-40 resize-none"></textarea>
                </label>
                <div className="py-5">
                  <button
                    type="submit"
                    className="bg-yellow-300 border-yellow-500 p-2 mr-5 hover:bg-yellow-400 border rounded w-25">Submit</button>
                  <button type="reset" className="bg-yellow-300 border-yellow-500 p-2 mr-5 hover:bg-yellow-400 border rounded w-25">Clear</button>
                </div>
              </form>
            </div>
          </div>

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
