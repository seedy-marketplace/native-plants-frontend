import React, { useState , useEffect} from 'react';
import Layout from '../components/Layout';
import '../components/Navbar'

import useAPIRequest from '../hooks/useAPIRequest';

import TableView from '../components/TableView';
import { SP } from 'next/dist/shared/lib/utils';

function NurseProduction() {
    const [nurseName, setNurseName] = useState("");
    const [comname, setComname] = useState("");
    const [genus, setGenus] = useState("");
    const [species, setSpecies] = useState("");
    const [email, setEmail] = useState("");
    const [nurseProList, setNurseProList] = useState([]);
    const [loaded, setLoaded] = useState(0);


    // const [res, loading, error] = useAPIRequest(`https://native-plants-backend.herokuapp.com/i/INSERT INTO rev2.farms(farm_name) VALUES (%s) /${farmname_to_send}`, "POST");
    // const [res, loading, error] = useAPIRequest(`https://native-plants-backend.herokuapp.com/q/SELECT * FROM rev2.farms`, "GET");
    async function getNurseProduction(e) {
        if (e) { e.preventDefault(); }

        var onVar = 'nurseries.nursery_name = NP.nursery_name';
        if (nurseName) {
            onVar += ` AND nurseries.nursery_name iLIKE '%%${nurseName}%%'`;
        }
        onVar += ' INNER JOIN rev2.plant on plant.species_id = NP.prod_species';
        if (comname) {
            onVar += ` AND plant.common_name iLIKE '%%${comname}%%'`;
        }
        if (genus) {
            onVar += ` AND plant.genus iLIKE '%%${genus}%%'`;
        }
        if (species) {
            onVar += ` AND plant.species iLIKE '%%${species}%%'`;
        }

        const res = await fetch('/api/accessDatabase',
            {
                method: 'SEARCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query_type: 'SELECT', //SELECT, INSERT, etc. (Field is required)
                    table_name: 'nursery_production NP', //Any table name here (Field is required)
                    columns: ['plant.genus', 'plant.species','plant.species_id', 'plant.common_name', 'NP.date_started', 'NP.years_in_container', 'NP.container_type', 'NP.quantity_available', 'NP.year_ready', 'NP.extra_nursery_notes', 'nurseries.nursery_name', 'nurseries.contact_email', 'nurseries.contact_phone_number', 'nurseries.nursery_location'],
                    column_names: ['Genus', 'Species', 'Species ID','Common Name', 'Date Started', 'Years in Container', 'Container Type', 'Quantity Available', 'Year Ready', 'Notes', 'Nursery Name', 'Email', 'Phone Number', 'Location'],
                    join_string: onVar ? ' INNER JOIN rev2.nurseries ON ' + onVar : null
                })
            }
        )
        const resBody = await res.json();
        console.log(resBody);
        if (res.status >= 200 && res.status < 400) {
            setNurseProList(resBody)
            console.log("nurseproddata");
            console.log(nurseProList);
        } else {
            alert("Error: \n" + resBody.error)
        }
    }

    if (loaded) {
        useEffect(() => { getNurseProduction() })
        setLoaded(1);
    }

    return (
        <Layout>
            <form onSubmit={getNurseProduction}>
                <div>
                <a>Type here to filter, leave blank for no filter</a>
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Search by farm name"
                        onChange={e => setNurseName(e.target.value)}
                        value={nurseName}
                    />
                    <input
                        type="text"
                        placeholder="Search by Common name"
                        onChange={e => setComname(e.target.value)}
                        value={comname}
                    />
                    <input
                        type="text"
                        placeholder="Search Genus"
                        onChange={e => setGenus(e.target.value)}
                        value={genus}
                    />
                    <input
                        type="text"
                        placeholder="Search Species"
                        onChange={e => setSpecies(e.target.value)}
                        value={species}
                    />
                </div>
                <div>
                    <button>Get Nurse Productions</button>
                </div>
            </form>
            {(nurseProList && nurseProList.data) ? <TableView data={nurseProList.data} /> : <TableView data={[{ "Notice": "no data to display" }]} />}
        </Layout>
    );
}

export default NurseProduction;
