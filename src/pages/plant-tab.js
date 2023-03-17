import React, { useState, useEffect } from 'react';
import fetch from 'isomorphic-unfetch';
import Link from 'next/link';
import Layout from '../components/Layout';
import styles from '../components/Navbar.module.css'

export default function Farm() {

    return (
        <Layout>
            <ul className="pagelist">
                <li className="pagelist_item">
                    <Link href="/add-plant">
                      <a>Add Plant</a>
                    </Link>
                </li>
                <li className="pagelist_item">
                    <Link href="/get-plants">
                      <a>See Plants</a>
                    </Link>
                </li>
                <li className="pagelist_item">
                    <Link href="/delete-plant">
                      <a>Delete Plant</a>
                    </Link>
                </li>
                <li className="pagelist_item">
                    <Link href="/add-seed-col">
                      <a>Add seed Collection</a>
                    </Link>
                </li>
                <li className="pagelist_item">
                    <Link href="/get-seed-col">
                      <a>Get seed Collections</a>
                    </Link>
                </li>
                <li className="pagelist_item">
                    <Link href="/update-seed-col">
                      <a>Update seed</a>
                    </Link>
                </li>
            </ul>
        </Layout>
    );
}
