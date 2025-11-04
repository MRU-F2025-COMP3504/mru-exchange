import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';

    export default function Footer() {

        const navigate = useNavigate();

        return (
            <div className='mt-4 text-center'>
                <Link
                to='/contact-us'
                className='text-sm text-indigo-600 hover:text-indigo-800 hover:underline'
                >
                Contact Us
                </Link>
            </div>
    )
    }