import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from './Header';

export default function PostProductPage() {

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
                    maxWidth: "1300px",
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
            </div>
        </div>
        
    )
}