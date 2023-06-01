import React, { useState } from 'react';
import Layout from '../components/Layout';

import useAPIRequest from '../hooks/useAPIRequest';

import TableView from '../components/TableView';

function Organization() {
    const [orgname, setOrgname] = useState("");
    const [orgList, setOrgList] = useState([]);

    // const [res, loading, error] = useAPIRequest(`https://native-plants-backend.herokuapp.com/i/INSERT INTO rev2.farms(farm_name) VALUES (%s) /${farmname_to_send}`, "POST");
    // const [res, loading, error] = useAPIRequest(`https://native-plants-backend.herokuapp.com/q/SELECT * FROM rev2.farms`, "GET");
    async function getOrg(e) {
        e.preventDefault();
        
        const res = await fetch("/api/accessDatabase",{
            method: 'SEARCH', //SEARCH, POST, DELETE, UPDATE  (NOT GET)
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query_type: 'SELECT', //SELECT, INSERT, etc. (Field is required)
                table_name: 'organization', //Any table name here (Field is required)
                columns: ['organization_id', 'org_name','poc_user', 'bio_text'],
                column_names: ['Org ID', 'Name', 'Admin User', 'Bio'],
                where: `${orgname ? `org_name iLIKE '%%${orgname}%%'` : ""}`
            })
        })

        const resBody = await res.json();
        console.log(resBody);
        if(res.status >= 200 && res.status < 400) {
            setOrgList(resBody)
        }else {
            alert("Error: \n" + resBody.error)
        }
    }

    return (
        <Layout>
            <form onSubmit={getOrg}>
                <div>
                    <a>Type here to filter, leave blank for no filter</a>
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Search by Organization name"
                        onChange={e => setOrgname(e.target.value)}
                        value={orgname}
                    />
                </div>
                <div>
                    <button>Get Organizations</button>
                </div>
            </form>
            {(orgList && orgList.data )? <TableView data={orgList.data} /> : <TableView data={[{"Notice":"no data to display"}]} />}
        </Layout>
    );
}

export default Organization;
