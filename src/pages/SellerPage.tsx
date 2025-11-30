import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { supabase } from '@shared/api';

interface SellerInfo {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  user_name: string | null;
  supabase_id: string;
  profile_image: any | null;
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

export default function SellerPage() {
  const { sellerId } = useParams<{ sellerId: string }>();
  const navigate = useNavigate();

  const [sellerInfo, setSellerInfo] = useState<SellerInfo | null>(null);
  const [listedProducts, setListedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sellerId) {
      fetchSellerProfile();
      fetchSellerListings();
    }
  }, [sellerId]);

  const fetchSellerProfile = async () => {
    if (!sellerId) return;

    try {
      const { data, error } = await supabase
        .from('User_Information')
        .select('id, first_name, last_name, email, user_name, supabase_id, profile_image')
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
    <div className='bg-[#F9FAFB] min-h-screen'>
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
      </main>

      <Footer />
    </div>
  );
}
