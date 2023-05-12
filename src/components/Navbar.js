import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";
import { useSession, signIn, signOut } from 'next-auth/react';
import Login from "../pages/login.js";

export default function Navbar() {
    const [showNav, setShowNav] = React.useState(false);
    const [showLogin, setShowLogin] = React.useState(false);
    const onClickMenu = () => setShowNav(!showNav);
    const { data: session } = useSession();
    const onClickLogin = () => setShowLogin(!showLogin);

    return (
        <div>
            <div value="Navbar" id="top-navbar">
                <button id="navmenu-icon" onClick={onClickMenu}></button>
                {session ? <button id="login-signoutButton" onClick={signOut}>Sign Out</button> : <button id="login-signoutButton" onClick={onClickLogin}>Login</button>}
            </div>
            {showNav ? <Nav /> : null}
            {showLogin ? <Login /> : null}
        </div>
    )
}
const Nav = () => (
    <div id="navbar-container">
        <div class="navbar-title">
            <h2>PNW Marketplace</h2>
        </div>
        <ul class="nav-list">
            <li className="nav-list-item" >
                    <Link href="/">
                      <a>Home</a>
                    </Link>
            </li>
            <li className="nav-list-item">
                    <Link href="/farm-tab">
                      <a>Farm</a>
                    </Link>
            </li>
            <li className="nav-list-item">
                    <Link href="/lab-tab" className={styles.linkstyle}>
                      <a>Lab</a>
                    </Link>
            </li>
            <li className="nav-list-item">
                    <Link href="/plant-tab">
                      <a>Plants</a>
                    </Link>
            </li>
            <li className="nav-list-item">
                    <Link href="/nursery-tab">
                      <a>Nursery</a>
                    </Link>
            </li>
                 /*
            <li className="nav-list-item">
                    <Link href="/login">
                      <a>Login</a>
                    </Link>
            </li>
            */
            
            
            <li className="nav-list-item">
                    <Link href="/admin">
                      <a>Admin</a>
                    </Link>
            </li>
            <li className="nav-list-item">
                    <Link href="/map">
                      <a>Map</a>
                    </Link>
            </li>
        </ul>
           
    </div>
)
/*
<li className="nav-list-item">
  <Link href="/stand-tab">
    <a>Stand</a>
  </Link>
</li>
*/
