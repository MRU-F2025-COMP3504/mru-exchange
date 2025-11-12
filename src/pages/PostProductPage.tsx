import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from './Header';
import { supabase } from '@shared/api';

interface Product {
    id?: number;
    title: string | null;
    description: string | null;
    price: number | null;
    image: any | null;
    stock_count: number | null;
    isListed: boolean | null;
    isDeleted: boolean | null;
    category: string | null;
}

interface Category {
    id: number;
    name: string | null;
    description: string | null;
}

export default function PostProductPage() {

    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [product, setProduct] = useState<Product>({
        title: "",
        description: "",
        price: null,
        image: null,
        stock_count: null,
        isListed: null,
        isDeleted: null,
        category: null
    });

    
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

    const updateProduct = (field: keyof Product, value: any) => {
        setProduct(prev => ({ ...prev, [field]: value}))
    }

    //const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        

       // const selected = Array.from(e.target.files);

       // const images = selected.filter(file => file.type.startsWith("image/"));

       // if (images.length !== selected.length) {
           // alert("Only image files are allowed.");
        //}

        //setFiles(images);
    //}

    return(
        
        <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
            <Header/>
            <div
                style={{
                    display: "flex",
                    maxWidth: "1200px",
                    margin: "2rem auto",
                    gap: "2rem",
                    alignItems: "center"
                    
                }}
            >
                <aside
                    style={{
                        width: "30rem",
                        background: "white",
                        padding: "1rem",
                        borderRadius: "8px",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                        height: "fit-content",
                    }}
                >
                    <h3></h3>
                    <label style={{ display: "block", marginBottom: "0.5rem", }}>
                        <input 
                            type="textbox" 
                            placeholder="Enter title here..."
                            onChange={(e) => updateProduct("title", e.target.value)}
                            className="p-2 bg-gray-50 rounded-lg"
                        />
                    </label>
                    <label style={{ display: "block", marginBottom: "0.5rem", }}>
                        <input 
                            type="textbox"
                            placeholder="Enter price here..." 
                            onChange={(e) => updateProduct("price", e.target.value)}
                            className="p-2 bg-gray-50 rounded-lg"
                        /> 
                    </label>
                    <label style={{ display: "block", marginBottom: "0.5rem", }}>
                        <input 
                            type="dropdown" 
                            placeholder="Choose category..." 
                            onChange={(e) => updateProduct("category", e.target.value)}
                            className="p-2 bg-gray-50 rounded-lg"
                        /> 
                    </label>
                    <label style={{ display: "block", marginBottom: "0.5rem", }}>
                        <input 
                            type="textbox" 
                            placeholder="Description" 
                            onChange={(e) => updateProduct("description", e.target.value)}
                            className="p-2 bg-gray-50 rounded-lg w-sm"
                        /> 
                    </label>
                    <label style={{ display: "block", marginBottom: "0.5rem", padding: "1rem", }}>
                        <input type="file"
                        accept="image/*"
                        multiple
                        required
                        //onChange={handleFileChange}
                        placeholder="Add Photos" 
                        className="p-2 bg-gray-50 rounded-lg"
                        /> 
                    </label>
                    <button style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#0F76D7',
                        color: 'white',
                        borderRadius: '0.375rem',
                        border: 'none',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                    }}>
                        Preview Page
                    </button>
                </aside>
                <main 
                    style={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        paddingRight: "2rem",
                    }}
                >
                    <div 
                        style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}>
                        <h3 
                            style={{
                                marginBottom: "1rem",
                                fontSize: "1.25rem",
                                fontWeight: 600,
                                color: "#374151"
                        }}>
                            Preview
                        </h3>
                        
                    
                        <div
                            
                            style={{
                                background: "white",
                                borderRadius: "12px",
                                padding: "1rem",
                                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
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
                                    width: "340px",
                                    height: "140px",
                                    backgroundColor: "#d9d9d9",
                                    borderRadius: "12px",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "1rem",
                                    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                                    transition: "transform 0.2s, box-shadow 0.2s"
                                }}
                            ></div>
                    
                            <div 
                                style={{
                                    marginTop: "0.5rem",
                                }}
                            >
                                <h4>{product.title}</h4>
                                <p>
                                    ${product.price} 
                                    <br/>
                                    {product.category}
                                    <br/>
                                    {product.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
        
    )
}