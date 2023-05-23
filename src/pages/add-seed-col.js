//date, method of identifiction (3 types), cofidence of ID 1-3, cleaing effectiveness 1 of 4 types, cleaned weight
import React, { useState } from 'react';
import Layout from '../components/Layout';
import styles from '../components/Navbar.module.css'
import Link from 'next/link';

function SeedCol() {
    // const [cleanWeight, setCleanWeight] = useState("");
    // const [speccode, setSpecCode] = useState("");
    // const [date, setDate] = useState("");
    // const [method, setMethod] = useState("");
    // const [siteName, setSitename] = useState("");
    // const [confidence, setConfidence] = useState("");
    // const [clean, setClean] = useState("");
    // const [username, setUserName] = useState("");
    // const [idname, setIdName] = useState("");
    // const [desc, setDesc] = useState("");
    const [collecteddate, setCollecteddate] = useState("");
    const [colprovenance, setColprovenance] = useState("");
    const [idmethod, setIdmethod] = useState("");
    const [idpersonname, setIdpersonname] = useState("");
    const [idconfidence, setIdconfidence] = useState("");
    const [cleaningeffectiveness, setCleaningeffectiveness] = useState("");
    const [cleanedweight, setCleanedweight] = useState("");
    const [owningorg, setOwningorg] = useState("");
    const [fortrade, setFortrade] = useState("");
    const [colspeciesid, setColspeciesid] = useState("");
    const [lat, setLat] = useState("");
    const [long, setLong] = useState("");
    const [colcontactuser, setColcontactuser] = useState("");

    async function getData(){
        const reqData = {}
        let res = await fetch('/api/accessDatabase',{
            method: 'SEARCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                query_type: "SELECT",
                table_name: "plant",
                where: `species_code='${speccode}'`
            }
        })
        if (res.status >= 200 && res.status < 400) {
            reqData.plantData = await res.json();
            console.log(reqData.plantData);
        } else {
            alert("Error: \n" + reqData.error)
            return {plantData:NULL}
        }

    
        res = await fetch('/api/accessDatabase',{
            method: 'SEARCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                query_type: "SELECT",
                table_name: "site",
                where: `collection_site_name='${siteName}'`
            }
        })
        if (res.status >= 200 && res.status < 400) {
            reqData.siteData = await res.json();
            console.log(reqData.siteData);
        } else {
            alert("Error: \n" + reqData.error)
            return {siteData:NULL, plantData:NULL}
        }
        return reqData
    }
    
    async function postSeedCol(e) {
        e.preventDefault();
        //const data = await getData()
        //if (idname == "")
        //    setIdName("NULL")
        let point = '('+lat +',' + long+')'
        const res = await fetch('/api/accessDatabase', {
            method: 'POST',
            body: JSON.stringify( {
                table_name: "seed_collection",
                query_type: "INSERT",
                columns: ['collected_date', 'col_provenance', 'id_method', 'id_person_name', 'id_confidence', 'cleaning_effectiveness', 'cleaned_weight', 'owning_org', 'for_trade', 'col_species_id', 'col_location', 'col_contact_user'],//['col_species_code', 'cleaning_effectiveness', 'cleaned_weight', 'id_confidence','collected_date', 'id_method', 'col_provenance', 'owner_name', 'id_person_name'],
                values: [collecteddate, colprovenance, idmethod, idpersonname, idconfidence, cleaningeffectiveness, cleanedweight, owningorg, fortrade, colspeciesid, collocation, colcontactuser]//[speccode, clean, cleanWeight, confidence, date, method, data.siteData.data.data[0].site_id, username, idname]
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
        <form onSubmit={postSeedCol} className={styles.container}>
            <div>
                <input
                    type="text"
                    placeholder="Username of contact person"
                    onChange={e => setColcontactuser(e.target.value)}
                    value={colcontactuser}
                    />
            </div>
            <div>
                <input
                    type="number"
                    placeholder="Organization ID"
                    onChange={e => setOwningorg(e.target.value)}
                    value={owningorg}
                    />
            </div>
            <div>
                <input
                    type="number"
                    placeholder="Species ID"
                    onChange={e => setColspeciesid(e.target.value)}
                    value={colspeciesid}
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
            <p>Collection Date (format YYYY-MM-DD you DO type the dashes)</p>
                <input
                    type="text"
                    placeholder="Collection Date"
                    onChange={e => setCollecteddate(e.target.value)}
                    value={collecteddate}
                    />
            </div>
            <div>
                <input
                    type="number"
                    placeholder="Site ID"
                    onChange={e => setColprovenance(e.target.value)}
                    value={colprovenance}
                    />
            </div>
            
            
            
            <div>
            <p>User name of person who identified the species. (leave blank if they are not a user)</p>
                <input
                    type="text"
                    placeholder="Name of Identifier"
                    onChange={e => setIdpersonname(e.target.value)}
                    value={idpersonname}
                    />
            </div>
            <p>How was the seed Identified</p>
            <label className="container">Dichotomous key
                <input type="radio" name="key" value="GK" onClick={e => setIdmethod(e.target.value)}/>
                <span className="checkmark"></span>
            </label>
            <label className="container">Diagnostic Characteristics
                <input type="radio" name="key" value="GC" onClick={e => setIdmethod(e.target.value)}/>
                <span className="checkmark"></span>
            </label>
            <label className="container">Gist
                <input type="radio" name="key" value="GI" onClick={e => setIdmethod(e.target.value)}/>
                <span className="checkmark"></span>
            </label>
            <div>
                <input
                    type="number"
                    placeholder="Cofidence of Identification (scale of 1 to 3)"
                    onChange={e => setIdconfidence(e.target.value)}
                    value={idconfidence}
                    />
            </div>
            <div className="radios">
                <p>Please rate how well the seed was cleaned</p>
            <label className="container">Great
                <input type="radio" name="rate" value="a" onClick={e => setCleaningeffectiveness(e.target.value)}/>
                <span className="checkmark"></span>
            </label>
            <label className="container">Good
                <input type="radio" name="rate" value="b" onClick={e => setCleaningeffectiveness(e.target.value)}/>
                <span className="checkmark"></span>
            </label>
            <label className="container">Fair
                <input type="radio" name="rate" value="c" onClick={e => setCleaningeffectiveness(e.target.value)}/>
                <span className="checkmark"></span>
            </label>
            <label className="container">None
                <input type="radio" name="rate" value="z" onClick={e => setCleaningeffectiveness(e.target.value)}/>
                <span className="checkmark"></span>
            </label>
            </div>
            <div>
                <input
                    type="number"
                    placeholder="Cleaned Weight(pounds"
                    onChange={e => setCleanedweight(e.target.value)}
                    value={cleanedweight}
                    />
            </div>
            
            <div>
                <button type="submit">Add Seed Collection</button>
            </div>
        </form>
        </Layout>
    );
}

export default SeedCol;
