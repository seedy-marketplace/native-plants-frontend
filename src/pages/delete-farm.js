import React, { useState } from 'react';
import Layout from '../components/Layout';
import styles from '../components/Navbar.module.css'

function AddLab() {
    const [farmname, setFarmname] = useState("");
    const [email, setEmail] = useState("");

    async function postLab(e) {
        e.preventDefault();
        console.log("== Deleting:", farmname, " from farms");
    
        const res = await fetch('/api/accessDatabase',{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query_type: 'DELETE', //SELECT, INSERT, etc. (Field is required)
                table_name: 'farms', //Any table name here (Field is required)
                where: `farm_name = '${farmname}'`
            })
        })
    const resBody = await res.json();
        console.log(resBody);
    }

    return (
        <Layout>
        <form onSubmit={postLab} className={styles.container}>
            <div>
                <a>Farm Name</a>
                <input
                    type="text"
                    placeholder="Farm name"
                    value={farmname}
                    onChange={e => setFarmname(e.target.value)}
                    />
            </div>
            <div>
                <button>Delete selected</button>
            </div>
        </form>
        </Layout>
    );
}

export default AddLab;
