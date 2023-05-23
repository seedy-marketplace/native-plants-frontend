import React, { useState, useEffect } from 'react';
import fetch from 'isomorphic-unfetch';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import styled from '@emotion/styled'

const WelcomeMssgStyle = styled.div`
display: flex;
padding: 20px;
justify-content: center;

.welcome-mssg-text {
    width: 90%;
    background: #e9e3f4;
    padding: 2%;
    padding-left: 5%;
    padding-right: 5%;
    display: flex;
    flex-direction: column;
}

p {
    margin: 0;
    font-size: 22px;
    margin-bottom: 20px;
    
}
`

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
                    <h1>Welcome to Seedy!</h1>
                </div>
            </div>
            <WelcomeMssgStyle>
                <div className="welcome-mssg-text">
                    <p> 
                        Welcome to Seedy, the online database for the coastal PNW native plants 
                        materials marketplace. This database was developed by Oregon State 
                        University students as their Capstone project. 
                    </p>
                    <p>  
                        There is no retail functionality within; I facilitate trading among open 
                        space land managers only. If you feel you belong here you can sign up and 
                        an administrator will consider your request. 
                    </p>
                    <p>
                        Questions? Email <a href="mailto:david_thomson@fws.gov">david_thomson@fws.gov</a>.
                    </p>
                    
                </div>
            </WelcomeMssgStyle>
            
        </Layout>
    );
}
