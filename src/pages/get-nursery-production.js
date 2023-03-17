import React, { useState } from 'react';
import Layout from '../components/Layout';
import '../components/Navbar'

import useAPIRequest from '../hooks/useAPIRequest';

import TableView from '../components/TableView';

function FarmAmps() {
    const [nurseName, setNurseName] = useState("");
    const [email, setEmail] = useState("");
    const [nurseProList, setNurseProList] = useState([]);


    // const [res, loading, error] = useAPIRequest(`https://native-plants-backend.herokuapp.com/i/INSERT INTO rev2.farms(farm_name) VALUES (%s) /${farmname_to_send}`, "POST");
    // const [res, loading, error] = useAPIRequest(`https://native-plants-backend.herokuapp.com/q/SELECT * FROM rev2.farms`, "GET");
    async function getNurses(e) {
        e.preventDefault();
        
        const res = await fetch('/api/accessDatabase',
            {
                method: 'SEARCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:{
                    query_type: 'SELECT', //SELECT, INSERT, etc. (Field is required)
                    table_name: 'nursery_production', //Any table name here (Field is required)
                    where: `${nurseName ? `nursery_name LIKE '%%${nurseName}%%'` : ""}`
                }
            }
        )
        const resBody = await res.json();
        console.log(resBody);
        if (res.status >= 200 && res.status < 400) {
            setNurseProList(resBody.data)
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
                        onChange={e => setNurseName(e.target.value)}
                        value={nurseName}
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

export default FarmAmps;
