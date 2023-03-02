import React, { useState } from 'react';
import Layout from '../components/Layout';
import styles from '../components/Navbar.module.css'
import * as XLSX from "xlsx";
import { css } from '@emotion/react'
import styled from '@emotion/styled'

import useAPIRequest from '../hooks/useAPIRequest';

const ErrMessage = styled.div`
    margin-top: 5px;
    padding: 5px;
    background: #ff7c7c;
    color:
`

function Farms() {
    const [genus, setGenus] = useState("");
    const [speccode, setSpecCode] = useState("");
    const [species, setSpecies] = useState("");
    const [comname, setComname] = useState("");
    const [file, setFile] = useState();
    const [err, setErr] = useState(false);
    const [lenErr, setLenErr] = useState(false);
    const [rowErr, setRowErr] = useState(false);
    const [fileErr, setFileErr] = useState(false);

    async function postFarm(e) {
        e.preventDefault();
        console.log("== Adding plant with these parameters:", genus, comname, speccode, species);
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

    const handleOnChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleOnSubmit = (e) => {
        var name = file
        const fileReader = new FileReader();
        var tempData;
        var rowData;

        e.preventDefault();

        // Check for file
        if (file) {
            fileReader.readAsBinaryString(file)
            setFileErr(false);
        } else {
            setFileErr(true);
            setLenErr(false);
            setRowErr(false);
            return;
        }

        fileReader.onload = function (e) {

            const bstr = e.target.result;

            const wb = XLSX.read(bstr, {type: 'binary'});

            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];

            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_csv(ws, {header:1});

            tempData = data.toString().split("\n").slice(1);

            if (tempData.length < 1) {
                setErr(true);
                setLenErr(true);
                setRowErr(false)
                console.log("Setting length err")
                return;
            }

            setErr(false);

            tempData.forEach(async(entry) => {
                if (err == true) {
                    return;
                }
                rowData = entry.split(",");
                console.log("Data: ", rowData)

                for (let i = 0; i < rowData.length; i++) {
                    if (rowData[i].length < 1) {
                        setErr(true);
                        setRowErr(true);
                        setLenErr(false)
                        console.log("Setting row err")
                        return;
                    }
                }

                // setErr(false);

                // return;


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
                            values: [rowData[0], rowData[1], rowData[2], rowData[3]],
                            
                        })
                    }
                )
                const resBody = await res.json();
                console.log(resBody);

                location.reload();
            })



        };
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
                
                <form>
                    <h1>Bulk Import Plants</h1>
                    <h3>Import plants by selecting an excel file</h3>
                    <input
                        type={"file"}
                        id={"csvFileInput"}
                        accept={".xlsx"}
                        onChange={handleOnChange}
                    />
                    <button onClick={(e) => {handleOnSubmit(e)}} >
                        IMPORT CSV
                    </button>
                    { lenErr ? (<ErrMessage>
                        <p>Error: There are no rows with values in this file. (Hint: 
                            make first row the description, write data starting in row 2)
                        </p>
                        </ErrMessage>) : null }
                    { rowErr ? (
                        <ErrMessage>
                            <p>Error: All sheets must have four full columns (in the order of) 
                                common name, species, species code, and genus</p>
                            </ErrMessage>
                        ) : null }
                    { fileErr ? (
                        <ErrMessage>
                            <p>Error: Invalid or missing file entry</p>
                            </ErrMessage>
                        ) : null }
                </form>
            </div>
        </div>
        </Layout>
    );
}

export default Farms;
