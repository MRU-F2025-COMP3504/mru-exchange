import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@shared/contexts/AuthContext';
import { get, getByUser, show, create } from '@features/messaging/api/chat.ts';
import Header from './Header';
import { supabase } from '@shared/api';

interface Chat {
    id: number;
    created_at: string | null;
    user_id_1: string;
    user_id_2: string;
    visible: boolean | null;
}


interface UserMessage {
    id: number;
    chat_id: number;
    created_at: string;
    logged_message: string;
    sender_id: string;
    visible: boolean;
}

export default async function MessagingPage() {
    const { user } = useAuth();


    if(!user) return;
    try {
        const chats  = await getByUser({supabase_id: user.id});

        if(chats.ok) console.log("Chats: ", chats.data);
        else console.error("Error: ", chats.error);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }


    

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
        <Header/>

            <h2>These are your chats</h2>
            <div>
                
            </div>
        </div>
    )
}   