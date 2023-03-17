import React, { useState } from 'react';
import Layout from '../components/Layout';
import '../components/Navbar'

import useAPIRequest from '../hooks/useAPIRequest';

import TableView from '../components/TableView';

function Plants() {
    const [comname, setComname] = useState("");
    const [speccode, setSpecCode] = useState("");
    const [plantList, setPlantList] = useState([]);


    // const [res, loading, error] = useAPIRequest(`https://native-plants-backend.herokuapp.com/i/INSERT INTO rev2.farms(farm_name) VALUES (%s) /${farmname_to_send}`, "POST");
    // const [res, loading, error] = useAPIRequest(`https://native-plants-backend.herokuapp.com/q/SELECT * FROM rev2.farms`, "GET");
    async function getSeeds(e) {
        e.preventDefault();
        const res = await fetch("/api/accessDatabase",{
            method: 'SEARCH', //SEARCH, POST, DELETE, UPDATE  (NOT GET)
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query_type: 'SELECT', //SELECT, INSERT, etc. (Field is required)
                table_name: 'seed_collection', //Any table name here (Field is required)
                where: `${speccode ? `col_species_code LIKE '%%${speccode}%%'` : ""}`
            })
        })
        const resBody = await res.json();
        console.log(resBody);
        if (res.status >= 200 && res.status < 400) {
            setPlantList(resBody.data)
        } else {
            alert("Error: \n" + resBody.error)
        }
    }

    return (
        <Layout>
            <form onSubmit={getSeeds}>
                <div>
                    <a>Type here to filter, leave blank for no filter</a>
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Search by Species Code"
                        onChange={e => setSpecCode(e.target.value)}
                        value={speccode}
                    />
                </div>
                <div>
                    <button>Get Seeds</button>
                </div>
            </form>
            {(plantList && plantList.data) ? <TableView data={plantList.data} /> : <TableView data={[{ "Notice": "no data to display" }]} />}
        </Layout>
    );
}

export default Plants;
