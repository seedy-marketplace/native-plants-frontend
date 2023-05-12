import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import '../components/Navbar'

import useAPIRequest from '../hooks/useAPIRequest';

import TableView from '../components/TableView';

function FarmAmps() {
    const [farmName, setFarmName] = useState("");
    const [comname, setComname] = useState("");
    const [genus, setGenus] = useState("");
    const [species, setSpecies] = useState("")
    const [email, setEmail] = useState("");
    const [farmAmpList, setFarmAmpList] = useState([]);


    // const [res, loading, error] = useAPIRequest(`https://native-plants-backend.herokuapp.com/i/INSERT INTO rev2.farms(farm_name) VALUES (%s) /${farmname_to_send}`, "POST");
    // const [res, loading, error] = useAPIRequest(`https://native-plants-backend.herokuapp.com/q/SELECT * FROM rev2.farms`, "GET");
    async function getFarmAmp(e) {
        if (e) { e.preventDefault(); }
        var onVar = 'farms.farm_name = FA.farm_name';
        if (farmName) {
            onVar += ` AND farms.farm_name iLIKE '%%${farmName}%%'`;
        }
        onVar += ` INNER JOIN rev2.seed_collection ON seed_collection.collection_id = FA.ancestor_col_id`;
        onVar += ' INNER JOIN rev2.plant on plant.species_id = seed_collection.col_species_id';
        if (comname) {
            onVar += ` AND plant.common_name iLIKE '%%${comname}%%'`;
        }
        if (genus) {
            onVar += ` AND plant.genus iLIKE '%%${genus}%%'`
        }
        if (species) {
            onVar += ` AND plant.species iLIKE '%%${species}%%'`
        }

        //const res = await fetch('/api/accessBackend/https://native-plants-backend.herokuapp.com/i/INSERT INTO rev2.farms(farm_name) VALUES (%s) /'+farmname,{
        const res = await fetch("/api/accessDatabase",
            {
                method: 'SEARCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query_type: 'SELECT',
                    table_name: 'farm_amplification FA',
                    columns: ['plant.genus', 'plant.species', 'plant.common_name', 'FA.field_size', 'FA.year_sown', 'FA.year_harvested', 'FA.generation_of_seed', 'FA.cleaned_weight', 'FA.cleaning_effectiveness','FA.extra_farm_notes','farms.farm_name','farms.contact_email','farms.contact_phone_number','farms.farm_location','farms.farm_website'],
                    join_string: onVar ? ' INNER JOIN rev2.farms ON ' + onVar : null
                })
            }
        )
        const resBody = await res.json();
        console.log(resBody);
        if (res.status >= 200 && res.status < 400) {
            setFarmAmpList(resBody.data)
            console.log("farmampdata");
            console.log(farmAmpList.data);
        } else {
            alert("Error: \n" + resBody.error)
        }
    }

    useEffect(() => {getFarmAmp()})

    return (
        <Layout>
            <form onSubmit={getFarmAmp}>
                <div>
                <a>Type here to filter, leave blank for no filter</a>
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Search by farm name"
                        onChange={e => setFarmName(e.target.value)}
                        value={farmName}
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
                    <button>Get Farm Amplifications</button>
                </div>
            </form>
            {(farmAmpList && farmAmpList.data) ? <TableView data={farmAmpList.data} /> : <TableView data={[{ "Notice": "no data to display" }]} />}
        </Layout>
    );
}

export default FarmAmps;
