import { useEffect, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import { supabase, UserAuthentication } from '@shared/api';
import type { Product } from '../shared/types';
import { useAuth } from '@shared/contexts';

interface Category {
  id: number;
  name: string | null;
  description: string | null;
}
const defaultProduct: Product = {
  created_at: '',
  description: '',
  id: 0,
  image: null,
  isDeleted: false,
  isListed: false,
  price: 0,
  stock_count: 0,
  title: '',
  user_id: '',
};

export default function PostProductPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state } = useLocation();
  const [product, setProduct] = useState<Product>(() => {
    return state?.product || defaultProduct;
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [seller, setSeller] = useState<any>(null);
  const [images, setImages] = useState<File[]>(() => {
    return state?.images || [];
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchSeller();
  }, [user]);

  // Get all categories
  const fetchCategories = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('Category_Tags')
        .select('*')
        .order('name', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setCategories(data || []);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchSeller = async () => {
    if (!user.ok) return;

    try {
      const { data, error } = await supabase
        .from('User_Information')
        .select('*')
        .eq('supabase_id', user.data.id)
        .single();
      if (!error && data) {
        setSeller(data);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const updateProduct = (field: keyof Product, value: any) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);

    const imageFiles = selected.filter((file) =>
      file.type.startsWith('image/'),
    );

    if (imageFiles.length !== selected.length) {
      alert('Only image files are allowed.');
      return;
    }

    setImages((prev) => {
      const combined = [...prev, ...imageFiles];
      return combined.slice(0, 5);
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Validates the required fields to pass into the Preview Page
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    navigate('/preview-post', {
      state: {
        product,
        images,
        seller,
        form: new FormData(event.currentTarget),
      },
    });
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />
      <div className='flex max-w-6xl mx-auto mt-8 gap-8 items-center'>
        <aside className='w-[30rem] bg-white p-4 rounded-lg shadow-sm h-fit'>
          <form
            onSubmit={(event) => {
              handleSubmit(event);
            }}
          >
            <h3 className='mb-4 text-xl font-semibold'>
              Enter Product Details:
            </h3>

            <label className='block mb-1 p-2'>
              <div className='p-1'>Enter the Title:</div>
              <input
                type='textbox'
                name='title'
                placeholder='Enter title here...'
                value={product.title || ''}
                onChange={(e) => {
                  updateProduct('title', e.target.value);
                }}
                className='w-full p-2 rounded-md border border-gray-300 text-base bg-white cursor-pointer'
              />
            </label>

            <label className='block mb-1 p-2'>
              <div className='p-1'>Enter the Price:</div>
              <input
                type='number'
                name='price'
                min='0'
                max='10000'
                placeholder='$'
                value={product.price || ''}
                onChange={(e) => {
                  updateProduct('price', e.target.value);
                }}
                className='w-full p-2 rounded-md border border-gray-300 text-base bg-white cursor-pointer'
              />
            </label>

            <label className='block mb-1 p-2'>
              <div className='p-1'>Choose Category:</div>
              <select
                name='categories'
                className='w-full p-2 rounded-md border border-gray-300 text-base bg-white cursor-pointer'
              >
                <option value=''></option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name || ''}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </label>

            <label className='block mb-1 p-2'>
              <div className='p-1'>Enter Description:</div>
              <textarea
                name='description'
                placeholder='Description'
                value={product.description || ''}
                onChange={(e) => {
                  updateProduct('description', e.target.value);
                }}
                className='w-full p-2 rounded-md border border-gray-300 text-base bg-white cursor-pointer'
              />
            </label>

            <label className='block mb-1 p-2'>
              <div className='p-1'>Enter Stock Count:</div>
              <input
                name='stock'
                type='number'
                min='1'
                max='999'
                placeholder='Stock Count'
                value={product.stock_count || ''}
                onChange={(e) => {
                  updateProduct('stock_count', e.target.value);
                }}
                className='w-full p-2 rounded-md border border-gray-300 text-base bg-white cursor-pointer'
              />
            </label>

            <label className='block mb-2 p-4'>
              <div className='flex flex-wrap gap-1 mb-2'>
                {(images || []).map((file, index) => {
                  const url = URL.createObjectURL(file);
                  return (
                    <div
                      key={index}
                      className='relative w-[90px] h-[90px] rounded-lg overflow-hidden shadow-sm'
                    >
                      <img
                        src={url}
                        alt={`Upload ${index}`}
                        className='w-full h-full object-cover'
                      />
                      <button
                        type='button'
                        onClick={() => {
                          handleRemoveImage(index);
                        }}
                        className='absolute top-0.5 right-1 bg-white/80 border-none'
                      >
                        x
                      </button>
                    </div>
                  );
                })}
              </div>

              {(images?.length || 0) < 6 && (
                <input
                  name='images'
                  type='file'
                  accept='image/*'
                  multiple
                  required
                  onChange={handleFileChange}
                  className='px-4 py-2 bg-gray-500 text-white rounded-md border-none text-sm font-medium cursor-pointer'
                />
              )}

              <p className='text-sm text-gray-600 mt-1'>
                {images?.length || 0}/5 images selected
              </p>
            </label>

            <button
              type='submit'
              className='px-4 py-2 bg-blue-600 text-white rounded-md border-none text-sm font-medium cursor-pointer hover:bg-blue-700 transition-colors'
            >
              Preview Page
            </button>
          </form>
        </aside>

        <main className='flex-1 flex justify-center items-start pr-8'>
          <div className='flex flex-col items-center'>
            <h3 className='mb-4 text-xl font-semibold text-red-500'>Preview</h3>

            <div className='bg-white rounded-xl p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg'>
              <div
                className={`w-[340px] h-[140px] rounded-xl flex items-center justify-center p-4 shadow-sm transition-all duration-200 ${images && images.length > 0 ? 'bg-transparent' : 'bg-gray-300'
                  }`}
              >
                {images && images.length > 0 ? (
                  <img
                    src={URL.createObjectURL(images[0])}
                    alt='Preview'
                    className='w-full h-full object-cover rounded-xl'
                  />
                ) : (
                  <span className='text-gray-600 text-sm'>
                    No Image Selected
                  </span>
                )}
              </div>

              <div className='mt-2'>
                <h4 className='my-2 text-lg text-gray-900'>{product.title}</h4>
                <p className='my-2 text-gray-600 text-sm overflow-hidden text-ellipsis line-clamp-2'>
                  {product.description}
                </p>
                <p className='my-2 text-xl font-bold text-blue-600'>
                  ${product.price}
                </p>
                <p className='my-2 text-sm text-green-600'>
                  {product.stock_count} in stock
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
