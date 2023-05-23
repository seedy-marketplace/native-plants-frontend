//archived file
import React, { useState } from 'react';
import Layout from '../components/Layout';
import styles from '../components/Navbar.module.css'

function AddLab() {
    const [labname, setLabname] = useState("");
    const [email, setEmail] = useState("");
    const [labnumber, setLabnumber] = useState("");

    async function postLab(e) {
        e.preventDefault();
        console.log("== Adding farm with these parameters:", labname, email);
        
        const res = await fetch('/api/accessDatabase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( {
                table_name: "lab",
                query_type: "INSERT",
                columns: ['lab_name','contact_email','contact_phone_num'],
                values: [labname, email, labnumber ? labnumber : null]
            })
        })
        const resBody = await res.json();
        console.log(resBody);
    }

    return (
        <Layout>
        <form onSubmit={postLab} className={styles.container}>
            <div>
                <a>Lab name</a>
                <input
                    type="text"
                    placeholder="lab_name"
                    value={labname}
                    onChange={e => setLabname(e.target.value)}
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
                <label htmlFor="phone">Enter Lab phone number:</label>
                <input type="tel" 
                id="phone" 
                name="phone" 
                pattern="[0-9]{10,11}" 
                onChange={e => setLabnumber(e.target.value)}/>
                <small>Format: 1234567890</small><br/>
            </div>
            <div>
                <button>Add Lab</button>
            </div>
        </form>
        </Layout>
    );
}

export default AddLab;
