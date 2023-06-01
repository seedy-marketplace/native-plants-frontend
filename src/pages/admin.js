import React, { useState, useEffect } from 'react';
import fetch from 'isomorphic-unfetch';
import Link from 'next/link';
import Layout from '../components/Layout';
import styles from '../components/Navbar.module.css'

export default function Forms() {

    return (
        <Layout>
            <div className="pagelistContainer">
                <div className="pagelistTitle">
                    <h2>Navigate to Admin Page</h2>
                </div>
                <ul className="pagelist">
                    <li className="pagelist_item">
                        <Link href="/update-users">
                          <a>Update User</a>
                        </Link>
                    </li>
                    <li className="pagelist_item">
                        <Link href="/get-users">
                          <a>See Users</a>
                        </Link>
                    </li>
                    <li className="pagelist_item">
                        <Link href="/delete-user">
                          <a>Delete User</a>
                        </Link>
                    </li>
                    <li className="pagelist_item">
                        <Link href="/add-site">
                          <a>Add Site</a>
                        </Link>
                    </li>
                    <li className="pagelist_item">
                        <Link href="/add-want-list">
                          <a>Add Request</a>
                        </Link>
                    </li>
                    <li className="pagelist_item">
                        <Link href="/get-want-list">
                          <a>Get Requests</a>
                        </Link>
                    </li>
                    <li className="pagelist_item">
                        <Link href="/delete-want-list">
                          <a>Delete Requests</a>
                        </Link>
                    </li>
                    <li className="pagelist_item">
                        <Link href="/delete">
                          <a>Delete</a>
                        </Link>
                    </li>
                </ul>
            </div>
        </Layout>
    );
}
