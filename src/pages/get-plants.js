import React, { useState } from 'react';
import Layout from '../components/Layout';
import '../components/Navbar'

import useAPIRequest from '../hooks/useAPIRequest';

import TableView from '../components/TableView';
import Map from '../components/Map';
// import westCoastEco from '@/data/map/west-coast-eco.json';
const DEFAULT_CENTER = [43.8, -120.55]
// import dynamic from 'next/dynamic';

// const LeafletMap = dynamic(() => import('../components/Map/LeafletMap'), {
//   ssr: false
// });
// const MyData = () => {
//     // create state variable to hold data when it is fetched
//     const [data, setData] = React.useState();
  
//     // useEffect to fetch data on mount
//     useEffect(() => {
//       // async function!
//       const getData = async () => {
//         // 'await' the data
//         const response = await axios.get("url");
//         // save data to state
//         setData(response.data);
//       };
//       getData();
//     }, []);
  
//     // render react-leaflet GeoJSON when the data is ready
//     if (data) {
//       return <GeoJSON data={data} />;
//     } else {
//       return null;
//     }
//   };


function Plants() {
    const [comname, setComname] = useState("");
    const [genus, setGenus] = useState("");
    const [species, setSpecies] = useState("")
    const [email, setEmail] = useState("");
    const [plantList, setPlantList] = useState([]);
    const [displayMode, setDisplayMode] = useState("Table");


    // const [res, loading, error] = useAPIRequest(`https://native-plants-backend.herokuapp.com/i/INSERT INTO rev2.farms(farm_name) VALUES (%s) /${farmname_to_send}`, "POST");
    // const [res, loading, error] = useAPIRequest(`https://native-plants-backend.herokuapp.com/q/SELECT * FROM rev2.farms`, "GET");
    async function getPlants(e) {
        e.preventDefault();
        var onVar = 'plant.species_code = seed_collection.col_species_code';
        if (comname) {
            onVar += ` AND plant.common_name iLIKE '%%${comname}%%'`;
        }
        if (genus) {
            onVar += ` AND plant.genus iLIKE '%%${genus}%%'`
        }
        if (species) {
            onVar += ` AND plant.species iLIKE '%%${species}%%'`
        }

        onVar += ` INNER JOIN rev2.users ON seed_collection.id_person_name = users.user_name`


        const res = await fetch("/api/accessDatabase", {


            method: 'SEARCH', //SEARCH, POST, DELETE, UPDATE  (NOT GET)
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query_type: 'SELECT', //SELECT, INSERT, etc. (Field is required)
                table_name: 'seed_collection', //Any table name here (Field is required)
                columns: ['plant.genus', 'plant.species', 'plant.common_name', 'seed_collection.collected_date', 'seed_collection.id_method', 'seed_collection.id_confidence', 'seed_collection.cleaned_weight', 'seed_collection.cleaning_effectiveness', 'users.email', 'users.phone_number', 'users.website'],
                join_string: onVar ? ' INNER JOIN rev2.plant ON ' + onVar : null
            })
        })
        const resBody = await res.json();
        console.log(resBody);
        if (res.status >= 200 && res.status < 400) {
            setPlantList(resBody.data)
        } else {
            alert("Error: \n" + resBody.error)
        }
    }

    const handleOnChange = (e) => {
        setDisplayMode(e.target.value);
    };

    const displayData = () => {
        if(!plantList || plantList.data){
            return <TableView data={[{ "Notice": "no data to display" }]} />
        }

        if (displayMode === "Table") {
            return <TableView data={plantList} />
        } else {
            return <Map width="800" height="400" center={DEFAULT_CENTER} zoom={6}>
                        {({ TileLayer, Marker, Popup, GeoJSON }) => (
                        <>
                            <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                            />
                            {/* <GeoJSON data={westCoastEco} /> */}
                            <Marker position={DEFAULT_CENTER}>
                            <Popup>
                                A pretty CSS3 popup. <br /> Easily customizable.
                            </Popup>
                            </Marker>
                        </>
                        )}
                    </Map>
        }
    }

    return (
        <>
        <Layout>
            <form onSubmit={getPlants}>
                <div>
                    <a>Type here to filter, leave blank for no filter</a>
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Search by Common name"
                        onChange={e => setComname(e.target.value)}
                        value={comname}
                    />
                    <input
                        type="text"
                        placeholder="Search Genus"
                        onChange={e => setGenus(e.target.value)}
                        value={genus}
                    />
                    <input
                        type="text"
                        placeholder="Search Species"
                        onChange={e => setSpecies(e.target.value)}
                        value={species}
                    />
                </div>
                <div>
                    <button>Get Plants</button>
                </div>
            </form>
            {(plantList && plantList.data) ? <TableView data={plantList.data} /> : <TableView data={[{ "Notice": "no data to display" }]} />}
            <Map width="800" height="400" center={DEFAULT_CENTER} zoom={7}>
                {({ TileLayer, Marker, Popup, GeoJSON }) => (
                <>
                    {/* <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    /> */}
                    <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
                    attribution="Tiles © <a href='https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer'>ArcGIS</a>"
                    />
                    {/* <GeoJSON data={westCoastEco} /> */}
                </>
                )}
            </Map>
            {/* <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}} onChange={handleOnChange}>
                <input type="radio" value="Table" name="Table" /> Table
                <input type="radio" value="Map" name="Map" /> Map
            </div>
            { displayData() } */}

        </Layout>
        </>
    );
}

export default Plants;
