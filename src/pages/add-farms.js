import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import styles from '../components/Navbar.module.css'
import * as XLSX from "xlsx";

import useAPIRequest from '../hooks/useAPIRequest';

function Farms() {
    const [farmname, setFarmname] = useState("");
    const [farmemail, setFarmemail] = useState("");
    const [farmnumber, setFarmnumber] = useState("");
    const [farmlocation, setFarmlocation] = useState("");
    async function postFarm(e) {
        e.preventDefault();
        console.log("== Adding farm with these parameters:", farmname, farmemail);
        
        const res = await fetch('/api/accessDatabase',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query_type: 'INSERT', //SELECT, INSERT, etc. (Field is required)
                table_name: 'farms', //Any table name here (Field is required)
                columns: ['contact_email', 'contact_phone_number', 'farm_location', 'farm_name'], //array of specific columns to use (Required by INSERT and UPDATE, defaults to * if missing)
                values: [farmemail, farmnumber, null, farmname]//array of values for INSERT and UPDATE requests (Required by INSERT and UPDATE)
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
        <form onSubmit={postFarm} className={styles.container}>
            <div>
                <input
                    type="text"
                    placeholder="Farm name"
                    onChange={e => setFarmname(e.target.value)}
                    value={farmname}
                    />
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Email"
                    onChange={e => setFarmemail(e.target.value)}
                    value={farmemail}
                    />
            </div>
            <div>
                <label htmlFor="phone">Enter Farm phone number:</label>
                <input type="tel" 
                id="phone" 
                name="phone" 
                pattern="[0-9]{10,11}" 
                onChange={e => setFarmnumber(e.target.value)}/>
                <small>Format: 1234567890</small><br/>
            </div>
            <div>
                <button>Add Farm</button>
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

export default Farms;
