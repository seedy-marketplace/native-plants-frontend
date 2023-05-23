import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import styles from '../components/Navbar.module.css'
import * as XLSX from "xlsx";

import useAPIRequest from '../hooks/useAPIRequest';

function Projects() {
    //const [orgname, setOrgname] = useState("");
    const [projectname, setProjectname] = useState("");
    const [orgid, setOrgid] = useState("");
    const [lat, setLat] = useState("");
    const [long, setLong] = useState("");
    async function postProject(e) {
        e.preventDefault();
        if(!orgid){
            console.log("Need to have an organization")
            return
        }
        let point = '('+lat +',' + long+')'

        const res = await fetch('/api/accessDatabase',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query_type: 'INSERT', //SELECT, INSERT, etc. (Field is required)
                table_name: 'land_project', //Any table name here (Field is required)
                columns: ['proj_name', 'proj_location', 'proj_org'], //array of specific columns to use (Required by INSERT and UPDATE, defaults to * if missing)
                values: [projectname, point, orgid],//array of values for INSERT and UPDATE requests (Required by INSERT and UPDATE)
                required_level: 1,
                required_org: orgid
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
        <form onSubmit={postProject} className={styles.container}>
            <div>
                <input
                    type="number"
                    placeholder="Organization ID"
                    onChange={e => setOrgid(e.target.value)}
                    value={orgid}
                    />
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Project Name"
                    onChange={e => setProjectname(e.target.value)}
                    value={projectname}
                    />
            </div>
            <div>
                <input
                    type="number"
                    placeholder="Latitude"
                    onChange={e => setLat(e.target.value)}
                    value={lat}
                    />
            </div>
            <div>
                <input
                    type="number"
                    placeholder="Longitude"
                    onChange={e => setLong(e.target.value)}
                    value={long}
                    />
            </div>
            <div>
                <button>Add Project</button>
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

export default Projects;
