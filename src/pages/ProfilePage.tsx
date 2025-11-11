import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from './Header';
import { supabase } from '@shared/api';

export default function ProfilePage() {
    
    return (
            <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
    
            <Header/>
            </div>
    )
}