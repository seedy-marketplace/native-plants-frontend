import React, { useState } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { data: session } = useSession();

    async function handleLogin(e) {
        e.preventDefault();
        console.log("== Logging in with these credentials:", username, password);
        signIn();
    }

    return (
        <div className="loginContainer">
            <div>
                  <button id="loginButton" onClick={handleLogin}><a>Login</a></button>
            </div>
            <div>
                <Link href="/sign-up">
                    <a className="signupButton">Sign up</a>
                </Link>
            </div>
        </div>
    );
}

export default Login;
