import React, { useState } from 'react';
import Layout from '../components/Layout';
import styles from '../components/Navbar.module.css'
import react from 'react';

function Signup() {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [website, setWebsite] = useState("");
    const [bio, setBio] = useState("");
    const [number, setNumber] = useState("");
    const [valid, setValid] = React.useState(true);
    const [organizationID, setOrganizationID] = useState("")

    async function handleSignup(e) {

        e.preventDefault();
        if (username && name && email && number && password) {
            setValid(true);
            // e.preventDefault();
            const usertype = 0
            console.log("== Adding user with these parameters:", username, email, password, website, bio);
        
            const res = await fetch('/api/registerUser', {
                method: 'POST',
                body: JSON.stringify({
                    username: username,
                    email: email,
                    name: name,
                    password: password,
                    bio: bio,
                    phone_number: number,
                    website: website,
                    related_org_id: organizationID ? organizationID : null
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const resBody = await res.json();
            console.log(resBody);
            if (res.status < 200 || res.status >= 400) {
                alert("Error: \n" + resBody.error)
            }
            console.log("== document.cookie:", document.cookie);
            location.replace("/");
            
        } else {
            setValid(false);
        }
    }

    return (
        <Layout>
            {valid ? null : <InvalidIndicator />}
            <form onSubmit={handleSignup} className={styles.container}>
                <div className="SignupInputContainer">
                    <a>Name</a>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        className={!name && !valid ? "i_signupInput" : "v_signupInput"}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div className="SignupInputContainer">
                    <a>Username</a>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        className={!username && !valid ? "i_signupInput" : "v_signupInput"}
                        onChange={e => setUsername(e.target.value)}
                    />
                </div>
                <div className="SignupInputContainer">
                    <a>Email</a>
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        className={!email && !valid ? "i_signupInput" : "v_signupInput"}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div className="SignupInputContainer">
                    <a>Password</a>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        className={!password && !valid ? "i_signupInput" : "v_signupInput"}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <div className="SignupInputContainer">
                    <label htmlFor="phone">Phone number</label>
                    <input 
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="Format: 1234567890"
                        pattern="[0-9]{10,11}"
                        className={!number && !valid ? "i_signupInput" : "v_signupInput"}
                        onChange={e => setNumber(e.target.value)}
                    />
                </div>
                <div className="SignupInputContainer">
                    <a>Website (optional)</a>
                    <input
                        type="text"
                        placeholder="website"
                        value={website}
                        className={styles.inputs}
                        onChange={e => setWebsite(e.target.value)}
                    />
                </div>
                <div className="SignupInputContainer">
                    <a>Organization ID (optional)</a>
                    <input
                        type="number"
                        placeholder="organization id"
                        value={organizationID}
                        className={styles.inputs}
                        onChange={e => setOrganizationID(e.target.value)}
                    />
                </div>
                <div className="SignupInputContainer">
                    <label htmlFor="bio">Bio (optional)</label>
                    <textarea className={styles.textareas} id="bio" rows="4" cols="50" onChange={e => setBio(e.target.value)}>Enter Bio</textarea>
                    <br></br>
                </div>
                <div>
                    <button id="signupButton" >Sign Up</button>
                </div>
            </form>
        </Layout>
    );
}

const InvalidIndicator = () => (
    <h3 id="invalidSignupHeader">Please complete all required fields</h3>
);

export default Signup;
