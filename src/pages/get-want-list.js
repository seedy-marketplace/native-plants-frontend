import React, { useState } from 'react';
import Layout from '../components/Layout';

import useAPIRequest from '../hooks/useAPIRequest';

import TableView from '../components/TableView';

function Farms() {
    const [farmname, setFarmname] = useState("");
    const [email, setEmail] = useState("");
    const [farmList, setFarmList] = useState([]);

    // const [res, loading, error] = useAPIRequest(`https://native-plants-backend.herokuapp.com/i/INSERT INTO rev2.farms(farm_name) VALUES (%s) /${farmname_to_send}`, "POST");
    // const [res, loading, error] = useAPIRequest(`https://native-plants-backend.herokuapp.com/q/SELECT * FROM rev2.farms`, "GET");
    async function getFarm(e) {
        e.preventDefault();
        
        const res = await fetch('/api/accessDatabase',
            {
                method: 'SEARCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    query_type: 'SELECT', //SELECT, INSERT, etc. (Field is required)
                    table_name: 'land_manager_want_list', //Any table name here (Field is required)
                    where: `${farmname ? `wanted_species_code LIKE '%%${farmname}%%'` : ""}`
                }
            }
        )
        const resBody = await res.json();
        console.log(resBody);
        if(res.status >= 200 && res.status < 400) {
            setFarmList(resBody.data)
        }else {
            alert("Error: \n" + resBody.error)
        }
    }

    return (
        <Layout>
            <form onSubmit={getFarm}>
                <div>
                    <a>Type here to filter, leave blank for no filter</a>
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Search by Species Code"
                        onChange={e => setFarmname(e.target.value)}
                        value={farmname}
                    />
                </div>
                <div>
                    <button>Get Requests</button>
                </div>
            </form>
            {(farmList && farmList.data )? <TableView data={farmList.data} /> : <TableView data={[{"Notice":"no data to display"}]} />}
        </Layout>
    );
}

export default Farms;
