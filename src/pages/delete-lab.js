import React, { useState } from 'react';
import Layout from '../components/Layout';
import styles from '../components/Navbar.module.css'

function AddLab() {
    const [labname, setLabname] = useState("");
    const [email, setEmail] = useState("");

    async function postLab(e) {
        e.preventDefault();
        console.log("== Deleting:", labname, " from labs");
        
        const res = await fetch('/api/accessDatabase', {
            method: 'DELETE',
            body: JSON.stringify( {
                table_name: "lab",
                query_type: "DELETE",
                where: `lab_name ='${labname}'`
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const resBody = await res.json();
        console.log(resBody);
    }

    return (
        <Layout>
        <form onSubmit={postLab} className={styles.container}>
            <div>
                <a>Lab Name</a>
                <input
                    type="text"
                    placeholder="Lab name"
                    value={labname}
                    onChange={e => setLabname(e.target.value)}
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
