/*
 * Spinner derived from https://tobiasahlin.com/spinkit/.
 */
//archived file
import React from 'react'

import './Spinner.css'

function Spinner() {

    return (
        <div className="spinner">
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
        </div>
    )
}

export default Spinner