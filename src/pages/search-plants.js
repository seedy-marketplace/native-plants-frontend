import React, { useState } from 'react';
import Layout from '../components/Layout';
import '../components/Navbar'
import { useForm } from "react-hook-form";
import TableView from '../components/TableView';

export default function SearchPlants() {
    const [plantList, setPlantList] = useState([]);

    async function queryPlants(e) {
        // TODO would like to improve this interaction to use
        // query parameters instead of formatted SQL to
        // increase security
        let searchfront = '/api/accessBackend?query_string=SELECT '
        let searchback = ' FROM rev2.plant'
        var searchmid = '*'

        let count = 0
        for (const [key, value] of Object.entries(e)) {
            console.log(`${key}: ${value}`);
            // Add and AND condition between parameters when
            // using more than one field in the form
            if(count > 0){
                searchback += " AND"
            }
            searchback += " Where " + key + " LIKE '" + value + "'"
        }
        
        let searchfinal = searchfront + searchmid + searchback
        console.log("== searching this: ", searchfinal)
        const res = await fetch(searchfinal,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                query: "Plants"
            }
        )
        const resBody = await res.json()
        console.log(resBody)
        if (res.status >= 200 && res.status < 400) {
            // Populate the table with the results from the query
            setPlantList(resBody.data)
        } else {
            alert("Error: \n" + resBody.error)
        }
    }

    const { register, handleSubmit, formState: { errors } } = useForm()
    const onSubmit = data => queryPlants(data)

    return (
        <Layout>
            {/* "handleSubmit" will validate the form inputs before calling "onSubmit" */ }
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Management Site form input paired with validation message */}
                <input placeholder="Management Site" {...register("management_site", { required: true })} />
                {errors.managementSite && <span style={{ color: "red" }}>Please enter a management site</span>}
                {/* Plant Species form input paired with validation message */}
                <input placeholder="Plant Species" {...register("common_name", { required: true })} />
                {errors.plantSpecies && <span style={{ color: "red" }}>Please enter one or more plant species</span>}
                {/* Eco Region form input (optional) */}
                <input placeholder="Eco Region" {...register("eco_region")} />

                <input type="submit" text="Search" />
            </form>
            {(plantList && plantList.data) ? <TableView data={plantList.data} /> : <TableView data={[{ "Notice": "no data to display" }]} />}
        </Layout>
    );
}
