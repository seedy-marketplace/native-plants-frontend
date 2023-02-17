import React, { useState } from 'react';
import Layout from '../components/Layout';
import styles from '../components/Navbar.module.css'
import * as XLSX from "xlsx";

import useAPIRequest from '../hooks/useAPIRequest';

function Farms() {
    const [genus, setGenus] = useState("");
    const [speccode, setSpecCode] = useState("");
    const [species, setSpecies] = useState("");
    const [comname, setComname] = useState("");
    async function postFarm(e) {
        e.preventDefault();
        //console.log("== Adding plant with these parameters:", genus, comname, speccode, species);
        //const res = await fetch('/api/accessBackend/https://native-plants-backend.herokuapp.com/i/INSERT INTO rev2.farms(farm_name, contact_email) VALUES (%s) /'+farmname+', '+farmeamil,{
        // const res = await fetch('/api/accessBackend', {
        //     method: 'POST',
        //     body: JSON.stringify( {
        //         table_name: "plant",
        //         query_type: "INSERT",
        //         query_fields: ['genus','species','common_name','species_code'],
        //         query_values: [genus, species,comname,speccode]
        //     }),
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // })
        const res = await fetch('/api/accessDatabase',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query_type: 'INSERT', //SELECT, INSERT, etc. (Field is required)
                table_name: 'plant', //Any table name here (Field is required)
                columns: ['genus', 'species', 'common_name', 'species_code'], //array of specific columns to use (Required by INSERT and UPDATE, defaults to * if missing)
                values: [genus, species, comname, speccode]//array of values for INSERT and UPDATE requests (Required by INSERT and UPDATE)
            })
        })
        const resBody = await res.json();
        console.log(resBody);

    }

    const [file, setFile] = useState();

    const handleOnChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleOnSubmit = (e) => {
        const fileReader = new FileReader();
        var tempData;
        var rowData;

        e.preventDefault();

        console.log("File:", file)

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
                console.log("Data:", data.toString().split("\n"))
    
                console.log(data.toString().split("\n").slice(1));

                tempData = data.toString().split("\n").slice(1);

                tempData.forEach(async(entry) => {
                    console.log("For each entry: ", entry);
                    rowData = entry.split(",");
                    console.log("For each entry: ", rowData);

                    const res = await fetch("/api/accessDatabase",
                        {
                            method: 'POST', //HTTP method: SEARCH, POST, DELETE, PATCH  (NOT GET)
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                query_type: 'INSERT', //SQL Query type: SELECT, INSERT, UPDATE, DELETE. (Field is required)
                                table_name: 'plant', //Any table name here (Field is required)
                                columns: ['genus', 'species', 'common_name', 'species_code'], //array of specific columns to use (Required by INSERT and UPDATE, defaults to * if missing)
                                // values: [rowData],//array of values for INSERT and UPDATE requests (Required by INSERT and UPDATE)
                                values: [rowData[0], rowData[1], rowData[2], rowData[3]],
                                
                            })
                        }
                    )
                })

            };
                
        }
    };

    return (
        <Layout>
        <div className="input-page">
            <form onSubmit={postFarm} className={styles.container}>
                <div>
                    <input
                        type="text"
                        placeholder="Common name"
                        onChange={e => setComname(e.target.value)}
                        value={comname}
                        />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Species"
                        onChange={e => setSpecies(e.target.value)}
                        value={species}
                        />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Species Code"
                        onChange={e => setSpecCode(e.target.value)}
                        value={speccode}
                        />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Genus"
                        onChange={e => setGenus(e.target.value)}
                        value={genus}
                        />
                </div>
                <div>
                    <button>Add Plant</button>
                </div>
            </form>
            
            <div className="import-csv">
                <h1>Bulk Import Plants</h1>
                <h3>Import plants by selecting an excel file</h3>
                <form>
                    <input
                        type={"file"}
                        id={"csvFileInput"}
                        accept={".xlsx"}
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
        </div>
        </Layout>
    );
}

export default Farms;
