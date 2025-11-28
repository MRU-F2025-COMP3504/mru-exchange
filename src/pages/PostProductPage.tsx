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
  created_at: "",
  description: '',
  id: 0,
  image: null,
  isDeleted: false,
  isListed: false,
  price: 0,
  stock_count: 0,
  title: '',
  user_id: ""
  };

export default function PostProductPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state } = useLocation();
  const [product, setProduct] = useState<Product>(() => {
    return state?.product || defaultProduct;
  });
  const [ categories, setCategories ] = useState<Category[]>([]);
  const [ seller, setSeller ] = useState<any>(null);
  const [ images, setImages ] = useState<File[]>(()  => {
    return state?.images || [];
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchSeller();
  }, [user])

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
        setSeller(data)
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

    const imageFiles = selected.filter((file) => file.type.startsWith('image/'));

    if (imageFiles.length !== selected.length) {
      alert('Only image files are allowed.');
      return;
    }

    setImages((prev) => {
      const combined = [...prev, ...imageFiles];
      return combined.slice(0,5);
    })
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  };

  // Validates the required fields to pass into the Preview Page
  const handlePreviewButton = () => {

    if (
      !product.title?.trim() || 
      !product.description?.trim() ||
      product.price === null ||
      product.stock_count === null 
    ) {
      alert("Please fill out all fields and upload at least one image before previewing")
      return;
    }

    navigate('/preview-post', { state: { product, images, seller } })
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      <Header />
      <div
        style={{
          display: 'flex',
          maxWidth: '1200px',
          margin: '2rem auto',
          gap: '2rem',
          alignItems: 'center',
        }}
      >
        <aside
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
            Enter Product Details:
          </h3>

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
              }}>Enter the Title: 
            </div>
            <input
              type='textbox'
              placeholder='Enter title here...'
              value={product.title || ''}
              onChange={(e) => updateProduct('title', e.target.value)}
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
              }}>Enter the Price: 
            </div>
            <input
              type='number'
              min='0'
              max='10000'
              placeholder='$'
              value={product.price || ''}
              onChange={(e) => updateProduct('price', e.target.value)}
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
              }}>Choose Category: 
            </div>
            <select
              
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                border: '1px solid #ccc',
                fontSize: '1rem',
                backgroundColor: 'white',
                cursor: 'pointer',
              }}
            >
              <option value=''></option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name || ''}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>
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
              }}>Enter Description: 
            </div>
            <textarea
              placeholder='Description'
              value={product.description || ''}
              onChange={(e) => updateProduct('description', e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                border: '1px solid #ccc',
                fontSize: '1rem',
                backgroundColor: 'white',
                cursor: 'pointer',
              }}>
            </textarea>
          </label>
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
              }}>Enter Stock Count: 
            </div>
            <input
              type='number'
              min='1'
              max='999'
              placeholder='Stock Count'
              value={product.stock_count || ''}
              onChange={(e) => updateProduct('stock_count', e.target.value)}
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
          <label
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              padding: '1rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.25rem',
                marginBottom: '0.5rem',
              }}
            >
              {(images || []).map((file, index) => {
                const url = URL.createObjectURL(file);
                return (
                  <div
                    key={index}
                    style={{
                      position: 'relative',
                      width: '90px',
                      height: '90px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                    }}
                  >
                    <img
                      src={url}
                      alt={`Upload ${index}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />

                    <button
                      type='button'
                      onClick={() => handleRemoveImage(index)}
                      style={{
                        position: 'absolute',
                        top: '2px',
                        right: '4px',
                        background: 'rgba(255,255,255,0.8)',
                        border: 'none',
                      }}
                    >
                      x
                    </button>
                  </div>
                );
              })}
            </div>

            {(images?.length || 0) < 6 && (
              <input
                type='file'
                accept='image/*'
                multiple
                required
                onChange={handleFileChange}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'gray',
                  color: 'white',
                  borderRadius: '0.375rem',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              />
            )}

            <p
              style={{
                fontSize: '0.85rem',
                color: '#666',
                marginTop: '0.3rem',
              }}
            >
              {images?.length || 0}/6 images selected
            </p>
          </label>
          <button
            onClick={handlePreviewButton}
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
            Preview Page
          </button>
        </aside>
        <main
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingRight: '2rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <h3
              style={{
                marginBottom: '1rem',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'red',
              }}
            >
              Preview
            </h3>

            <div
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1rem',
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.1)';
              }}
            >
              <div
                style={{
                  width: '340px',
                  height: '140px',
                  backgroundColor: images && images.length > 0? 'transparent' : '#d9d9d9',
                  borderRadius: '12px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                {images && images.length > 0 ? (
                  <img
                    src={URL.createObjectURL(images[0])}
                    alt="Preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : ( 
                  <span style={{ color: '#555', fontSize: '0.9rem' }}> No Image Selected </span>
                )}
              </div>

              <div
                style={{
                  marginTop: '0.5rem',
                }}
              >
                <h4
                  style={{
                    margin: '0.5rem 0',
                    fontSize: '1.1rem',
                    color: '#111827',
                  }}
                >
                  {product.title}
                </h4>
                <p
                  style={{
                    margin: '0.5rem 0',
                    color: '#666',
                    fontSize: '0.9rem',
                    overflow: 'hidden',
                    overflowWrap: 'anywhere',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    whiteSpace: 'normal'
                  }}
                >
                  {product.description}
                </p>
                <p
                  style={{
                    margin: '0.5rem 0',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    color: '#007FB5',
                  }}
                >
                  ${product.price}
                </p>
                <p
                  style={{
                    margin: '0.5rem 0',
                    fontSize: '0.85rem',
                    color: '#28a745',
                  }}
                >
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
