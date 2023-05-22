import React, { useState, useEffect } from 'react';
import fetch from 'isomorphic-unfetch';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function Home() {
    const [user, setUser] = useState({});
    const router = useRouter()

    useEffect(() => {
        async function fetchData() {
            const res = await fetch('/api/user');
            const body = await res.json();
            setUser(body);
        }
        fetchData();
    }, []);

    const [ecoregions, setEcoregions] = useState();

    useEffect(() => {
        async function fetchEcoregion() {
            try {
                const res = await fetch("https://geodata.epa.gov/arcgis/rest/services/ORD/USEPA_Ecoregions_Level_III_and_IV/MapServer/7/query?where=&text=&objectIds=&time=&timeRelation=esriTimeRelationOverlaps&geometry=-125%2C20%2C-115%2C49&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=STATE_NAME%2C+US_L4NAME&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=0.1&geometryPrecision=10&outSR=4326&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&sqlFormat=none&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=geojson")
                const data = await res.json();
                console.log("****DATA RETRIEVED****");
                console.log(data);
                setEcoregions(data);
            } catch (error) {
                console.log("****FETCH FAILED****" + error);
            }
        }
        fetchEcoregion();
     },[]);

     useEffect(() => {
        if(ecoregions){
            console.log("****ECOREGION RETRIEVED****");
            console.log(ecoregions);
        }
     }, [ecoregions]);

    function goToGetFarms(){
        router.push('/get-farms')
    }

    return (
        <Layout>
            <div className="welcome-container">
                <div className="welcome-text">
                    <h1>Welcome to Seedy!</h1>
                </div>
            </div>
            
        </Layout>
    );
}
