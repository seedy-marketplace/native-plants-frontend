import React, { useState } from 'react';
import Layout from '../components/Layout';
import styles from '../components/Navbar.module.css'

function AddLab() {
    const [tablename, setTablename] = useState("");
    const [column, setColumn] = useState("");
    const [field, setField] = useState("");

    async function postLab(e) {
        e.preventDefault();
        console.log("== Deleting:", field, " from ", tablename);
        const res = await fetch('/api/accessDatabase', {
            method: 'DELETE',
            body: JSON.stringify( {
                table_name: [tablename],
                query_type: "DELETE",
                where: `${column}='${field}'`
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
                <a>Table Name</a>
                <input
                    type="text"
                    placeholder="Table name"
                    value={tablename}
                    onChange={e => setTablename(e.target.value)}
                    />
            </div>
            <div>
                <a>Collumn name</a>
                <input
                    type="text"
                    placeholder="Column"
                    value={column}
                    onChange={e => setColumn(e.target.value)}
                    />
            </div>
            <div>
                <a>Field name</a>
                <input
                    type="text"
                    placeholder="field_name"
                    value={field}
                    onChange={e => setField(e.target.value)}
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
