import React, { useState, useEffect } from 'react';
import fetch from 'isomorphic-unfetch';
import Link from 'next/link';
import Layout from '../components/Layout';
import styles from '../components/Navbar.module.css'

export default function Farm() {

    return (
        <Layout>
            <div className="pagelistContainer">
                <div className="pagelistTitle">
                    <h2>Navigate to Farm Page</h2>
                </div>
                <ul className="pagelist">
                    <li className="pagelist_item">
                        <Link href="/add-farms">
                          <a>Add Farm</a>
                        </Link>
                    </li>
                    <li className="pagelist_item">
                        <Link href="/get-farms">
                          <a>See Farms</a>
                        </Link>
                    </li>
                    <li className="pagelist_item">
                        <Link href="/delete-farm">
                          <a>Delete Farm</a>
                        </Link>
                    </li>
                    <li className="pagelist_item">
                        <Link href="/update-farm">
                          <a>Update Farm</a>
                        </Link>
                    </li>
                    <li className="pagelist_item">
                        <Link href="/add-farm-amp">
                          <a>Add Amplification</a>
                        </Link>
                    </li>
                    <li className="pagelist_item">
                        <Link href="/get-farm-amp">
                          <a>See Amplification</a>
                        </Link>
                    </li>
                </ul>
            </div>
        </Layout>
    );
}
