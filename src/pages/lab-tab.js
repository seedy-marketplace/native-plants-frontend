import React, { useState, useEffect } from 'react';
import fetch from 'isomorphic-unfetch';
import Link from 'next/link';
import Layout from '../components/Layout';
import styles from '../components/Navbar.module.css'

export default function Lab() {

    return (
        <Layout>
            <ul className="pagelist">
                <li className="pagelist_item">
                    <Link href="/add-lab">
                      <a>Add Lab</a>
                    </Link>
                </li>
                <li className="pagelist_item">
                    <Link href="/get-labs">
                      <a>See Labs</a>
                    </Link>
                </li>
                <li className="pagelist_item">
                    <Link href="/delete-lab">
                      <a>Delete Lab</a>
                    </Link>
                </li>
                <li className="pagelist_item">
                    <Link href="/add-lab-test">
                      <a>Add Lab Test</a>
                    </Link>
                </li>
                <li className="pagelist_item">
                    <Link href="/get-lab-test">
                      <a>Get Lab Test</a>
                    </Link>
                </li>
            </ul>
        </Layout>
    );
}
