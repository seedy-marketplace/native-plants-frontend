import React, { useState } from 'react';
import Layout from '../components/Layout';
import '../components/Navbar'

import useAPIRequest from '../hooks/useAPIRequest';

import TableView from '../components/TableView';

function Nurses() {
    const [nursename, setNursename] = useState("");
    const [email, setEmail] = useState("");
    const [nurseList, setNurseList] = useState([]);


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
                body: JSON.stringify({
                    query_type: 'SELECT', //SELECT, INSERT, etc. (Field is required)
                    table_name: 'nurseries', //Any table name here (Field is required)
                    where: `${nursename ? `nursery_name iLIKE '%%${nursename}%%'` : ""}`
                })
            }
        )
        const resBody = await res.json();
        console.log(resBody);
        if (res.status >= 200 && res.status < 400) {
            setNurseList(resBody)
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
                        placeholder="Search by nursery name"
                        onChange={e => setNursename(e.target.value)}
                        value={nursename}
                    />
                </div>
                <div>
                    <button>Get Nurseries</button>
                </div>
            </form>
            {(nurseList && nurseList.data) ? <TableView data={nurseList.data} /> : <TableView data={[{ "Notice": "no data to display" }]} />}
        </Layout>
    );
}

export default Nurses;
