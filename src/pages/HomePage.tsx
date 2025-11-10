import { useState, useEffect } from 'react';
import { useAuth } from '@shared/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@shared/api';
import Header from './Header';
import Footer from './Footer'

interface Product {
    id: number;
    title: string | null;
    description: string | null;
    price: number | null;
    image: any | null;
    stock_count: number | null;
}

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState<string>('');
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserName();
    fetchRecentProducts();
  }, [user]);

  // Get user first name
  const fetchUserName = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('User_Information')
        .select('first_name')
        .eq('supabase_id', user.id)
        .single();

      if (!error && data) {
        setFirstName(data.first_name || '');
      }
    } catch (error) {
      console.error('Error fetching user name:', error);
    }
  };

  // Get 4 recent products
  const fetchRecentProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('Product_Information')
        .select('id, title, description, price, image, stock_count')
        .eq('"isListed"', true)
        .eq('"isDeleted"', false)
        .order('created_at', { ascending: false })
        .limit(4);

      if (!error && data) {
        setRecentProducts(data);
      }
    } catch (error) {
      console.error('Error fetching recent products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get image URL from Supabase
  const getImageUrl = (imageData: any): string | null => {
    if (!imageData) return null;
    
    try {
      let imagePath: string | null = null;
      
      if (typeof imageData === 'object' && imageData !== null) {
        imagePath = imageData.image || imageData.path || imageData.url || imageData.filename;
      } else if (typeof imageData === 'string') {
        imagePath = imageData;
      }
      
      if (!imagePath) return null;
      if (imagePath.startsWith('http')) return imagePath;
      
      const filename = imagePath.replace('database/images/', '').split('/').pop();
      if (!filename) return null;
      
      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filename);
      
      return data.publicUrl;
    } catch (error) {
      return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      <Header/>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: '#111827',
            marginBottom: '2rem'
          }}>
            Welcome to MRU Exchange{firstName ? `, ${firstName}` : ''}! 🎉
          </h1>

          <div style={{ 
            display: 'flex', 
            gap: '1.5rem', 
            justifyContent: 'center',
            marginTop: '2rem'
          }}>
            <button
              onClick={() => navigate('/product-search')}
              style={{
                padding: '1.5rem 2.5rem',
                backgroundColor: 'white',
                border: '2px solid #E5E7EB',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                minWidth: '200px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#007FB5';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📚</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#111827' }}>
                Browse Products
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }}>
                Find what you need
              </div>
            </button>

            <button
              onClick={() => navigate('/post-product')}
              style={{
                padding: '1.5rem 2.5rem',
                backgroundColor: 'white',
                border: '2px solid #E5E7EB',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                minWidth: '200px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#007FB5';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>➕</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#111827' }}>
                Sell Something
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }}>
                List your items
              </div>
            </button>
          </div>
        </div>

        <div style={{ marginTop: '4rem' }}>
          <h2 style={{ 
            fontSize: '1.75rem', 
            fontWeight: 'bold', 
            color: '#111827',
            marginBottom: '1.5rem'
          }}>
            Recently Listed
          </h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>
              Loading products...
            </div>
          ) : recentProducts.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem',
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '2px dashed #E5E7EB'
            }}>
              <p style={{ fontSize: '1.1rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                No products listed yet
              </p>
              <p style={{ fontSize: '0.9rem', color: '#9CA3AF' }}>
                Be the first to list something!
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '1.5rem'
            }}>
              {recentProducts.map((product) => {
                const imageUrl = getImageUrl(product.image);
                
                return (
                  <div
                    key={product.id}
                    onClick={() => navigate('/product-search')}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      padding: '1rem',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
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
                    <div style={{
                      width: '100%',
                      height: '160px',
                      backgroundColor: '#E5E7EB',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '0.75rem'
                    }}>
                      {imageUrl ? (
                        <img 
                          src={imageUrl}
                          alt={product.title || 'Product'} 
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover' 
                          }}
                        />
                      ) : (
                        <span style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>No Image</span>
                      )}
                    </div>

                    <h4 style={{ 
                      fontSize: '1rem', 
                      fontWeight: '600',
                      color: '#111827',
                      marginBottom: '0.5rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {product.title || 'Untitled Product'}
                    </h4>
                    
                    {product.price !== null && (
                      <p style={{ 
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        color: '#007FB5',
                        margin: 0
                      }}>
                        ${product.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer/>
    </div>
  );
}
