import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { ProductListing } from '@features/listing/api';
import { supabase } from '@shared/api';
import { useAuth } from '@shared/contexts';

interface UserInfo {
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

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentUserId = user.ok ? user.data.id : null;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [bookmarkedProducts, setBookmarkedProducts] = useState<Product[]>([]);
  const [listedProducts, setListedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'listings'>(
    'bookmarks',
  );

  useEffect(() => {
    if (currentUserId) {
      fetchUserProfile();
      fetchBookmarkedProducts();
      fetchListedProducts();
    }
  }, [currentUserId]);

  const fetchUserProfile = async () => {
    if (!currentUserId) return;

    try {
      const { data, error } = await supabase
        .from('User_Information')
        .select(
          'id, first_name, last_name, email, user_name, supabase_id, profile_image',
        )
        .eq('supabase_id', currentUserId)
        .single();

      if (error) throw error;
      setUserInfo(data);
    } catch (err: any) {
      console.error('Error fetching user profile:', err);
    }
  };

  const fetchBookmarkedProducts = async () => {
    if (!currentUserId) return;

    try {
      // Get user's cart
      const { data: cartData, error: cartError } = await supabase
        .from('Shopping_Cart')
        .select('id')
        .eq('user_id', currentUserId)
        .maybeSingle();

      if (cartError || !cartData) {
        setBookmarkedProducts([]);
        return;
      }

      // Get products in cart (including sold ones)
      const { data: bookmarkData, error: bookmarkError } = await supabase
        .from('Shopping_Cart_Products')
        .select(
          `
                    product_id,
                    Product_Information:product_id (
                        id,
                        title,
                        description,
                        price,
                        image,
                        stock_count,
                        isListed,
                        isDeleted,
                        created_at
                    )
                `,
        )
        .eq('shopping_cart_id', cartData.id);

      if (bookmarkError) throw bookmarkError;

      const products =
        bookmarkData
          ?.map((item: any) => item.Product_Information)
          .filter((p: any) => p) || [];

      setBookmarkedProducts(products);
    } catch (err: any) {
      console.error('Error fetching bookmarked products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchListedProducts = async () => {
    if (!currentUserId) return;

    try {
      // Get products that aren't deleted
      const { data, error } = await supabase
        .from('Product_Information')
        .select(
          'id, title, description, price, image, stock_count, isListed, isDeleted, created_at',
        )
        .eq('user_id', currentUserId)
        .eq('"isDeleted"', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListedProducts(data || []);
    } catch (err: any) {
      console.error('Error fetching listed products:', err);
    }
  };

  const handleRemoveBookmark = async (productId: number) => {
    if (!currentUserId) return;

    try {
      const { data: cartData, error: cartError } = await supabase
        .from('Shopping_Cart')
        .select('id')
        .eq('user_id', currentUserId)
        .single();

      if (cartError || !cartData) return;

      // Remove from cart
      const { error: deleteError } = await supabase
        .from('Shopping_Cart_Products')
        .delete()
        .eq('shopping_cart_id', cartData.id)
        .eq('product_id', productId);

      if (deleteError) throw deleteError;

      setBookmarkedProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err: any) {
      console.error('Error removing bookmark:', err);
    }
  };

  const handleMarkAsSold = async (productId: number) => {
    if (!confirm('Mark this product as sold?')) return;

    try {
      console.log('Attempting to mark product as sold:', productId);
      console.log('Current user ID:', currentUserId);
      
      // Call the database function to mark the product as sold
      const { data, error } = await supabase.rpc('mark_product_as_sold', {
        product_id_param: productId
      });

      if (error) {
        console.error('Failed to mark product as sold:', error);
        throw error;
      }

      console.log('Product marked as sold successfully');

      // Remove from listings
      setListedProducts((prev) => prev.filter((p) => p.id !== productId));

      // Update in bookmarks to show as sold
      setBookmarkedProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, isDeleted: true, isListed: false } : p,
        ),
      );

      alert('Product marked as sold!');
    } catch (err: any) {
      console.error('Error marking product as sold:', err);
      console.error('Error details:', JSON.stringify(err, null, 2));
      alert('Failed to mark product as sold: ' + (err.message || 'Unknown error'));
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfilePictureUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file || !currentUserId || !userInfo) return;

    try {
      setUploadingImage(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${currentUserId}-${Date.now()}.${fileExt}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('profile-pictures').getPublicUrl(fileName);

      // Save URL to database
      const { error: updateError } = await supabase
        .from('User_Information')
        .update({ profile_image: publicUrl })
        .eq('supabase_id', currentUserId);

      if (updateError) throw updateError;

      setUserInfo({ ...userInfo, profile_image: publicUrl });
    } catch (err: any) {
      console.error('Error uploading profile picture:', err);
      alert('Failed to upload profile picture');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteProfilePicture = async () => {
    if (!currentUserId || !userInfo) return;

    if (!confirm('Are you sure you want to delete your profile picture?'))
      return;

    try {
      setUploadingImage(true);

      // Remove from database
      const { error: updateError } = await supabase
        .from('User_Information')
        .update({ profile_image: null })
        .eq('supabase_id', currentUserId);

      if (updateError) throw updateError;

      setUserInfo({ ...userInfo, profile_image: null });
    } catch (err: any) {
      console.error('Error deleting profile picture:', err);
      alert('Failed to delete profile picture');
    } finally {
      setUploadingImage(false);
    }
  };

  const getImageUrl = (imageData: any): string | null => {
    if (!imageData) return null;

    try {
      let imagePath: string | null = null;

      if (typeof imageData === 'object' && imageData !== null) {
        imagePath =
          imageData.image ||
          imageData.path ||
          imageData.url ||
          imageData.filename;
      } else if (typeof imageData === 'string') {
        imagePath = imageData;
      }

      if (!imagePath) return null;
      if (imagePath.startsWith('http')) return imagePath;

      // Get filename from path
      const filename = imagePath
        .replace('database/images/', '')
        .split('/')
        .pop();
      if (!filename) return null;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filename);

      return data.publicUrl;
    } catch (error) {
      console.error('Error getting image URL:', error);
      return null;
    }
  };

  const getProfilePictureUrl = (profileImage: any): string | null => {
    if (!profileImage) return null;

    if (typeof profileImage === 'string') {
      return profileImage;
    }

    if (typeof profileImage === 'object' && profileImage.url) {
      return profileImage.url;
    }

    return null;
  };

  const ProductCard = ({
    product,
    showRemove = false,
    showSold = false,
  }: {
    product: Product;
    showRemove?: boolean;
    showSold?: boolean;
  }) => {
    const imageUrl = getImageUrl(product.image);
    const isSold = product.isDeleted || !product.isListed;

    return (
      <div
        className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow ${isSold ? 'opacity-60' : 'cursor-pointer'}`}
        onClick={() => !isSold && navigate(`/product/${product.id}`)}
      >
        <div className='relative'>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.title || 'Product'}
              className={`w-full h-48 object-cover rounded-t-lg ${isSold ? 'grayscale' : ''}`}
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
          {/* Show SOLD overlay */}
          {isSold && (
            <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-t-lg'>
              <span className='text-white text-3xl font-bold'>SOLD</span>
            </div>
          )}
          {/* Remove bookmark button */}
          {showRemove && !isSold && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveBookmark(product.id);
              }}
              className='absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors w-10 h-10'
              title='Remove bookmark'
            >
              ✕
            </button>
          )}
          {/* Mark as sold button */}
          {showSold && !isSold && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMarkAsSold(product.id);
              }}
              className='absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition-colors text-sm font-semibold'
              title='Mark as sold'
            >
              Sold
            </button>
          )}
        </div>
        <div className='p-4'>
          <h3 className='font-semibold text-lg mb-2 truncate'>
            {product.title}
          </h3>
          {product.price !== null && (
            <p
              className={`font-bold text-xl mb-2 ${isSold ? 'text-gray-400 line-through' : 'text-[#007FB5]'}`}
            >
              ${product.price.toFixed(2)}
            </p>
          )}
          <p className='text-gray-600 text-sm line-clamp-2'>
            {product.description}
          </p>
          {!isSold && product.stock_count !== null && (
            <p
              className={`text-sm mt-2 ${product.stock_count > 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {product.stock_count > 0
                ? `${product.stock_count} in stock`
                : 'Out of stock'}
            </p>
          )}
        </div>
      </div>
    );
  };

  if (!currentUserId) {
    return (
      <div className='bg-[#F9FAFB] min-h-screen'>
        <Header />
        <main className='flex items-center justify-center min-h-[60vh]'>
          <div className='text-center'>
            <p className='text-xl text-gray-600 mb-4'>
              Please log in to view your profile
            </p>
            <button
              onClick={() => navigate('/signin')}
              className='px-6 py-2 bg-[#007FB5] text-white rounded-lg hover:bg-[#006B9E]'
            >
              Sign In
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className='bg-[#F9FAFB] min-h-screen'>
        <Header />
        <main className='flex items-center justify-center min-h-[60vh]'>
          <p className='text-xl text-gray-600'>Loading profile...</p>
        </main>
        <Footer />
      </div>
    );
  }

  const profilePictureUrl = getProfilePictureUrl(userInfo?.profile_image);

  return (
    <div className='bg-[#F9FAFB] grid grid-rows-[auto_1fr_auto] min-h-screen'>
      <Header />

      <main className='px-4 py-8'>
        <div className='max-w-7xl mx-auto'>
        {/* Profile info section */}
        <div className='bg-white rounded-lg shadow p-6 mb-8'>
          <div className='flex items-start gap-6'>
            {/* Profile picture */}
            <div className='flex flex-col items-center gap-3'>
              <div className='relative'>
                <div
                  className='w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity'
                  onClick={handleProfilePictureClick}
                >
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
                {uploadingImage && (
                  <div className='absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center'>
                    <span className='text-white text-sm'>Uploading...</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                onChange={handleProfilePictureUpload}
                className='hidden'
              />
              <div className='flex gap-2'>
                <button
                  onClick={handleProfilePictureClick}
                  disabled={uploadingImage}
                  className='px-3 py-1 text-sm bg-[#007FB5] text-white rounded hover:bg-[#006B9E] disabled:opacity-50'
                >
                  {profilePictureUrl ? 'Change' : 'Upload'}
                </button>
                {profilePictureUrl && (
                  <button
                    onClick={handleDeleteProfilePicture}
                    disabled={uploadingImage}
                    className='px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50'
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>

            {/* User info */}
            <div className='flex-1'>
              <h1 className='text-3xl font-bold text-gray-800 mb-4'>
                My Profile
              </h1>
              {userInfo && (
                <div className='space-y-2'>
                  <p className='text-lg'>
                    <span className='font-semibold'>Name:</span>{' '}
                    {userInfo.first_name} {userInfo.last_name}
                  </p>
                  {userInfo.user_name && (
                    <p className='text-lg'>
                      <span className='font-semibold'>Username:</span>{' '}
                      {userInfo.user_name}
                    </p>
                  )}
                  <p className='text-lg'>
                    <span className='font-semibold'>Email:</span>{' '}
                    {userInfo.email}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className='mb-6'>
          <div className='border-b border-gray-200'>
            <nav className='flex space-x-8'>
              <button
                onClick={() => setActiveTab('bookmarks')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bookmarks'
                    ? 'border-[#007FB5] text-[#007FB5]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Bookmarked Products ({bookmarkedProducts.length})
              </button>
              <button
                onClick={() => setActiveTab('listings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'listings'
                    ? 'border-[#007FB5] text-[#007FB5]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Listings ({listedProducts.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Tab content */}
        {activeTab === 'bookmarks' ? (
          <div>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-2xl font-bold text-gray-800'>
                Bookmarked Products
              </h2>
            </div>
            {bookmarkedProducts.length === 0 ? (
              <div className='bg-white rounded-lg shadow p-8 text-center'>
                <p className='text-gray-600 mb-4'>
                  You haven't bookmarked any products yet
                </p>
                <button
                  onClick={() => navigate('/product-search')}
                  className='px-6 py-2 bg-[#007FB5] text-white rounded-lg hover:bg-[#006B9E]'
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {bookmarkedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showRemove={true}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-2xl font-bold text-gray-800'>My Listings</h2>
              <button
                onClick={() => navigate('/post-product')}
                className='px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700'
              >
                + Create New Listing
              </button>
            </div>
            {listedProducts.length === 0 ? (
              <div className='bg-white rounded-lg shadow p-8 text-center'>
                <p className='text-gray-600 mb-4'>
                  You don't have any listings yet
                </p>
                <button
                  onClick={() => navigate('/post-product')}
                  className='px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700'
                >
                  Create Your First Listing
                </button>
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {listedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showSold={true}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
