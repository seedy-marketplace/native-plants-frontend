import React, { useState } from 'react';
import Layout from '../components/Layout';

function AddNursery() {
    const [nurseryname, setNurseryname] = useState("");
    const [email, setEmail] = useState("");

    async function handleSignup(e) {
        e.preventDefault();
        console.log("== Logging in with these credentials:", username, password);
        const res = await fetch('/api/login', {
            method: "POST",
            body: JSON.stringify({ username, password }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const resBody = await res.json();
        if (res.status !== 200) {
            alert("Credentials invalid: " + resBody.err)
        } else {
            console.log("== resBody:", resBody);
            console.log("== document.cookie:", document.cookie);
            // window.localStorage.setItem('token', resBody.token)
        }
    }

    return (
        <Layout>
        <form onSubmit={handleSignup}>
            <div>
                <a>Nursery name</a>
                <input
                    type="text"
                    placeholder="nursery_name"
                    value={nurseryname}
                    onChange={e => setNurseryname(e.target.value)}
                    />
            </div>
            <div>
                <a>Email</a>
                <input
                    type="text"
                    placeholder="lab_email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    />
            </div>
            <div>
                <label for="phone">Enter Nursery phone number:</label>
                <input type="tel" id="phone" name="phone" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" />
                <small>Format: 123-456-7890</small><br></br>
            </div>
            <div>
                <button>Add Nursery</button>
            </div>
        </form>
        </Layout>
    );
}

export default AddNursery;