import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@shared/contexts';
import { get, getByUser, show, create } from '@features/messaging/api/chat.ts';
import Header from './Header';
import { supabase } from '@shared/api';
import { getUser } from '@shared/api/auth.ts';

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

export default function MessagingPage() {
    const { user } = useAuth();


    if(!user.ok) return;

    void getByUser({ supabase_id: user.data.id })
      .then((chats) => {
        if(chats.ok) console.log("Chats: ", chats.data);
        else console.error("Error: ", chats.error);
      });


    

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
        <Header/>

            <h2>These are your chats</h2>
            <div>
                
            </div>
        </div>
    )
}   