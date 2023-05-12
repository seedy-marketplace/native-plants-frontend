import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import '../components/Navbar'

import useAPIRequest from '../hooks/useAPIRequest';

import TableView from '../components/TableView';

function Plants() {
    const [comname, setComname] = useState("");
    const [genus, setGenus] = useState("");
    const [species, setSpecies] = useState("")
    const [email, setEmail] = useState("");
    const [plantList, setPlantList] = useState([]);


    // const [res, loading, error] = useAPIRequest(`https://native-plants-backend.herokuapp.com/i/INSERT INTO rev2.farms(farm_name) VALUES (%s) /${farmname_to_send}`, "POST");
    // const [res, loading, error] = useAPIRequest(`https://native-plants-backend.herokuapp.com/q/SELECT * FROM rev2.farms`, "GET");
    async function getPlants(e) {
        if (e) {
            e.preventDefault();
        }
        var onVar = 'plant.species_id = seed_collection.col_species_id';
        if (comname) {
            onVar += ` AND plant.common_name iLIKE '%%${comname}%%'`;
        }
        if (genus) {
            onVar += ` AND plant.genus iLIKE '%%${genus}%%'`
        }
        if (species) {
            onVar += ` AND plant.species iLIKE '%%${species}%%'`
        }

        onVar += ` INNER JOIN rev2.users ON seed_collection.id_person_name = users.user_name`


        const res = await fetch("/api/accessDatabase", {


            method: 'SEARCH', //SEARCH, POST, DELETE, UPDATE  (NOT GET)
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query_type: 'SELECT', //SELECT, INSERT, etc. (Field is required)
                table_name: 'seed_collection', //Any table name here (Field is required)
                columns: ['plant.genus', 'plant.species', 'plant.common_name', 'seed_collection.collected_date', 'seed_collection.id_method', 'seed_collection.id_confidence', 'seed_collection.cleaned_weight', 'seed_collection.cleaning_effectiveness', 'users.email', 'users.phone_number', 'users.website'],
                join_string: onVar ? ' INNER JOIN rev2.plant ON ' + onVar : null
            })
        })
        const resBody = await res.json();
        console.log(resBody);
        if (res.status >= 200 && res.status < 400) {
            setPlantList(resBody.data)
            console.log("plantlistdata")
            console.log(plantList.data)
        } else {
            alert("Error: \n" + resBody.error)
        }
    }

    useEffect(() => {getPlants()})

    return (
        <Layout>
            <form onSubmit={getPlants}>
                <div>
                    <a>Type here to filter, leave blank for no filter</a>
                </div>
                <div>
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
                    <button>Get Plants</button>
                </div>
            </form>
            {(plantList && plantList.data) ? <TableView data={plantList.data} /> : <TableView data={[{ "Notice": "no data to display" }]} />}
        </Layout>
    );
}

export default Plants;
