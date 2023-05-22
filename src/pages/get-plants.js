import React, { useState, useEffect, useRef } from 'react';
import { BasemapLayer, FeatureLayer } from "react-esri-leaflet";
import Layout from '../components/Layout';
import '../components/Navbar'

import useAPIRequest from '../hooks/useAPIRequest';

import TableView from '../components/TableView';
import Map from '../components/Map';
import { Icon } from "leaflet";

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       flexDirection: 'row',
//       flexWrap: 'wrap',
//       alignItems: 'flex-start' // if you want to fill rows left to right
//     },
//     item: {
//       width: '50%' // is 50% of container width
//     }
//   })

import mapMarker from '../components/Map/data/marker-icon-2x-green.png'
import exCollections from '../components/Map/data/ex_collections.json';
import exCollection2 from '../components/Map/data/ex_collections2.json';
import exCollection5 from '../components/Map/data/ex_collection5.json';
import westCoastEco from '../components/Map/data/west_coast_eco_l4.json';
import managedMeadowHabitat from '../components/Map/data/OSB_Managed_Meadow_Habitat.json';
import managedMeadow from '../components/Map/data/OSB_Managed_Meadow.json';

const DEFAULT_CENTER = [43.8, -120.55]
var greenIcon = new L.Icon({
    iconUrl: '/leaflet/images/marker-icon-2x-green.png',
    shadowUrl: 'leaflet/images/marker-shadow-stretch.png',
    iconSize: [15, 25],
    iconAnchor: [15, 5],
    popupAnchor: [1, -4],
    shadowSize: [15, 25]
  });

const SEARCH_PLANTS =
    [
        {
            "key" : 1,
            "genus"  : "Genus",
            "species": "Species",
            "common_name" : "Common Name", 
            "collected_date" : "12/03/22",
            "email" : "Collector email",
            "phone_number": "503-867-5309",
            "plantLat": 43.8,
            "plantLong": -120.55,
        },
        {
            "key" : 2,
            "genus"  : "Genus",
            "species": "Species",
            "common_name" : "Common Name", 
            "collected_date" : "12/03/22",
            "email" : "Collector email",
            "phone_number": "503-867-5309",
            "plantLat": 44.4,
            "plantLong": -120.55,
        },
        {
            "key" : 3,
            "genus"  : "Genus",
            "species": "Species",
            "common_name" : "Common Name", 
            "collected_date" : "12/03/22",
            "email" : "Collector email",
            "phone_number": "503-867-5309",
            "plantLat": 43.8,
            "plantLong": -121.25,
        },
        {
            "key" : 4,
            "genus"  : "Genus",
            "species": "Species",
            "common_name" : "Common Name", 
            "collected_date" : "12/03/22",
            "email" : "Collector email",
            "phone_number": "503-867-5309",
            "plantLat": 43.8,
            "plantLong": -119.35,
        }
];

function Plants() {
    const [comname, setComname] = useState("");
    const [genus, setGenus] = useState("");
    const [species, setSpecies] = useState("")
    const [email, setEmail] = useState("");
    const [plantList, setPlantList] = useState([]);
    const [displayMode, setDisplayMode] = useState("Table");

    const mapRef = useRef();

    useEffect(() => {
        const { current = {} } = mapRef;
        const { leafletElement: map } = current;
    
        if ( !map ) return;
    
        const parkIcon = new L.Icon({
          iconUrl: mapMarker,
          iconSize: [26, 26],
          popupAnchor: [0, -15],
          shadowAnchor: [13, 28]
        });

        const esri = L.esri.featureLayer({
            url: "https://geodata.epa.gov/arcgis/rest/services/ORD/USEPA_Ecoregions_Level_III_and_IV/MapServer/0",
            style: function () {
              return { color: "#70ca49", weight: 2 };
            }
           });

        esri.addTo(map)
    
        const parksGeojson = new L.GeoJSON(exCollection5, {
          pointToLayer: (feature, latlng) => {
            return L.marker(latlng, {
              icon: parkIcon
            });
          },
          onEachFeature: (feature = {}, layer) => {
            const { properties = {} } = feature;
            const { site_name } = properties;
    
            if ( !site_name ) return;
    
            layer.bindPopup(`<p>${site_name}</p>`);
          }
        });
    
        parksGeojson.addTo(map);
      }, [])

      const [ecoregions, setEcoregions] = useState();

      useEffect(() => {
          async function fetchEcoregion() {
              try {
                  const res = await fetch("https://geodata.epa.gov/arcgis/rest/services/ORD/USEPA_Ecoregions_Level_III_and_IV/MapServer/7/query?where=&text=&objectIds=&time=&timeRelation=esriTimeRelationOverlaps&geometry=-125%2C20%2C-115%2C49&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=STATE_NAME%2C+US_L4NAME&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&sqlFormat=none&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=geojson");
                  const data = await res.json();
                  console.log("****DATA RETRIEVED****");
                  console.log(data);
                  setEcoregions(data);
              } catch (error) {
                  console.log("****FETCH FAILED****" + error);
              }
          }
          fetchEcoregion();
       }, []);
  
       useEffect(() => {
          if(ecoregions){
              console.log("****ECOREGION RETRIEVED****");
              console.log(ecoregions);
          }
       }, [ecoregions]);

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

    // const displayData = () => {
    //     if(!plantList || plantList.data){
    //         return <TableView data={[{ "Notice": "no data to display" }]} />
    //     }

    //     if (displayMode === "Table") {
    //         return <TableView data={plantList} />
    //     } else {
    //         return <Map width="800" height="400" center={DEFAULT_CENTER} zoom={6}>
    //                     {({ TileLayer, Marker, Popup }) => (
    //                     <>
    //                         <TileLayer
    //                         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    //                         attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
    //                         />
    //                         {/* <GeoJSON data={westCoastEco} /> */}
    //                         <Marker position={DEFAULT_CENTER}>
    //                         <Popup>
    //                             A pretty CSS3 popup. <br /> Easily customizable.
    //                         </Popup>
    //                         </Marker>
    //                     </>
    //                     )}
    //                 </Map>
    //     }
    // }

    return (
        <Layout>
        <div class="row">
            <div class="columnFull">
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
            </div>
            </div>
            <div class="row">
                <div class="columnFull">
                {(plantList && plantList.data) ? <TableView data={plantList.data} /> : <TableView data={[{ "Notice": "no data to display" }]} />}
                </div>
            </div>
            <div class="row">
                <div class="columnFull">
                <Map width="800" height="400" center={DEFAULT_CENTER} zoom={7}>
                    {({ TileLayer, Marker, Popup, GeoJSON }) => (
                    <>
                        <TileLayer
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
                            attribution="Tiles © <a href='https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer'>ArcGIS</a>"
                        />
                        { (ecoregions) ? <GeoJSON data={ecoregions} /> : null }
                        {
                            SEARCH_PLANTS.map((plant) => {
                                return (
                                    <Marker
                                        position={[plant.plantLat, plant.plantLong]}
                                        icon={greenIcon}
                                        key={plant.key}
                                        >
                                        <Popup>
                                            <div>
                                                <h2>{plant.common_name}</h2>
                                                <h3>{plant.genus} {plant.species}</h3>
                                                <h4>Collected on {plant.collected_date}</h4>
                                                <h4>Collected by {plant.email} or {plant.phone_number}</h4>
                                            </div>
                                        </Popup>
                                    </Marker>
                                )
                            })
                        }
                    </>
                    )}
                </Map>
                </div>
            </div>
            </Layout>
    );
}

export default Plants;
