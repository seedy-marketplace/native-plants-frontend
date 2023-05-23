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
const WelcomeHeader = styled.div`

// /* Used to display the camas flower image behind the welcome message */
// width: 100%;
// background-image: url("../components/camas.jpg");
// /* background-position: center, center; */
// background-position: 75% 33%;
// /* padding: 30px 0; */
// padding: 30px 0;

// /* Used to add white background behind welcome message */
// .welcome-text {
//   background-color: rgba(255,255,255,0.7);
//   height: 100%;
// }
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
            <WelcomeHeader>
                <div className="welcome-container">
                    <div className="welcome-text">
                        <h1>Welcome to Seedy!</h1>
                    </div>
                </div>
            </WelcomeHeader>
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
