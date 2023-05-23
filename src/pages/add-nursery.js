import React, { useState } from 'react';
import Layout from '../components/Layout';
import styles from '../components/Navbar.module.css'

function AddNursery() {
    const [nurseryname, setNurseryname] = useState("");
    const [email, setEmail] = useState("");
    const [number, setnumber] = useState("");
    const [lat, setLat] = useState("");
    const [long, setLong] = useState("");
    const [orgid, setOrgid] = useState("");

    async function postNursery(e) {
        e.preventDefault();
        if(!orgid){
            console.log("Need to have an organization")
            return
        }
        
        let point = '('+lat +',' + long+')'

        const res = await fetch('/api/accessDatabase', {
            method: 'POST',
            body: JSON.stringify( {
                table_name: "nurseries",
                query_type: "INSERT",
                columns: ['nursery_name','contact_email','contact_phone_number', 'nursery_location', 'managing_org'],
                values: [nurseryname, email, number, point, orgid],
                required_level: 1,
                required_org: orgid
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
        <form onSubmit={postNursery} className={styles.container}>
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
                <input
                    type="number"
                    placeholder="Organization ID"
                    onChange={e => setOrgid(e.target.value)}
                    value={orgid}
                    />
            </div>
            <div>
                <a>Email</a>
                <input
                    type="text"
                    placeholder="Nursery Contact Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    />
            </div>
            <div>
                <label htmlFor="phone">Enter Nursery phone number:</label>
                <input type="tel" 
                id="phone" 
                name="phone" 
                pattern="[0-9]{10,11}" 
                onChange={e => setnumber(e.target.value)}/>
                <small>Format: 1234567890</small><br/>
            </div>
            <div>
                <input
                    type="number"
                    placeholder="Latitude"
                    onChange={e => setLat(e.target.value)}
                    value={lat}
                    />
            </div>
            <div>
                <input
                    type="number"
                    placeholder="Longitude"
                    onChange={e => setLong(e.target.value)}
                    value={long}
                    />
            </div>
            <div>
                <button>Add Nursery</button>
            </div>
        </form>
        </Layout>
    );
}

export default AddNursery;
