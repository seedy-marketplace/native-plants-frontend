//date, method of identifiction (3 types), cofidence of ID 1-3, cleaing effectiveness 1 of 4 types, cleaned weight
import React, { useState } from 'react';
import Layout from '../components/Layout';
import styles from '../components/Navbar.module.css'
import Link from 'next/link';
import { useSession } from 'next-auth/react';

function FarmAmp() {
    const [farmName, setFarmName] = useState("");
    const [yearSown, setYearSown] = useState("");
    const [fieldSize, setFieldSize] = useState("");
    const [estHarvest, setEstHarvest] = useState("");
    const [yearHarvest, setYearHarvest] = useState("");
    const [seedGen, setSeedGen] = useState("");
    const [notes, setNotes] = useState("");
    const [ancestorcolid, setAncestorcolid] = useState("");
    const [cleanedweight, setCleanedweight] = useState("");
    const [cleaningeffectiveness, setCleaningeffectiveness] = useState("");
    const [ampspeciesid, setAmpspeciesid] = useState("");
    const { data: session, status} = useSession()

    async function postFarmAmp(e){
        e.preventDefault()
        if(status !== "authenticated"){
            alert("Error: Not logged in")
            return
        }
        console.log("Session: ", session)
        if(session.user.user_level < 2){
            if(session.user.related_org_id == null){
                alert("Error: Need to be part of an organization")
                return
            }

        }
//             columns: ['farm_name', 'year_sown', 'field_size', 'estimated_harvest_per_year','year_harvested', 'generation_of_seed', 'owner_of_harvest', 'extra_farm_notes','ancestor_col_id', 'cleaned_weight', 'cleaning_effectiveness', 'amp_contact_user', 'amp_species_id']
        let res = await fetch('/api/accessDatabase',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query_type: 'INSERT', //SELECT, INSERT, etc. (Field is required)
                table_name: 'farm_amplification', //Any table name here (Field is required)
                columns: ['farm_name', 'amp_species_id', 'year_sown', 'year_harvested','estimated_harvest_per_year', 'field_size', 'generation_of_seed', 'cleaned_weight', 'cleaning_effectiveness', 'ancestor_col_id', 'extra_farm_notes'], //array of specific columns to use (Required by INSERT and UPDATE, defaults to * if missing)
                values: [farmName, ampspeciesid, yearSown ? yearSown : null, yearHarvest ? yearHarvest : null, estHarvest ? estHarvest : null, fieldSize ? fieldSize : null, seedGen ? seedGen : null, cleanedweight ? cleanedweight : null, cleaningeffectiveness ? cleaningeffectiveness : null, ancestorcolid ? ancestorcolid : null, notes],//array of values for INSERT and UPDATE requests (Required by INSERT and UPDATE)
                required_level: 1,
                required_org: session.user.related_org_id
            })
        })
        const resBody = await res.json();
        console.log(resBody);
        if (res.status < 200 || res.status >= 400) {
            alert("Error: \n" + resBody.error)
        }else{
            alert("Message from database: " + resBody.data.result)
        }
    }

    // async function getData(){
    //     const reqData = {}
        
    //     let res = await fetch('/api/accessDatabase',{
    //         method: 'SEARCH',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             query_type: 'SELECT', //SELECT, INSERT, etc. (Field is required)
    //             table_name: 'users', //Any table name here (Field is required)
    //             where: `user_name='${harvestOwner}'`
    //         })
    //     })
    //     if (res.status >= 200 && res.status < 400) {
    //         console.log("Found the owner")
    //         reqData.owner = await res.json();
    //         console.log(reqData.owner);
    //     } else {
    //         alert("Error: \n" + reqData.error)
    //         return {owner:null}
    //     }

       
    //     res = await fetch('/api/accessDatabase',{
    //         method: 'SEARCH',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             query_type: 'SELECT', //SELECT, INSERT, etc. (Field is required)
    //             table_name: 'farms', //Any table name here (Field is required)
    //             where: `farm_name='${farmName}'`
    //         })
    //     })
    //     if (res.status >= 200 && res.status < 400) {
    //         reqData.farmData = await res.json();
    //         console.log(reqData.farmData);
    //     } else {
    //         alert("Error: \n" + reqData.error)
    //         return {farmData:null, ownerData:null}
    //     }
    //     return reqData
    // }
    
    // async function postFarmAmp(e) {
    //     e.preventDefault();

    //     const orgres = await fetch('/api/accessDatabase', {
    //         method: 'SEARCH',
    //         body: JSON.stringify({
    //             query_type: "SELECT",
    //             table_name: "farms",
    //             columns: ['managing_org_id'],
    //             where: `farm_name='${farmName}'`
    //         }),
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     })
    //     const orgBody = await orgres.json()
    //     console.log("Org Body: ", orgBody)
    //     let org_id
    //     if(!orgBody.data){
    //         console.log("error getting org with ID")
    //         return
    //     }else{
    //         org_id = orgBody.data.data[0].managing_org_id
    //     }
    //     console.log("org_id: ", org_id)

    //     const data = await getData()
    //     if ((!data.owner)||(!data.farmData))
    //         return 
    //     const res = await fetch('/api/accessDatabase', {
    //         method: 'POST',
    //         body: JSON.stringify( {
    //             table_name: "farm_amplification",
    //             query_type: "INSERT",
    //             columns: ['farm_name', 'year_sown', 'field_size', 'estimated_harvest_per_year','year_harvested', 'generation_of_seed', 'owner_of_harvest', 'extra_farm_notes','ancestor_col_id', 'cleaned_weight', 'cleaning_effectiveness', 'amp_contact_user', 'amp_species_id'],
    //             values: [farmName, yearSown, fieldSize, estHarvest, yearHarvest, seedGen, harvestOwner, notes, ancestorcolid ? ancestorcolid : null, cleanedweight, cleaningeffectiveness, ampcontactuser, ampspeciesid],
    //             required_level: 1,
    //             required_org: org_id
    //         }),
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     })
    //     const resBody = await res.json();
    //     console.log(resBody);
    //     if (res.status < 200 || res.status >= 400) {
    //         alert("Error: \n" + resBody.error)
    //     }else{
    //         alert("Message from database: " + resBody.data.result)
    //     }
    //}

    return (
        <Layout>
        <form onSubmit={postFarmAmp} className={styles.container}>
        <div>
        <p>Farm Name <span style={{color:"#dd0000"}}>*</span></p>
                <input
                    type="text"
                    placeholder="Farm Name"
                    onChange={e => setFarmName(e.target.value)}
                    value={farmName}
                    required
                    />
            </div>
            <ul>
            <li>
            <Link href="/get-farms">
                <a target="_blank">Click here to see all farms in new tab</a>
            </Link>
            </li>
            </ul>
            <div>
            <p>Plant Species ID <span style={{color:"#dd0000"}}>*</span></p>
                <input
                    type="number"
                    placeholder="Species ID"
                    onChange={e => setAmpspeciesid(e.target.value)}
                    value={ampspeciesid}
                    required
                    />
            </div>
            <div>
            <p>Year seed was sown</p>
                <input
                    type="number"
                    placeholder="Year Sown"
                    onChange={e => setYearSown(e.target.value)}
                    value={yearSown}
                    />
            </div>
            <div>
            <p>Year Harvested</p>
                <input
                    type="text"
                    placeholder="Year Harvested"
                    onChange={e => setYearHarvest(e.target.value)}
                    value={yearHarvest}
                    />
            </div>
            <div>
                <p>Estimated harvest weight (pounds)</p>
                <input
                    type="number"
                    placeholder="Estimated harvest"
                    onChange={e => setEstHarvest(e.target.value)}
                    value={estHarvest}
                    />
            </div>
            <div>
            <p>Field Size in acres (whole number)</p>
                <input
                    type="text"
                    placeholder="Field Size"
                    onChange={e => setFieldSize(e.target.value)}
                    value={fieldSize}
                    />
            </div>
            
            
            <p>Generation of Seed</p>
                <input
                    type="text"
                    placeholder="Generation"
                    onChange={e => setSeedGen(e.target.value)}
                    value={seedGen}
                    />
            
            <div>
            <p>Cleaned Weight (pounds)</p>
                <input
                    type="number"
                    placeholder="Generation"
                    onChange={e => setCleanedweight(e.target.value)}
                    value={cleanedweight}
                    />
            </div>
            <div>
            <p>Cleaning Effectiveness(a,b,c, etc.)</p>
                <input
                    type="text"
                    maxLength="1"
                    placeholder="Cleaning Effectiveness"
                    onChange={e => setCleaningeffectiveness(e.target.value)}
                    value={cleaningeffectiveness}
                    />
            </div>
            
            <div>
            <p>Ancestor Seed Collection ID</p>
                <input
                    type="number"
                    placeholder="Ancestor Collection ID"
                    onChange={e => setAncestorcolid(e.target.value)}
                    value={ancestorcolid}
                    />
            </div>

            <p>Any Extra notes to add</p>
            <div>
                <input
                    type="text"
                    placeholder="Extra Notes"
                    onChange={e => setNotes(e.target.value)}
                    value={notes}
                    />
            </div>
            <div>
                <button type="submit">Add Farm Amplification</button>
            </div>
        </form>
        </Layout>
    );
}

export default FarmAmp;
