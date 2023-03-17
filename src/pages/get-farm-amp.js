import React, { useState } from 'react';
import Layout from '../components/Layout';
import '../components/Navbar'

import useAPIRequest from '../hooks/useAPIRequest';

import TableView from '../components/TableView';

function FarmAmps() {
    const [farmName, setFarmName] = useState("");
    const [email, setEmail] = useState("");
    const [farmAmpList, setFarmAmpList] = useState([]);


    // const [res, loading, error] = useAPIRequest(`https://native-plants-backend.herokuapp.com/i/INSERT INTO rev2.farms(farm_name) VALUES (%s) /${farmname_to_send}`, "POST");
    // const [res, loading, error] = useAPIRequest(`https://native-plants-backend.herokuapp.com/q/SELECT * FROM rev2.farms`, "GET");
    async function getNurses(e) {
        e.preventDefault();
    
        let res = await fetch('/api/accessDatabase',{
                method: 'SEARCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    query_type: "SELECT",
                    table_name: "farm_amplification",
                    where: `farm_name='${farmName}'`
                }
            })
        const resBody = await res.json();
        console.log(resBody);
        if (res.status >= 200 && res.status < 400) {
            setFarmAmpList(resBody.data)
        } else {
            alert("Error: \n" + resBody.error)
        }
    }

    return (
        <Layout>
            <form onSubmit={getNurses}>
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
