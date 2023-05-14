import React, { useEffect } from 'react';
import Layout from '../Layout';
import styles from './Map.module.css'
import Leaflet from 'leaflet';
import * as ReactLeaflet from 'react-leaflet';
// import ecoRegion from "./../../data/map/west_coast_eco_l4.json";
import 'leaflet/dist/leaflet.css';
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'

function LeafletMap({ children, className, width, height, ...rest }) {
    let mapClassName = styles.map;

    if ( className ) {
        mapClassName = `${mapClassName} ${className}`;
    }

    useEffect(() => {
        (async function init() {
        delete Leaflet.Icon.Default.prototype._getIconUrl;
        Leaflet.Icon.Default.mergeOptions({
            iconRetinaUrl: './../../../public/leaflet/images/marker-icon-2x.png',
            iconUrl: './../../../public/leaflet/images/marker-icon.png',
            shadowUrl: './../../../public/leaflet/images/marker-shadow.png',
        });
        })();
    }, []);

    return (
        <div className={styles.map} id="map">
            <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* <GeoJSON data={ecoRegion} /> */}
                <Marker position={[51.505, -0.09]}>
                    <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
      )
}

export default LeafletMap;
