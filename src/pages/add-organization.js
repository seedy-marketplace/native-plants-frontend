import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import styles from '../components/Navbar.module.css'
import * as XLSX from "xlsx";

import useAPIRequest from '../hooks/useAPIRequest';

function Organization() {
    const [orgname, setOrgname] = useState("");
    const [biotext, setBiotext] = useState("");
    const [pocuser, setPocuser] = useState("");
    async function postOrg(e) {
        e.preventDefault();
        console.log("== Adding organization with these parameters:", orgname);
        
        const res = await fetch('/api/accessDatabase',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query_type: 'INSERT', //SELECT, INSERT, etc. (Field is required)
                table_name: 'organization', //Any table name here (Field is required)
                columns: ['org_name', 'bio_text', 'poc_user'], //array of specific columns to use (Required by INSERT and UPDATE, defaults to * if missing)
                values: [orgname, biotext, pocuser],//array of values for INSERT and UPDATE requests (Required by INSERT and UPDATE)
                required_level: 1
            })
        })
        const resBody = await res.json();
        console.log(resBody);
    }

    const [file, setFile] = useState();

    useEffect(() => {
        const fileReader = new FileReader();
    })
    //const fileReader = new FileReader();

    const handleOnChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleOnSubmit = (e) => {
        e.preventDefault();

        if (file) {
            // console.log("File: ", file);
            fileReader.onload = function (e) {
            //     const csvOutput = event.target.result;
            //     console.log("handleOnSubmit: ", csvOutput);
                const bstr = e.target.result;
                const wb = XLSX.read(bstr, {type:'binary'});
                /* Get first worksheet */
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                /* Convert array of arrays */
                const data = XLSX.utils.sheet_to_csv(ws, {header:1});
                /* Update state */
                console.log("Data>>>"+data);
            };
            fileReader.readAsBinaryString(file);

            // console.log(fileReader.readAsText(file));
            
                
        }
    };



    return (
        <Layout>
        <form onSubmit={postOrg} className={styles.container}>
            <div>
                <input
                    type="text"
                    placeholder="Organization name"
                    onChange={e => setOrgname(e.target.value)}
                    value={orgname}
                    />
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Bio text"
                    onChange={e => setBiotext(e.target.value)}
                    value={biotext}
                    />
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Poc User"
                    onChange={e => setPocuser(e.target.value)}
                    value={pocuser}
                    />
            </div>
            <div>
                <button>Add Organization</button>
            </div>
        </form>

        <div className="import-csv">
            <h1>REACTJS CSV IMPORT EXAMPLE</h1>
            <form>
                <input
                    type={"file"}
                    id={"csvFileInput"}
                    accept={".csv"}
                    onChange={handleOnChange}
                />
                <button
                    onClick={(e) => {
                        handleOnSubmit(e);
                    }}
                >
                    IMPORT CSV
                </button>
            </form>
        </div>

        </Layout>
    );
}

export default Organization;
