import React, { useState, useEffect } from 'react';
import fetch from 'isomorphic-unfetch';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function Home() {
    const [user, setUser] = useState({});
    const router = useRouter()

    useEffect(() => {
        async function fetchData() {
            const res = await fetch('/api/user');
            const body = await res.json();
            setUser(body);
        }
        fetchData();
    }, []);

    function goToGetFarms(){
        router.push('/get-farms')
    }

    return (
        <Layout>
            <div className="welcome-container">
                <div className="welcome-text">
                    <h1>Welcome to the PNW Plant Marketplace!</h1>
                </div>
            </div>
            
        </Layout>
    );
}
