/* eslint-disable */
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { supabase } from '@shared/api';
import { useAuth } from '@shared/contexts';
import { UserReviewing } from '@features/review/api.ts';
import type { UserProfile } from '@shared/types';

interface SellerInfo {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string;
  user_name: string | null;
  supabase_id: string;
  profile_image: any | null;
  rating: number | null;
}

interface Product {
  id: number;
  title: string | null;
  description: string | null;
  price: number | null;
  image: any | null;
  stock_count: number | null;
  isListed: boolean | null;
  isDeleted: boolean | null;
  created_at: string | null;
}

interface Review {
  id: number;
  rating: number;
  description: string | null;
  created_by_id: string;
  created_at: string;
  reviewer_name: string;
}

export default function SellerPage() {
  const { sellerId } = useParams<{ sellerId: string }>();
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
  const currentUserId = user.ok ? user.data.id : null;
  const navigate = useNavigate();

  const [sellerInfo, setSellerInfo] = useState<SellerInfo | null>(null);
  const [listedProducts, setListedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const reviewBtn = useRef<HTMLButtonElement>(null);
  const reviewPopup = useRef<HTMLDivElement>(null);
  const reviewContent = useRef<HTMLDivElement>(null);
  const reviewTitle: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);
  const reviewStars: React.RefObject<HTMLSpanElement> =
    useRef<HTMLSpanElement>(null);
  const reviewDescription: React.RefObject<HTMLTextAreaElement> =
    useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (sellerId) {
      fetchSellerProfile();
      fetchSellerListings();
      fetchSellerReviews();
      fetchUserProfile();
    }
  }, [sellerId]);

  const fetchSellerProfile = async () => {
    if (!sellerId) return;

    try {
      const { data, error } = await supabase
        .from('User_Information')
        .select('id, first_name, last_name, email, user_name, supabase_id, profile_image, rating')
        .eq('supabase_id', sellerId)
        .single();

      if (error) throw error;
      setSellerInfo(data);
    } catch (err: any) {
      console.error('Error fetching seller profile:', err);
      setError('Seller not found');
    }
  };

  const fetchSellerListings = async () => {
    if (!sellerId) return;

    try {
      const { data, error } = await supabase
        .from('Product_Information')
        .select('id, title, description, price, image, stock_count, isListed, isDeleted, created_at')
        .eq('user_id', sellerId)
        .eq('"isListed"', true)
        .eq('"isDeleted"', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListedProducts(data || []);
    } catch (err: any) {
      console.error('Error fetching seller listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    if (!currentUserId) return;

    try {
      const { data, error } = await supabase
        .from('User_Information')
        .select('*')
        .eq('supabase_id', currentUserId)
        .single();

      if (error) throw error;
      setUserInfo(data);
    } catch (err: any) {
      console.error('Error fetching user profile:', err);
    }
  };

  const fetchSellerReviews = async () => {
    if (!sellerId) return;
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
        .eq('created_on_id', sellerId)
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;
      console.log(reviewsData)

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

  const getImageUrl = (imageData: any): string | null => {
    if (!imageData) return null;

    try {
      let imagePath: string | null = null;

      if (typeof imageData === 'object' && imageData !== null) {
        if (imageData.images && Array.isArray(imageData.images) && imageData.images.length > 0) {
          imagePath = imageData.images[0];
        } else {
          imagePath = imageData.image || imageData.path || imageData.url || imageData.filename;
        }
      } else if (typeof imageData === 'string') {
        imagePath = imageData;
      }

      if (!imagePath) return null;
      if (imagePath.startsWith('http')) return imagePath;

      const filename = imagePath.replace('database/images/', '').split('/').pop();
      if (!filename) return null;

      const { data } = supabase.storage.from('product-images').getPublicUrl(filename);
      return data.publicUrl;
    } catch (error) {
      console.error('Error getting image URL:', error);
      return null;
    }
  };

  function showReviewInput(): void {
    reviewPopup.current?.classList.remove('hidden');
    reviewPopup.current?.classList.add('flex');
  }

  function hideReviewInput(): void {
    reviewPopup.current?.classList.add('hidden');
    reviewPopup.current?.classList.remove('flex');
  }

  function resetReviewInput(): void {
    // Reset the inputs.
    displayRating(reviewStars, 0);
    if (reviewTitle.current) {
      reviewTitle.current.value = '';
    }

    if (reviewDescription.current) {
      reviewDescription.current.value = '';
    }
  }

  const displayStars = (rating: number): string => {
    const fullStar = '★';
    const emptyStar = '☆';
    let result = '';

    for (let i = 1; i <= 5; i++) {
      result += i <= rating ? fullStar : emptyStar;
    }

    return result;
  };

  function displayRating(
    container: React.RefObject<HTMLSpanElement>,
    rating: number,
  ): void {
    // Fetch data
    const stars: string = displayStars(rating);

    // Update the value.
    setRating(rating);
    // console.log(rating);

    const current = container.current;

    if (current) {
      // For every star,
      for (let i = 0; i < current.children.length; i++) {
        // Update the stars.
        current.children[i].textContent = stars[i];
      }
    }
  }

  // Submit review to database
  async function submitReview(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    const form: FormData = new FormData(event.currentTarget);
    const desc: string = form.get('description') as string;
    const rat: string = form.get('rating') as string;

    const fakeForm = new FormData();
    fakeForm.append('description', desc);
    fakeForm.append('rating', String(rating));

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      setError('Please select a rating between 1 and 5 stars');
      return;
    }
    if (!currentUserId) {
      setError('You must be logged in to write a review');
      return;
    }
    if (!sellerInfo) {
      setError('Seller information not available');
      return;
    }
    if (!userInfo) {
      setError('Error validating user.');
      return;
    }

    try {
      type MinimalUser = { supabase_id: string };

      const seller: MinimalUser = { supabase_id: sellerInfo.supabase_id };

      const create = UserReviewing.create(userInfo, sellerInfo);
      // const de = des.ok ? des.data : null;
      create.description(form)
      create.rating(fakeForm)

      if (create.isSatisfied()) create.submit();

      hideReviewInput();
      resetReviewInput();
      await fetchSellerReviews();
    } catch (err: any) {
      console.error('Error submitting review:', err);
      setError(err?.message || 'Failed to submit review');
    }
  }

  const getProfilePictureUrl = (profileImage: any): string | null => {
    if (!profileImage) return null;
    if (typeof profileImage === 'string') return profileImage;
    if (typeof profileImage === 'object' && profileImage.url) return profileImage.url;
    return null;
  };

  const ProductCard = ({ product }: { product: Product }) => {
    const imageUrl = getImageUrl(product.image);
    const isOutOfStock = !product.stock_count || product.stock_count <= 0;

    return (
      <div
        className='bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer'
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <div className='relative'>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.title || 'Product'}
              className='w-full h-48 object-cover rounded-t-lg'
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.src = '';
                target.style.display = 'none';
              }}
            />
          ) : (
            <div className='w-full h-48 bg-gray-200 flex items-center justify-center rounded-t-lg'>
              <span className='text-gray-500'>No Image</span>
            </div>
          )}
        </div>
        <div className='p-4'>
          <h3 className='font-semibold text-lg mb-2 truncate'>{product.title}</h3>
          {product.price !== null && (
            <p className='font-bold text-xl mb-2 text-[#007FB5]'>
              ${product.price.toFixed(2)}
            </p>
          )}
          <p className='text-gray-600 text-sm line-clamp-2'>{product.description}</p>
          {product.stock_count !== null && (
            <p className={`text-sm mt-2 ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
              {isOutOfStock ? 'Out of stock' : `${product.stock_count} in stock`}
            </p>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className='bg-[#F9FAFB] min-h-screen'>
        <Header />
        <main className='flex items-center justify-center min-h-[60vh]'>
          <p className='text-xl text-gray-600'>Loading seller profile...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !sellerInfo) {
    return (
      <div className='bg-[#F9FAFB] min-h-screen'>
        <Header />
        <main className='flex flex-col items-center justify-center min-h-[60vh]'>
          <p className='text-xl text-red-600 mb-4'>{error || 'Seller not found'}</p>
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

  const profilePictureUrl = getProfilePictureUrl(sellerInfo.profile_image);

  return (
    <div className='bg-[#F9FAFB] grid grid-rows-[auto_1fr_auto] min-h-screen'>
      <Header />

      <main className='max-w-7xl mx-auto px-4 py-8'>
        {/* Seller info */}
        <div className='bg-white rounded-lg shadow p-6 mb-8'>
          <div className='flex items-start gap-6'>
            <div className='w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center'>
              {profilePictureUrl ? (
                <img
                  src={profilePictureUrl}
                  alt='Profile'
                  className='w-full h-full object-cover'
                />
              ) : (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-16 w-16 text-gray-400'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                  />
                </svg>
              )}
            </div>

            <div className='flex-1'>
              <h1 className='text-3xl font-bold text-gray-800 mb-4'>
                {sellerInfo.first_name} {sellerInfo.last_name}
              </h1>
              <div className='space-y-2'>
                {sellerInfo.user_name && (
                  <p className='text-lg'>
                    <span className='font-semibold'>Username:</span> {sellerInfo.user_name}
                  </p>
                )}
                <p className='text-lg text-gray-600'>
                  {listedProducts.length} {listedProducts.length === 1 ? 'listing' : 'listings'} available
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Listings */}
        <div>
          <h2 className='text-2xl font-bold text-gray-800 mb-4'>Listings</h2>
          {listedProducts.length === 0 ? (
            <div className='bg-white rounded-lg shadow p-8 text-center'>
              <p className='text-gray-600 mb-4'>This seller has no active listings</p>
              <button
                onClick={() => navigate('/product-search')}
                className='px-6 py-2 bg-[#007FB5] text-white rounded-lg hover:bg-[#006B9E]'
              >
                Browse Other Products
              </button>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {listedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
        {/* Reviews */}
        {/* <div className='p-10'>
          <h2 className='text-2xl font-bold'>Reviews</h2>
          <p className='text-2xl my-2'>
            <span className='text-3xl'>{displayStars(sellerInfo.rating!)}</span> (
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
          </p>
        </div> */}
        <section className='p-10'>
          <h2 className='text-2xl font-bold'>Reviews</h2>
          <p className='text-2xl my-2'>
            <span className='text-3xl'>{displayStars(sellerInfo.rating!)}</span> (
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
          </p>

          <button
            ref={reviewBtn}
            className='hover:cursor-pointer bg-yellow-300 border-yellow-500 border p-3 rounded mb-4 text-[#0B2545] font-semibold transition-colors hover:bg-yellow-400'
            onClick={showReviewInput}
          >
            Write a review
          </button>

          <div
            ref={reviewPopup}
            className='hidden items-center justify-center fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.6)]'
            onClick={hideReviewInput}
          >
            <div
              ref={reviewContent}
              className='bg-white h-[75%] w-[75%] rounded-2xl p-8'
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div className='flex justify-between'>
                <h3 className='text-3xl font-bold mb-2'>Write a Review</h3>
                <button
                  id='reviewExitBtn'
                  className='bg-gray-200 w-10 h-10 rounded-full flex items-center cursor-pointer'
                  onClick={hideReviewInput}
                >
                  <p className='text-center w-full font-bold text-gray-700'>
                    ✕
                  </p>
                </button>
              </div>
              <form onSubmit={submitReview}>
                <label>
                  <p className='text-xl my-2'>Title:</p>
                  <input
                    ref={reviewTitle}
                    name='title'
                    type='text'
                    className='bg-gray-100 border-2 rounded border-gray-300 p-2 w-[50%] min-w-60'
                  ></input>
                </label>
                <label>
                  <p className='text-xl my-2'>
                    Rate: &nbsp;
                    <span
                      ref={reviewStars}
                      id='rating'
                      className='text-2xl my-2 text-yellow-400'
                    >
                      <span
                        onClick={() => {
                          displayRating(reviewStars, 1);
                        }}
                      >
                        ☆
                      </span>
                      <span
                        onClick={() => {
                          displayRating(reviewStars, 2);
                        }}
                      >
                        ☆
                      </span>
                      <span
                        onClick={() => {
                          displayRating(reviewStars, 3);
                        }}
                      >
                        ☆
                      </span>
                      <span
                        onClick={() => {
                          displayRating(reviewStars, 4);
                        }}
                      >
                        ☆
                      </span>
                      <span
                        onClick={() => {
                          displayRating(reviewStars, 5);
                        }}
                      >
                        ☆
                      </span>
                    </span>
                  </p>
                </label>
                <label>
                  <p className='text-xl my-2'>Description:</p>
                  <textarea
                    ref={reviewDescription}
                    name='description'
                    className='bg-gray-100 border-2 rounded border-gray-300 p-2 w-full h-40 resize-none'
                  ></textarea>
                </label>
                <div className='py-5'>
                  <button
                    type='submit'
                    className='bg-yellow-300 border-yellow-500 p-2 mr-5 hover:bg-yellow-400 border rounded w-25'
                  >
                    Submit
                  </button>
                  <button
                    type='reset'
                    className='bg-yellow-300 border-yellow-500 p-2 mr-5 hover:bg-yellow-400 border rounded w-25'
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>
          </div>

          {reviews.length === 0 ? (
            <p className='text-gray-600'>
              No reviews yet.
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
