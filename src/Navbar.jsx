import { Outlet } from "react-router"
import React, { useState, useEffect, useContext } from "react"
import axios from "axios"
import { useNavigate } from 'react-router';
import { LogInContext } from './LoginProvider';

import "./css/NavBar.css";

function NavBar() {
    const { login, setLoginTrue, setLoginFalse, setNavAccountState, resetAccountState } = useContext(LogInContext)

    const navigate = useNavigate()

    async function logginOut() {
        try {
            const response = await axios.post("api/account/logout")
            setLoginFalse()
            resetAccountState()
            navigate('/login')
        } catch (error) {
            navigate('/welcome')
            console.log(e.message)
        }
    }

    function NavBarContent() {
        if (login.loginState) {
            return (
                <>
                    <div className="top-container">
                        <header class="top-header">
                            <nav className="navbar">
                                <ul className="navbar-nav">
                                    <li className="nav-item">
                                        <button className="nav-link" onClick={() => navigate('/')}>Home</button>
                                    </li>
                                    <li className="nav-item">
                                        <button className="nav-link" >{"Logedin as: " + login.accountState}</button>
                                    </li>
                                    <li className="nav-item">
                                        <button  className="nav-link"  onClick={() => logginOut()}>Logout</button>
                                    </li>
                                </ul>
                            </nav>
                        </header>
                    </div>
                   
                </>
            )

        } else {
            return (
                <div className="top-container">
                    <header class="top-header">
                        <nav className="navbar">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <button className="nav-link" onClick={() => navigate('/')}>Home</button>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link" onClick={() => navigate('/account')}>MyAccount</button>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link" onClick={() => navigate('/login')}>Login</button>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link" onClick={() => navigate('/register')}>Register</button>
                                </li>
                            </ul>
                        </nav>
                    </header>
                </div>

            )
        }
    }

    return (
        <>
            <div>
                {NavBarContent()}
            </div>
            <Outlet />
        </>

    )
}

export default NavBar


