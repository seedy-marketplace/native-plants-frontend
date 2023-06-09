import React, { useState } from 'react';
import Layout from '../components/Layout';
import styles from '../components/Navbar.module.css';
import Link from 'next/link';
import useAPIRequest from '../hooks/useAPIRequest';

function Production() {
    const [nurseryname, setNurseryname] = useState("");
    const [datestarted, setDatestarted] = useState("");
    const [yearsincontainer, setYearsincontainer] = useState("");
    const [containertype, setContainertype] = useState("");
    const [quantityavailable, setQuantityavailable] = useState("");
    const [yearready, setYearready] = useState("");
    const [prodcontactuser, setProdcontactuser] = useState("");
    const [extranurserynotes, setExtranurserynotes] = useState("");
    const [prodspecies, setProdspecies] = useState("");
    
    
    async function postProduction(e) {
        e.preventDefault();
        
        const orgres = await fetch('/api/accessDatabase', {
            method: 'SEARCH',
            body: JSON.stringify({
                query_type: "SELECT",
                table_name: "nurseries",
                columns: ['managing_org'],
                where: `nursery_name='${nurseryname}'`
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const orgBody = await orgres.json()
        console.log("Org Body: ", orgBody)
        let org_id
        if(!orgBody.data){
            console.log("error getting org with ID")
            return
        }else{
            org_id = orgBody.data.data[0].proj_org
        }
        console.log("org_id: ", org_id)


        const res = await fetch('/api/accessDatabase', {
            method: 'POST',
            body: JSON.stringify( {
                table_name: "land_manager_want_list",
                query_type: "INSERT",
                columns: ['nursery_name','date_started','years_in_container','container_type','quantity_available','year_ready','prod_contact_user','extra_nursery_notes','production_id','prod_species'],
                values: [nurseryname,datestarted,yearsincontainer,containertype,quantityavailable,yearready,prodcontactuser,extranurserynotes,productionid,prodspecies],
                required_level: 1,
                required_org: org_id
                
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const resBody = await res.json();
        console.log(resBody);
        if (res.status < 200 || res.status >= 400) {
            alert("Error: \n" + resBody.error)
        }else{
            alert("Message from database: " + resBody.data.result)
        }
    }

    

    return (
        <Layout>
        <form onSubmit={postProduction} className={styles.container}>
            <div>
                <input
                    type="text"
                    placeholder="Nursery Name"
                    onChange={e => setNurseryname(e.target.value)}
                    value={nurseryname}
                    />
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Date Started     format: YYYY-MM-DD (with dashes)"
                    onChange={e => setDatestarted(e.target.value)}
                    value={datestarted}
                    />
            </div>
            <div>
                <input
                    type="number"
                    placeholder="Years in Container"
                    onChange={e => setYearsincontainer(e.target.value)}
                    value={yearsincontainer}
                    />
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Container Type"
                    onChange={e => setContainertype(e.target.value)}
                    value={containertype}
                    />
            </div>
            <div>
                <input
                    type="number"
                    placeholder="Quantity Available"
                    onChange={e => setQuantityavailable(e.target.value)}
                    value={quantityavailable}
                    />
            </div>
            <div>
                <input
                    type="number"
                    placeholder="Year Ready"
                    onChange={e => setYearready(e.target.value)}
                    value={yearready}
                    />
            </div>
            <div>
                <input
                    type="text"
                    placeholder="User Contact"
                    onChange={e => setProdcontactuser(e.target.value)}
                    value={prodcontactuser}
                    />
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Extra Nursery Notes"
                    onChange={e => setExtranurserynotes(e.target.value)}
                    value={extranurserynotes}
                    />
            </div>
            <div>
                <input
                    type="number"
                    placeholder="Species ID"
                    onChange={e => setProdspecies(e.target.value)}
                    value={prodspecies}
                    />
            </div>
            
            <div>
                <button>Add Request</button>
            </div>
        </form>
        </Layout>
    );
}

export default Production;
