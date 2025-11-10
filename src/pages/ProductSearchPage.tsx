import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { supabase } from '@shared/api';

interface Product {
    id: number;
    title: string | null;
    description: string | null;
    price: number | null;
    image: any | null;
    stock_count: number | null;
    isListed: boolean | null;
    isDeleted: boolean | null;
}

interface Category {
    id: number;
    name: string | null;
    description: string | null;
}

export default function ProductSearchPage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    
    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [selectedCategories]);

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

    // Get products with filters
    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            
            let query = supabase
                .from('Product_Information')
                .select('*')
                .eq('"isListed"', true)
                .eq('"isDeleted"', false);

            // Filter by category if selected
            if (selectedCategories.length > 0) {
                const { data: categoryProducts, error: categoryError } = await supabase
                    .from('Category_Assigned_Products')
                    .select('product_id')
                    .in('category_id', selectedCategories);

                if (categoryError) throw categoryError;

                const productIds = categoryProducts?.map(cp => cp.product_id) || [];
                
                if (productIds.length > 0) {
                    query = query.in('id', productIds);
                } else {
                    setProducts([]);
                    setLoading(false);
                    return;
                }
            }

            const { data, error: fetchError } = await query.order('created_at', { ascending: false });

            if (fetchError) {
                throw new Error(fetchError.message);
            }

            setProducts(data || []);
        } catch (err: any) {
            console.error('Error fetching products:', err);
            setError(err?.message || 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    // Search products
    const handleSearch = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!searchQuery.trim()) {
            fetchProducts();
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            let query = supabase
                .from('Product_Information')
                .select('*')
                .eq('"isListed"', true)
                .eq('"isDeleted"', false)
                .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);

            // Apply category filter to search
            if (selectedCategories.length > 0) {
                const { data: categoryProducts, error: categoryError } = await supabase
                    .from('Category_Assigned_Products')
                    .select('product_id')
                    .in('category_id', selectedCategories);

                if (categoryError) throw categoryError;

                const productIds = categoryProducts?.map(cp => cp.product_id) || [];
                
                if (productIds.length > 0) {
                    query = query.in('id', productIds);
                } else {
                    setProducts([]);
                    setLoading(false);
                    return;
                }
            }

            const { data, error: searchError } = await query.order('created_at', { ascending: false });

            if (searchError) {
                throw searchError;
            }

            setProducts(data || []);
        } catch (err: any) {
            console.error('Error searching products:', err);
            setError(err?.message || 'Failed to search products');
        } finally {
            setLoading(false);
        }
    };

    // Toggle category filter
    const handleCategoryToggle = (categoryId: number) => {
        setSelectedCategories(prev => {
            if (prev.includes(categoryId)) {
                return prev.filter(id => id !== categoryId);
            } else {
                return [...prev, categoryId];
            }
        });
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
            console.error('Error getting image URL:', error);
            return null;
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
            <Header/>

            <section style={{
                backgroundColor: "#007FB5",
                padding: "1.5rem 2rem",
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Search listings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: "60%",
                            padding: "0.6rem",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "1rem",
                        }}
                    />
                    <button 
                        type="submit"
                        style={{
                            backgroundColor: "White",
                            padding: "0.6rem 1.2rem",
                            borderRadius: "6px",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: "bold",
                        }}
                    >
                        Search
                    </button>
                </form>
                <button 
                    style={{
                        backgroundColor: "White",
                        padding: "0.6rem 1.2rem",
                        borderRadius: "6px",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                >
                    Post Ad
                </button>
            </section>

            <div style={{
                display: "flex",
                maxWidth: "1200px",
                margin: "2rem auto",
                gap: "2rem",
                padding: "0 1rem",
            }}>
                <aside style={{
                    width: "250px",
                    background: "white",
                    padding: "1rem",
                    borderRadius: "8px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    height: "fit-content",
                }}>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>Categories</h3>
                    {categories.map((category) => (
                        <label 
                            key={category.id}
                            style={{ 
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                marginBottom: "0.75rem",
                                cursor: "pointer"
                            }}
                        >
                            <input 
                                type="checkbox"
                                checked={selectedCategories.includes(category.id)}
                                onChange={() => handleCategoryToggle(category.id)}
                                style={{ cursor: "pointer" }}
                            />
                            <span style={{ fontSize: '0.95rem' }}>{category.name}</span>
                        </label>
                    ))}
                    {selectedCategories.length > 0 && (
                        <button
                            onClick={() => setSelectedCategories([])}
                            style={{
                                marginTop: '1rem',
                                padding: '0.5rem',
                                backgroundColor: '#EF4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                width: '100%',
                                fontSize: '0.875rem',
                                fontWeight: 'bold'
                            }}
                        >
                            Clear Filters
                        </button>
                    )}
                </aside>

                <main style={{
                    flex: 1,
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "2rem",
                }}>
                    {loading && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                            <p>Loading products...</p>
                        </div>
                    )}

                    {error && (
                        <div style={{ 
                            gridColumn: '1 / -1', 
                            padding: '2rem',
                            backgroundColor: '#FEE2E2',
                            borderRadius: '8px',
                            border: '1px solid #EF4444'
                        }}>
                            <p style={{ color: '#DC2626', marginBottom: '1rem', fontWeight: 'bold' }}>
                                Error: {error}
                            </p>
                            <button 
                                onClick={fetchProducts}
                                style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: '#007FB5',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                }}
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {!loading && !error && products.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                            <p style={{ fontSize: '1.1rem', color: '#6B7280', marginBottom: '1rem' }}>
                                No products found.
                            </p>
                            <p style={{ fontSize: '0.9rem', color: '#9CA3AF' }}>
                                {searchQuery 
                                    ? 'Try a different search term.' 
                                    : selectedCategories.length > 0
                                    ? 'No products in selected categories.'
                                    : 'Be the first to list a product!'}
                            </p>
                        </div>
                    )}

                    {!loading && !error && products.map((product) => {
                        const imageUrl = getImageUrl(product.image);
                        
                        return (
                            <div
                                key={product.id}
                                style={{
                                    background: "white",
                                    borderRadius: "12px",
                                    padding: "1rem",
                                    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                                    cursor: "pointer",
                                    transition: "transform 0.2s, box-shadow 0.2s",
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
                                    width: "100%",
                                    height: "140px",
                                    backgroundColor: "#E5E7EB",
                                    borderRadius: "8px",
                                    overflow: "hidden",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
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
                                            onError={(e) => {
                                                console.error('Image failed to load:', imageUrl);
                                                const target = e.currentTarget as HTMLImageElement;
                                                target.style.display = 'none';
                                                if (target.parentElement) {
                                                    target.parentElement.innerHTML = '<span style="color: #9CA3AF; font-size: 0.875rem;">Image unavailable</span>';
                                                }
                                            }}
                                        />
                                    ) : (
                                        <span style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>No Image</span>
                                    )}
                                </div>

                                <div style={{ marginTop: "0.5rem" }}>
                                    <h4 style={{ margin: '0.5rem 0', fontSize: '1.1rem', color: '#111827' }}>
                                        {product.title || 'Untitled Product'}
                                    </h4>
                                    <p style={{ 
                                        margin: '0.5rem 0', 
                                        color: '#666',
                                        fontSize: '0.9rem',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                    }}>
                                        {product.description || 'No description available'}
                                    </p>
                                    {product.price !== null && (
                                        <p style={{ 
                                            margin: '0.5rem 0', 
                                            fontSize: '1.2rem',
                                            fontWeight: 'bold',
                                            color: '#007FB5'
                                        }}>
                                            ${product.price.toFixed(2)}
                                        </p>
                                    )}
                                    {product.stock_count !== null && (
                                        <p style={{ 
                                            margin: '0.5rem 0', 
                                            fontSize: '0.85rem',
                                            color: product.stock_count > 0 ? '#28a745' : '#dc3545'
                                        }}>
                                            {product.stock_count > 0 
                                                ? `${product.stock_count} in stock` 
                                                : 'Out of stock'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </main>
            </div>
        </div>
    );
}
