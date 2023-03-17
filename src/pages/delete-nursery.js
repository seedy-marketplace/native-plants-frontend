import React, { useState } from 'react';
import Layout from '../components/Layout';
import styles from '../components/Navbar.module.css'

function AddLab() {
    const [nurseryname, setNurseryname] = useState("");
    const [email, setEmail] = useState("");

    async function postLab(e) {
        e.preventDefault();
        console.log("== Deleting:", nurseryname, " from nurseries");
        const res = await fetch('/api/accessDatabase', {
            method: 'DELETE',
            body: JSON.stringify( {
                table_name: "nursery",
                query_type: "DELETE",
                where: `nursery_name='${nurseryname}'`
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
                <a>Nursery Name</a>
                <input
                    type="text"
                    placeholder="Nursery name"
                    value={nurseryname}
                    onChange={e => setNurseryname(e.target.value)}
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
