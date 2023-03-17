import React, { useState } from 'react';
import Layout from '../components/Layout';
import styles from '../components/Navbar.module.css'

import useAPIRequest from '../hooks/useAPIRequest';

function Map() {
    

    return (
        <Layout>
      
            <div className={styles.containerMap}>
                <iframe
                    id="frame-gis"
                    src="/maps/face/OSMmap.html"
                    //width="1100px"
                    // height="600px"
					width="100%"
                    height="100%"
                  ></iframe>             
            </div>

        </Layout>
    );
}

export default Map;
