import React, { useState } from 'react';
import Layout from '../components/Layout';
import styles from '../components/Navbar.module.css'
import * as XLSX from "xlsx";
import styled from '@emotion/styled'

import useAPIRequest from '../hooks/useAPIRequest';
import accessITIS from './api/accessITIS';

const ErrMessage = styled.div`
    margin-top: 5px;
    padding: 5px;
    background: #ff7c7c;
    color:
`

const InputForm = styled.div`
h3 {
    font-weight: normal;
}
`

function BulkAdd({isLoading, setIsLoading}) {
    const [file, setFile] = useState();
    const [err, setErr] = useState(false);
    const [lenErr, setLenErr] = useState(false);
    const [rowErr, setRowErr] = useState(false);
    const [fileErr, setFileErr] = useState(false);
    const [errITIS, setErrITIS] = useState([]);
    const [contentErr, setContentErr] = useState(false);
    // var errItis = ""

    const handleOnChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleOnSubmit = (e) => {
        var type = file
        const fileReader = new FileReader();
        var tempData;
        var rowData;

        e.preventDefault();

        // Check for file
        if (file) {
            fileReader.readAsBinaryString(file)
            setFileErr(false);
            setLenErr(false);
            setRowErr(false);

            type = file.name.split('.').pop();
            if (type !== 'xlsx' && type !== 'csv') {
                setFileErr(true);
                setLenErr(false);
                setRowErr(false);
                return;
            }
        } else {
            setFileErr(true);
            setLenErr(false);
            setRowErr(false);
            return;
        }

        fileReader.onload = function (e) {
            setIsLoading(true);

            const bstr = e.target.result;

            const wb = XLSX.read(bstr, {type: 'binary'});

            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];

            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_csv(ws, {header:1});

            tempData = data.toString().split("\n").slice(1);
            setContentErr(false);

            if (tempData.length < 1) {
                setErr(true);
                setLenErr(true);
                setRowErr(false)
                console.log("Setting length err")

                return;
            }

            setErr(false);

            tempData.forEach(async(entry, index) => {
                // if (err == true) {
                //     return;
                // }
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

                // return;
                // console.log("Sending data to backend at ", ("https://www.itis.gov/ITISWebService/services/ITISService/searchByScientificName?srchKey="+"procera"))

                // const check = await fetch(("https://www.itis.gov/ITISWebService/services/ITISService/searchByScientificName?srchKey="+rowData[1]),
                //     {
                //         method: 'SEARCH',
                //         headers: {
                //             'Access-Control-Allow-Origin': '*',
                //         },
                //     }
                // )

                // fetch(("https://www.itis.gov/ITISWebService/services/ITISService/searchByScientificName?srchKey="+rowData[1]), {
                //     headers: {
                //         'Content-Type': 'application/json',
                //         // 'mode': 'no-cors',
                //     },
                //     credentials: 'include',
                //     mode: 'no-cors',

                // })
                //     .then((res) => {
                //         var retVal = res.json()
                //         console.log("Res: ", res)
                //         return retVal
                //     })
                //     .then(
                //         (result) => {
                //             console.log("Results:", result)
                //         //   setIsLoaded(true);
                //         //   setItems(result);
                //         },
                //         // Note: it's important to handle errors here
                //         // instead of a catch() block so that we don't swallow
                //         // exceptions from actual bugs in components.
                //         (error) => {
                //         //   setIsLoaded(true);
                //           console.log("Error with accessing ITIS, ", error)
                //         }
                //     )

                // for (let i = 0; i < 5; i++) {

                // }

                const res = await fetch("./api/accessITIS",
                    {
                        method: 'SEARCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            // "species_name": "Azotobacter",
                            "species_name": rowData[1],
                            "genus": rowData[3],
                            // "genus": "indicus",
                            "tsn": rowData[2],
                            // "tsn": 123,
                        })
                    }
                )

                const resBody = await res.json();
                console.log("Found:", resBody)
                // if (resBody.response.numFound > 0) {
                if (resBody.ret) {
                    if (resBody.ret.response.numFound > 0) {

                        console.log("Enough found", resBody.ret.response)
                    }
                    res.status.send
                } else {
                    setContentErr(true);
                    if (index > 0) {
                        setErrITIS(errITIS.concat("\n"))
                    }
                    setErrITIS(errITIS.concat("Error on row ", index + 1, ": ", resBody.error))
                    // errItis.concat(": ", resBody.error)
                    console.log("Error: ", errITIS)
                    console.log("Error is: ", resBody)


                    

                }
                
                // console.log(resBody)

                // const resBody = await res.json();
                // console.log(resBody);
                // if (res.status >= 200 && res.status < 400) {
                //     setPlantList(resBody.data)
                // } else {
                //     alert("Error: \n" + resBody.error)
                // }

                
            })

            // setIsLoading(false);

            return;
            tempData.forEach(async(entry) => {
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
            })
            setIsLoading(false);
            // location.reload();



        };
    };

    return(
        <div className="import-csv">
            <InputForm>
                <form>
                    <h3>Bulk import plants by selecting a CSV or excel file</h3>
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
                    { contentErr ? (
                        <ErrMessage>
                            <p> {errITIS} </p>
                        </ErrMessage>
                        ) : null

                    }
                </form>
            </InputForm>
        </div>
    )
}

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
    const [isLoading, setIsLoading] = useState(false);

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
        var type = file
        const fileReader = new FileReader();
        var tempData;
        var rowData;

        e.preventDefault();

        // Check for file
        if (file) {
            fileReader.readAsBinaryString(file)
            setFileErr(false);
            setLenErr(false);
            setRowErr(false);

            type = file.name.split('.').pop();
            if (type !== 'xlsx' && type !== 'csv') {
                setFileErr(true);
                setLenErr(false);
                setRowErr(false);
                return;
            }
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
                            values: [rowData[3], rowData[1], rowData[0], rowData[2]],
                            
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
            <InputForm>
            <form onSubmit={postFarm} className={styles.container}>
                <h3>Manually enter individual plant data</h3>

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
            </InputForm>
            
            {/* <div className="import-csv">
                
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
            </div> */}
            <BulkAdd isLoading={isLoading} setIsLoading={setIsLoading}/>

        </div> 
        </Layout>
    );
}

export default Farms;
