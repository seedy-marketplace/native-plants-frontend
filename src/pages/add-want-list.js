import React, { useState } from 'react';
import Layout from '../components/Layout';
import styles from '../components/Navbar.module.css';
import Link from 'next/link';
import useAPIRequest from '../hooks/useAPIRequest';

function Sites() {
    const [date, setDate] = useState("");
    const [owner, setOwner] = useState("");
    const [notes, setNotes] = useState("");
    const [quantity, setQuantity] = useState("");
    const [speciesid, setSpeciesid] = useState("");
    const [projid, setProjid] = useState("");
    
    async function postWant(e) {
        e.preventDefault();
        const res = await fetch('/api/accessDatabase', {
            method: 'POST',
            body: JSON.stringify( {
                table_name: "land_manager_want_list",
                query_type: "INSERT",
                columns: ['posted_date','posted_by','notes','wanted_quantity','want_species_id'],
                values: [date, owner, notes, quantity, speciesid],
                has_point: true
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
        <form onSubmit={postWant} className={styles.container}>
            <div>
            <p>Enter your User Name</p>
                <input
                    type="text"
                    placeholder="User Name"
                    onChange={e => setOwner(e.target.value)}
                    value={owner}
                    />
            </div>
            <div>
            <p>For Project</p>
                <input
                    type="number"
                    placeholder="Project ID"
                    onChange={e => setProjid(e.target.value)}
                    value={projid}
                    />
            </div>
            <div>
            <p>Today&apos;s Date (YYYY-MM-DD DO type the dashes)</p>
                <input
                    type="text"
                    placeholder="Date"
                    onChange={e => setDate(e.target.value)}
                    value={date}
                    />
            </div>
            <div>
            <p>What is the Species Code of the plant you want</p>
                <input
                    type="number"
                    placeholder="Species ID"
                    onChange={e => setSpeciesid(e.target.value)}
                    value={speciesid}
                    />
            </div>
            <ul>
            <li>
            <Link href="/get-plants">
                <a target="_blank">Click here to see all plants/codes in new tab</a>
            </Link>
            </li>
            </ul>
            <div>
            <p>How much do you want (pounds)</p>
                <input
                    type="text"
                    placeholder="Quantity"
                    onChange={e => setQuantity(e.target.value)}
                    value={quantity}
                    />
            </div>
            <div>
            <p>Any notes (short sentences)</p>
                <input
                    type="text"
                    placeholder="Notes"
                    onChange={e => setNotes(e.target.value)}
                    value={notes}
                    />
            </div>
            <div>
                <button>Add Request</button>
            </div>
        </form>
        </Layout>
    );
}

export default Sites;
