//date, method of identifiction (3 types), cofidence of ID 1-3, cleaing effectiveness 1 of 4 types, cleaned weight
import React, { useState } from 'react';
import Layout from '../components/Layout';
import styles from '../components/Navbar.module.css'
import Link from 'next/link';
import styled from '@emotion/styled'
import * as XLSX from "xlsx";

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

async function GetTSN(species_name){
    query_url = "https://services.itis.gov/?q=searchByScientificName?searchKey=" + species_name;
    const res = await fetch(query_url)
    var data = await res.json();
    console.log(data)
    return data;
}

function BulkSeedCol({isLoading, setIsLoading}) {
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
            var data;
            if(type == "xlsx"){
                const bstr = e.target.result;
                const wb = XLSX.read(bstr, {type: 'binary'});

                /* Get first worksheet */
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];

                /* Convert array of jsons*/
                data = XLSX.utils.sheet_to_json(ws);
            }
            else{
                // Use reader.result
                var csv = fileReader.result;
                var lines = csv.split(/[\n\r]+/);
                var data = [];
                var headers=lines[0].split(",");
                for(var i=1;i<lines.length;i++){
                    var obj = {};
                    var currentline=lines[i].split(",");
                    for(var j=0;j<headers.length;j++){
                        if (currentline[j] !== "")
                            obj[headers[j]] = currentline[j];
                    }
                    data.push(obj);
                }  
                //return result; //JavaScript object
            }
            if (data.length < 1) {
                setErr(true);
                setLenErr(true);
                setRowErr(false)
                console.log("Setting length err")
                return;
            }
            // console.log(data);
            setErr(false);

            let insert_messages = {
                successes:[],
                failures:[],
                warnings:[]
            }

            data.forEach(async(entry, index) => {
                if (err == true) {
                    return;
                }
                if (entry.length < 1) {
                    return;
                }
                // return;
                // console.log("Sending data to backend at ", ("https://www.itis.gov/ITISWebService/services/ITISService/searchByScientificName?srchKey="+"procera"))

                const speccode_res = await fetch("./api/accessDatabase", {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method:"SEARCH",
                    body: JSON.stringify({
                        query_type:"SELECT",
                        table_name:'plant full outer join rev2.plant_species_pseudonym using(species_id)',
                        columns:['genus', 'species', 'species_id'],
                        where:`(species='${entry.species}' and genus='${entry.genus}') or (candidate_species_name='${entry.species}' and candidate_genus_name='${entry.genus}')`
                    })
                })
                const spec_resBody = await speccode_res.json();
                let queryResult = spec_resBody.data.data[0]
                if(queryResult === undefined)
                {
                    insert_messages.failures.push({line:index, message:`species ${entry.genus} ${entry.species} not found in database.`})
                    return;
                }
                else if(queryResult.species != entry.species || queryResult.genus != entry.genus){
                    insert_messages.warnings.push({line:index, message:`provided scientific name "${entry.genus} ${entry.species}" is deprecated. updated to ${queryResult.genus} ${queryResult.species}`})
                }
                entry.col_species_id=queryResult.species_id;
                delete(entry.species);
                delete(entry.genus);
                if(entry.lat !== undefined && entry.long !== undefined)
                    entry.col_location = `(${entry.lat},${entry.long})`;
                delete(entry.lat);
                delete(entry.long);
                const res = await fetch('/api/accessDatabase',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        query_type: 'INSERT', //SELECT, INSERT, etc. (Field is required)
                        table_name: 'seed_collection', //Any table name here (Field is required)
                        columns: Object.keys(entry), //array of specific columns to use (Required by INSERT and UPDATE, defaults to * if missing)
                        values: Object.values(entry)//array of values for INSERT and UPDATE requests (Required by INSERT and UPDATE)
                    })
                })
                const resBody = await res.json();
                if(resBody.data.result === 'success'){
                    insert_messages.successes.push({line:index, data:entry});
                }
                else{
                    insert_messages.failures.push({line:index, message:`failed to insert line ${index} of ${file.name}. please check each field to ensure that it they are valid.` })
                }

            })
            console.log(insert_messages)
            return;
        }
    };

    return(
        <div className="import-csv">
            <InputForm>
                <form>
                    <h3>Bulk import plants by selecting a CSV or excel file</h3>
                    <input
                        type={"file"}
                        id={"csvFileInput"}
                        accept={".xlsx, .csv"}
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

function SeedCol() {
    // const [cleanWeight, setCleanWeight] = useState("");
    // const [speccode, setSpecCode] = useState("");
    // const [date, setDate] = useState("");
    // const [method, setMethod] = useState("");
    // const [siteName, setSitename] = useState("");
    // const [confidence, setConfidence] = useState("");
    // const [clean, setClean] = useState("");
    // const [username, setUserName] = useState("");
    // const [idname, setIdName] = useState("");
    // const [desc, setDesc] = useState("");
    const [collecteddate, setCollecteddate] = useState("");
    const [colprovenance, setColprovenance] = useState("");
    const [idmethod, setIdmethod] = useState("");
    const [idpersonname, setIdpersonname] = useState("");
    const [idconfidence, setIdconfidence] = useState("");
    const [cleaningeffectiveness, setCleaningeffectiveness] = useState("");
    const [cleanedweight, setCleanedweight] = useState("");
    const [owningorg, setOwningorg] = useState("");
    const [fortrade, setFortrade] = useState("");
    const [colspeciesid, setColspeciesid] = useState("");
    const [lat, setLat] = useState("");
    const [long, setLong] = useState("");
    const [colcontactuser, setColcontactuser] = useState("");
    const [isLoading, setIsLoading] = useState("");

    async function getData(){
        const reqData = {}
        let res = await fetch('/api/accessDatabase',{
            method: 'SEARCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                query_type: "SELECT",
                table_name: "plant",
                where: `species_code='${speccode}'`
            }
        })
        if (res.status >= 200 && res.status < 400) {
            reqData.plantData = await res.json();
            console.log(reqData.plantData);
        } else {
            alert("Error: \n" + reqData.error)
            return {plantData:NULL}
        }

    
        res = await fetch('/api/accessDatabase',{
            method: 'SEARCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                query_type: "SELECT",
                table_name: "site",
                where: `collection_site_name='${siteName}'`
            }
        })
        if (res.status >= 200 && res.status < 400) {
            reqData.siteData = await res.json();
            console.log(reqData.siteData);
        } else {
            alert("Error: \n" + reqData.error)
            return {siteData:NULL, plantData:NULL}
        }
        return reqData
    }
    
    async function postSeedCol(e) {
        e.preventDefault();
        //const data = await getData()
        //if (idname == "")
        //    setIdName("NULL")
        let point = '('+lat +',' + long+')'
        const res = await fetch('/api/accessDatabase', {
            method: 'POST',
            body: JSON.stringify( {
                table_name: "seed_collection",
                query_type: "INSERT",
                columns: ['collected_date', 'col_provenance', 'id_method', 'id_person_name', 'id_confidence', 'cleaning_effectiveness', 'cleaned_weight', 'owning_org', 'for_trade', 'col_species_id', 'col_location', 'col_contact_user'],//['col_species_code', 'cleaning_effectiveness', 'cleaned_weight', 'id_confidence','collected_date', 'id_method', 'col_provenance', 'owner_name', 'id_person_name'],
                values: [collecteddate, colprovenance, idmethod, idpersonname, idconfidence, cleaningeffectiveness, cleanedweight, owningorg, fortrade, colspeciesid, point, colcontactuser],//[speccode, clean, cleanWeight, confidence, date, method, data.siteData.data.data[0].site_id, username, idname]
                required_level: 1,
                required_org: owningorg
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const resBody = await res.json();
        console.log(resBody);
    }

    return (
        <Layout>
        <form onSubmit={postSeedCol} className={styles.container}>
            <div>
                <input
                    type="text"
                    placeholder="Username of contact person"
                    onChange={e => setColcontactuser(e.target.value)}
                    value={colcontactuser}
                    />
            </div>
            <div>
                <input
                    type="number"
                    placeholder="Organization ID"
                    onChange={e => setOwningorg(e.target.value)}
                    value={owningorg}
                    />
            </div>
            <div>
                <input
                    type="number"
                    placeholder="Species ID"
                    onChange={e => setColspeciesid(e.target.value)}
                    value={colspeciesid}
                    />
            </div>
            <ul>
            <li>
            <Link href="/get-plants">
                <a target="_blank">Click here to see all plants/codes in new tab</a>
            </Link>
            </li>
            </ul>
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
            <p>Collection Date (format YYYY-MM-DD you DO type the dashes)</p>
                <input
                    type="text"
                    placeholder="Collection Date"
                    onChange={e => setCollecteddate(e.target.value)}
                    value={collecteddate}
                    />
            </div>
            <div>
                <input
                    type="number"
                    placeholder="Site ID"
                    onChange={e => setColprovenance(e.target.value)}
                    value={colprovenance}
                    />
            </div>
            
            
            
            <div>
            <p>User name of person who identified the species. (leave blank if they are not a user)</p>
                <input
                    type="text"
                    placeholder="Name of Identifier"
                    onChange={e => setIdpersonname(e.target.value)}
                    value={idpersonname}
                    />
            </div>
            <p>How was the seed Identified</p>
            <label className="container">Dichotomous key
                <input type="radio" name="key" value="GK" onClick={e => setIdmethod(e.target.value)}/>
                <span className="checkmark"></span>
            </label>
            <label className="container">Diagnostic Characteristics
                <input type="radio" name="key" value="GC" onClick={e => setIdmethod(e.target.value)}/>
                <span className="checkmark"></span>
            </label>
            <label className="container">Gist
                <input type="radio" name="key" value="GI" onClick={e => setIdmethod(e.target.value)}/>
                <span className="checkmark"></span>
            </label>
            <div>
                <input
                    type="number"
                    placeholder="Cofidence of Identification (scale of 1 to 3)"
                    onChange={e => setIdconfidence(e.target.value)}
                    value={idconfidence}
                    />
            </div>
            <div className="radios">
                <p>Please rate how well the seed was cleaned</p>
            <label className="container">Great
                <input type="radio" name="rate" value="a" onClick={e => setCleaningeffectiveness(e.target.value)}/>
                <span className="checkmark"></span>
            </label>
            <label className="container">Good
                <input type="radio" name="rate" value="b" onClick={e => setCleaningeffectiveness(e.target.value)}/>
                <span className="checkmark"></span>
            </label>
            <label className="container">Fair
                <input type="radio" name="rate" value="c" onClick={e => setCleaningeffectiveness(e.target.value)}/>
                <span className="checkmark"></span>
            </label>
            <label className="container">None
                <input type="radio" name="rate" value="z" onClick={e => setCleaningeffectiveness(e.target.value)}/>
                <span className="checkmark"></span>
            </label>
            </div>
            <div>
                <input
                    type="number"
                    placeholder="Cleaned Weight(pounds"
                    onChange={e => setCleanedweight(e.target.value)}
                    value={cleanedweight}
                    />
            </div>
            
            <div>
                <button type="submit">Add Seed Collection</button>
            </div>
        </form>
        <BulkSeedCol isLoading={isLoading} setIsLoading={setIsLoading}/>
        </Layout>
    );
}

export default SeedCol;
