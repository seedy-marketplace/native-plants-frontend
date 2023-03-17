import React, { useState } from 'react';
import Layout from '../components/Layout';
import styles from '../components/Navbar.module.css'

import useAPIRequest from '../hooks/useAPIRequest';

function Map() {
    

    return (
        <Layout>
            <form className={styles.containerMap}>
                <div>
                    <iframe
                        id="frame-gis"
                        src="/maps/map-view.html"
                        width="1100px"
                        height="600px"
                    ></iframe>
                </div>
            </form>
        </Layout>
    );
}

export default Map;