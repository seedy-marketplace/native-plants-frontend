import React, { useState } from 'react';
import Layout from '../components/Layout';
import styles from '../components/Navbar.module.css'

function AddLab() {
    const [id, setID] = useState("");
    const [code, setCode] = useState("");

    async function postLab(e) {
        e.preventDefault();
    
            const res = await fetch('/api/accessDatabase', {
                method: 'DELETE',
                body: JSON.stringify( {
                    table_name: "land_manager_want_list",
                    query_type: "DELETE",
                    where: `wanted_list_id='${id}'`
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
                <a>ID of to be deleted listing</a>
                <input
                    type="text"
                    placeholder="ID"
                    value={id}
                    onChange={e => setID(e.target.value)}
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
