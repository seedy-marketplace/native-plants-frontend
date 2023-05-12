import React, { useState } from 'react';
import Layout from '../components/Layout';
import styles from '../components/Navbar.module.css'

function AddLab() {
    const [comname, setComname] = useState("");

    async function postPlant(e) {
        e.preventDefault();
        console.log("== Deleting:", comname, " from plants");

        const res = await fetch('/api/accessDatabase', {
            method: 'DELETE',
            body: JSON.stringify( {
                table_name: "plant",
                query_type: "DELETE",
                where: `common_name='${comname}'`
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
        <form onSubmit={postPlant} className={styles.container}>
            <div>
                <a>Plant Common Name</a>
                <input
                    type="text"
                    placeholder="Common name"
                    value={comname}
                    onChange={e => setComname(e.target.value)}
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
