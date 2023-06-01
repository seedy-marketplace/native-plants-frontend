//archived file
import React, { useState } from 'react';
import Layout from '../components/Layout';

import useAPIRequest from '../hooks/useAPIRequest';

import TableView from '../components/TableView';

function Labs() {
    const [labname, setLabname] = useState("");
    const [email, setEmail] = useState("");
    const [labList, setLabList] = useState([]);



    // const [res, loading, error] = useAPIRequest(`https://native-plants-backend.herokuapp.com/i/INSERT INTO rev2.farms(farm_name) VALUES (%s) /${farmname_to_send}`, "POST");
    // const [res, loading, error] = useAPIRequest(`https://native-plants-backend.herokuapp.com/q/SELECT * FROM rev2.farms`, "GET");
    async function getLab(e) {
        e.preventDefault();
        
        
        const res = await fetch('./api/accessDatabase',
            {
                method: 'SEARCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query_type: 'SELECT',
                    table_name: 'lab',
                    where: `${labname ? `lab_name LIKE '%%${labname}%%'` : ""}`
                })
            }
        )
        const resBody = await res.json();
        console.log(resBody);
        if (res.status >= 200 && res.status < 400) {
            setLabList(resBody.data)
        } else {
            alert("Error: \n" + resBody.error)
        }
    }

    return (
        <Layout>
            <form onSubmit={getLab}>
                <div>
                    <a>Type here to filter, leave blank for no filter</a>
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Search by lab name"
                        onChange={e => setLabname(e.target.value)}
                        value={labname}
                    />
                </div>
                <div>
                    <button>Get labs</button>
                </div>
            </form>
            {(labList && labList.data) ? <TableView data={labList.data} /> : <TableView data={[{ "Notice": "no data to display" }]} />}
        </Layout>
    );
}

export default Labs;
