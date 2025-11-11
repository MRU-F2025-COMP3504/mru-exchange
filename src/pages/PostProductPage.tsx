import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

export default function PostProductPage() {

    //const product = {
        //id: "",

    //}

    //const product.id = $state("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    
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
                }}
            >
                <aside
                    style={{
                        width: "40rem",
                        background: "white",
                        padding: "1rem",
                        borderRadius: "8px",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                        height: "fit-content",
                    }}
                >
                    <h3></h3>
                    <label style={{ display: "block", marginBottom: "0.5rem", padding: "1rem",}}>
                        <input type="textbox" placeholder="Enter title here..."  />
                    </label>
                    <label style={{ display: "block", marginBottom: "0.5rem", padding: "1rem", }}>
                        <input type="textbox" placeholder="Enter price here..." /> 
                    </label>
                    <label style={{ display: "block", marginBottom: "0.5rem", padding: "1rem", }}>
                        <input type="dropdown" placeholder="Choose category..." /> 
                    </label>
                    <label style={{ display: "block", marginBottom: "0.5rem", padding: "1rem", }}>
                        <input type="dropdown" placeholder="Condition" /> 
                    </label>
                    <label style={{ display: "block", marginBottom: "0.5rem", padding: "1rem", }}>
                        <input type="dropdown" placeholder="Enter description here... " /> 
                    </label>
                    <label style={{ display: "block", marginBottom: "0.5rem", padding: "1rem", }}>
                        <input type="file"
                        accept="image/*"
                        multiple
                        required
                        //onChange={handleFileChange}
                        placeholder="Add Photos" 
                        /> 
                    </label>
                </aside>
                <main 
                    style={{
                        flex: 1,
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "2rem",
                    }}
                >
                    
                    <div
                        
                        style={{
                            background: "white",
                            borderRadius: "12px",
                            padding: "1rem",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                        }}
                    >
                        <div
                            style={{
                                width: "100%",
                                height: "140px",
                                backgroundColor: "#d9d9d9",
                                borderRadius: "8px",
                            }}
                        ></div>

                        <div 
                            style={{
                                marginTop: "0.5rem",
                            }}
                        >
                            <h4></h4>
                            <p> </p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
        
    )
}